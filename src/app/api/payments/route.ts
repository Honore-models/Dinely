import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createPayment, env } from "@/lib/jjuma";
import { isJjumaConfigured } from "@/lib/jjuma-env";
import { createPaymentRecord } from "@/lib/payments";
import {
  isPlanName,
  PAYMENT_CURRENCY,
  subscriptionTotalUsd,
  usdToRwf,
} from "@/lib/pricing";
import type { BillingCycle, PlanName } from "@/types/restaurant";

/**
 * POST /api/payments – create a JJuma subscription checkout session.
 * Returns { url } so the onboarding PaymentForm can redirect.
 */
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isJjumaConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured. Contact support." },
      { status: 503 },
    );
  }

  let body: { plan?: string; billingCycle?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = body.plan ?? "";
  const billingCycle = body.billingCycle ?? "";

  if (!isPlanName(plan)) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }
  if (billingCycle !== "monthly" && billingCycle !== "yearly") {
    return NextResponse.json(
      { error: "Invalid billing cycle." },
      { status: 400 },
    );
  }

  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, subscription_status, plan, billing_cycle")
      .eq("owner_id", session.userId)
      .maybeSingle();

    if (!restaurant) {
      return NextResponse.json(
        { error: "Create your restaurant before paying." },
        { status: 404 },
      );
    }

    if (restaurant.subscription_status === "active") {
      return NextResponse.json(
        { error: "Subscription is already active." },
        { status: 409 },
      );
    }

    const typedPlan = plan as PlanName;
    const typedCycle = billingCycle as BillingCycle;
    const amountUsd = subscriptionTotalUsd(typedPlan, typedCycle);
    const amountRwf = usdToRwf(amountUsd);
    const idempotencyKey = `sub-${restaurant.id}-${typedPlan}-${typedCycle}`;

    const { payment, alreadyPaid } = await createPaymentRecord({
      kind: "subscription",
      referenceId: restaurant.id,
      userId: session.userId,
      amount: amountRwf,
      currency: PAYMENT_CURRENCY,
      idempotencyKey,
      description: `Dinely ${typedPlan} (${typedCycle})`,
      plan: typedPlan,
      billingCycle: typedCycle,
    });

    if (alreadyPaid) {
      return NextResponse.json(
        { error: "This subscription has already been paid." },
        { status: 409 },
      );
    }

    // Keep restaurant plan in sync with what the owner is about to pay for.
    await supabase
      .from("restaurants")
      .update({
        plan: typedPlan,
        billing_cycle: typedCycle,
        updated_at: new Date().toISOString(),
      })
      .eq("id", restaurant.id);

    const appUrl = env.APP_URL.replace(/\/$/, "");
    const result = await createPayment({
      amount: String(amountRwf),
      currency: PAYMENT_CURRENCY,
      description: `Dinely subscription — ${typedPlan} (${typedCycle})`,
      redirect_url: `${appUrl}/payment/success?kind=subscription&paymentId=${encodeURIComponent(payment.id)}`,
      cancel_redirect_url: `${appUrl}/payment/cancelled?kind=subscription&paymentId=${encodeURIComponent(payment.id)}`,
      webhook_url: `${appUrl}/api/payments/webhook`,
      external_order_id: payment.id,
      idempotency_key: idempotencyKey,
    });

    const paymentUrl = result.data?.payment_url ?? result.payment_url ?? "";
    if (!paymentUrl) {
      return NextResponse.json(
        { error: "JJuma did not return a payment URL." },
        { status: 502 },
      );
    }

    const checkoutHost = new URL(paymentUrl).host;
    if (checkoutHost !== env.JJUMA_CHECKOUT_HOST) {
      return NextResponse.json(
        { error: "Untrusted checkout destination." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: paymentUrl, paymentId: payment.id });
  } catch (err) {
    console.error("[POST /api/payments]", err);
    return NextResponse.json(
      { error: "Payment setup failed" },
      { status: 500 },
    );
  }
}
