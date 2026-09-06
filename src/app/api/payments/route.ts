import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createPayment, env } from "@/lib/jjuma";
import type { PlanName } from "@/types/restaurant";

// POST /api/payments – create a JJuma payment and return the hosted checkout URL.
// Keeps the existing { url } contract so the onboarding PaymentForm can redirect.
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan: string; billingCycle: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { plan, billingCycle } = body;

  if (!["Starter", "Professional", "Enterprise"].includes(plan)) {
    return NextResponse.json(
      { error: "Invalid plan." },
      { status: 400 },
    );
  }

  if (!["monthly", "yearly"].includes(billingCycle)) {
    return NextResponse.json(
      { error: "Invalid billing cycle." },
      { status: 400 },
    );
  }

  try {
    const { data: user } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("id", session.userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // JJuma create-payment payload — mirrors the guide's shape.
    // The guide uses one-off order payments; here we reuse the same endpoint
    // for a subscription checkout. Adjust amount/currency/description once
    // you confirm the exact plan prices and JJuma product mapping.
    const amount = planPriceInSmallUnits(plan, billingCycle);
    const payload = {
      amount: String(amount),
      currency: "RWF",
      description: `Dinely subscription — ${plan} (${billingCycle})`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/step-4?cancelled=true`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      external_order_id: session.userId,
      idempotency_key: `sub-${session.userId}-${plan}-${billingCycle}`,
    };

    const result = await createPayment(payload);
    const paymentUrl =
      result.data?.payment_url ?? result.payment_url ?? "";

    if (!paymentUrl) {
      return NextResponse.json(
        { error: "JJuma did not return a payment URL." },
        { status: 502 },
      );
    }

    // Trust check: ensure the returned checkout URL points at JJuma's host.
    const checkoutHost = new URL(paymentUrl).host;
    if (checkoutHost !== env.JJUMA_CHECKOUT_HOST) {
      return NextResponse.json(
        { error: "Untrusted checkout destination." },
        { status: 502 },
      );
    }

    // Persist a reference so the webhook can reconcile later.
    await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", session.userId);

    return NextResponse.json({ url: paymentUrl });
  } catch (err) {
    console.error("[POST /api/payments]", err);
    return NextResponse.json(
      { error: "Payment setup failed" },
      { status: 500 },
    );
  }
}

function planPriceInSmallUnits(plan: string, billingCycle: string): number {
  // Prices shown on the pricing page / onboarding form (in USD).
  // Convert to RWF at the rate you want to use.
  const pricesUSD: Record<string, number> = {
    Starter: billingCycle === "yearly" ? 7 : 9,
    Professional: billingCycle === "yearly" ? 11 : 14,
    Enterprise: billingCycle === "yearly" ? 16 : 20,
  };
  const usd = pricesUSD[plan] ?? 0;
  // RWF is commonly expressed in whole francs (no cents).
  // Replace RWf_PER_USD with the rate you want to charge.
  const rwfPerUSD = 1350;
  // If JJuma expects cents/coins for RWF, adjust this multiplier.
  // If it expects whole francs, use multiplier 1.
  const subunitMultiplier = 1;
  return Math.round(usd * rwfPerUSD * subunitMultiplier);
}
