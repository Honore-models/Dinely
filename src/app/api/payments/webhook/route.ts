import { NextResponse } from "next/server";
import {
  isValidJjumaSignature,
  parseJjumaWebhook,
} from "@/lib/jjuma";
import { markPaymentPaid, markPaymentTerminal } from "@/lib/payments";

export const runtime = "nodejs";

const SIGNATURE_HEADER = "X-Jjuma-Signature";
const TIMESTAMP_HEADER = "X-Jjuma-Timestamp";

const KNOWN_EVENTS = [
  "payment.completed",
  "payment.failed",
  "payment.cancelled",
] as const;

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER)?.trim() ?? "";
  const timestamp = request.headers.get(TIMESTAMP_HEADER)?.trim() ?? "";

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

  let event;
  try {
    event = parseJjumaWebhook(rawBody);
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const eventName = String(event.event ?? "").trim();
  const payment = event.data ?? {};

  if (!KNOWN_EVENTS.includes(eventName as (typeof KNOWN_EVENTS)[number])) {
    return NextResponse.json({ status: "ignored" });
  }

  const paymentId = String(payment.order_id ?? "").trim();
  if (!paymentId) {
    return NextResponse.json(
      { message: "Missing payment order_id." },
      { status: 400 },
    );
  }

  try {
    if (eventName === "payment.failed") {
      await markPaymentTerminal(paymentId, "failed");
      return NextResponse.json({ status: "ok" });
    }

    if (eventName === "payment.cancelled") {
      await markPaymentTerminal(paymentId, "cancelled");
      return NextResponse.json({ status: "ok" });
    }

    // payment.completed
    if (
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

    const result = await markPaymentPaid({
      paymentId,
      transactionId: String(payment.transaction_id),
      reference: String(payment.reference),
      amount: String(payment.amount),
      currency: String(payment.currency).toUpperCase(),
    });

    if (!result.ok) {
      if (result.reason === "not_found") {
        return NextResponse.json(
          { message: "Payment not found." },
          { status: 404 },
        );
      }
      if (
        result.reason === "amount_mismatch" ||
        result.reason === "currency_mismatch"
      ) {
        return NextResponse.json(
          { message: "Payment validation failed." },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { message: "Could not mark payment paid." },
        { status: 500 },
      );
    }

    if (result.alreadyProcessed) {
      return NextResponse.json({ status: "already_processed" });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[Jjuma Webhook] Handler error:", err);
    return NextResponse.json(
      { message: "Webhook handler failed." },
      { status: 500 },
    );
  }
}
