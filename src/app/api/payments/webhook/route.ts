import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  isValidJjumaSignature,
  parseJjumaWebhook,
  type JjumaWebhookEvent,
} from "@/lib/jjuma";
import { env } from "@/lib/jjuma";

export const runtime = "nodejs";

// Headers specified in the JJuma webhook docs.
const SIGNATURE_HEADER = "X-Jjuma-Signature";
const TIMESTAMP_HEADER = "X-Jjuma-Timestamp";

// Events worth handling per the guide.
const KNOWN_EVENTS = [
  "payment.completed",
  "payment.failed",
  "payment.cancelled",
] as const;

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get(SIGNATURE_HEADER)?.trim() ?? "";
  const timestamp =
    request.headers.get(TIMESTAMP_HEADER)?.trim() ?? "";

  if (!rawBody || !signature || !timestamp) {
    return NextResponse.json(
      { message: "Missing webhook data." },
      { status: 400 },
    );
  }

  if (Number.isNaN(Date.parse(timestamp))) {
    return NextResponse.json(
      { message: "Invalid webhook timestamp." },
      { status: 401 },
    );
  }

  if (!isValidJjumaSignature(rawBody, timestamp, signature)) {
    return NextResponse.json(
      { message: "Invalid webhook signature." },
      { status: 401 },
    );
  }

  const event = parseJjumaWebhook(rawBody);
  const eventName = String(event.event ?? "").trim();
  const payment = event.data ?? {};

  if (!KNOWN_EVENTS.includes(eventName as (typeof KNOWN_EVENTS)[number])) {
    return NextResponse.json({ status: "ignored" });
  }

  if (eventName !== "payment.completed") {
    // payment.failed / payment.cancelled: nothing to mark paid.
    return NextResponse.json({ status: "ok" });
  }

  // Validate required fields for a completed payment.
  if (
    !payment.order_id ||
    !payment.transaction_id ||
    !payment.reference ||
    payment.amount === undefined ||
    !payment.currency
  ) {
    return NextResponse.json(
      { message: "Completed payment is missing required fields." },
      { status: 400 },
    );
  }

  try {
    // Reconcile against Supabase state before marking anything paid.
    // This uses the existing users/restaurants tables. If you later add a
    // dedicated payments/orders table (like the guide's Prisma Order model),
    // move this logic there and mirror the guide's markOrderPaid() flow.
    await reconcileCompletedPayment({
      orderId: payment.order_id as string,
      transactionId: payment.transaction_id as string,
      reference: payment.reference as string,
      amount: String(payment.amount),
      currency: (payment.currency as string).toUpperCase(),
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[Jjuma Webhook] Handler error:", err);
    return NextResponse.json(
      { message: "Webhook handler failed." },
      { status: 500 },
    );
  }
}

/**
 * Idempotently mark a JJuma payment as reconciled in Supabase.
 * Replace with a dedicated payments table once one exists.
 */
async function reconcileCompletedPayment({
  orderId,
  transactionId,
  reference,
  amount,
  currency,
}: {
  orderId: string;
  transactionId: string;
  reference: string;
  amount: string;
  currency: string;
}) {
  // Currency is expected to be RWF for this project.
  if (currency !== "RWF") {
    console.warn(
      `[Jjuma Webhook] Unexpected currency ${currency} for order ${orderId}.`
    );
  }

  // TODO: once you add a payments/orders table with columns like
  //   jjuma_transaction_id (uuid/text, unique)
  //   jjuma_reference (text)
  //   paid_amount (numeric)
  //   currency (text)
  //   paid_at (timestamptz)
  //   payment_status (text)
  // move this into a Supabase update inside a transaction/row lock, exactly
  // like the guide's markOrderPaid(). For now we log and store on the user
  // record as a minimal reconciliation placeholder.
  const { error } = await supabase
    .from("users")
    .update({
      // Example placeholder fields — replace with real payment tracking.
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    throw error;
  }
}
