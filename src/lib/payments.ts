import { supabase } from "@/lib/supabase";
import type { BillingCycle, PlanName } from "@/types/restaurant";

export type PaymentKind = "subscription" | "order";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type PaymentRow = {
  id: string;
  kind: PaymentKind;
  reference_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  plan: string | null;
  billing_cycle: string | null;
  jjuma_transaction_id: string | null;
  jjuma_reference: string | null;
  idempotency_key: string;
  description: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getPaymentById(id: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as PaymentRow | null;
}

export async function createPaymentRecord(args: {
  kind: PaymentKind;
  referenceId: string;
  userId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  description: string;
  plan?: PlanName;
  billingCycle?: BillingCycle;
}) {
  // Reuse an existing pending row for the same idempotency key.
  const { data: existing } = await supabase
    .from("payments")
    .select("*")
    .eq("idempotency_key", args.idempotencyKey)
    .maybeSingle();

  if (existing) {
    if (existing.status === "paid") {
      return { payment: existing as PaymentRow, created: false, alreadyPaid: true };
    }
    return { payment: existing as PaymentRow, created: false, alreadyPaid: false };
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      kind: args.kind,
      reference_id: args.referenceId,
      user_id: args.userId,
      amount: args.amount,
      currency: args.currency,
      status: "pending",
      plan: args.plan ?? null,
      billing_cycle: args.billingCycle ?? null,
      idempotency_key: args.idempotencyKey,
      description: args.description,
    })
    .select("*")
    .single();

  if (error) {
    // Concurrent create with the same idempotency key.
    if (error.code === "23505") {
      const { data: raced } = await supabase
        .from("payments")
        .select("*")
        .eq("idempotency_key", args.idempotencyKey)
        .maybeSingle();
      if (raced) {
        return {
          payment: raced as PaymentRow,
          created: false,
          alreadyPaid: raced.status === "paid",
        };
      }
    }
    throw error;
  }
  return { payment: data as PaymentRow, created: true, alreadyPaid: false };
}

/**
 * Idempotently mark a payment paid and apply side effects
 * (activate subscription or mark order paid).
 */
export async function markPaymentPaid(args: {
  paymentId: string;
  transactionId: string;
  reference: string;
  amount: string;
  currency: string;
}) {
  const payment = await getPaymentById(args.paymentId);
  if (!payment) {
    return { ok: false as const, reason: "not_found" as const };
  }

  if (payment.status === "paid") {
    return { ok: true as const, alreadyProcessed: true as const, payment };
  }

  const expectedAmount = Number(payment.amount);
  const paidAmount = Number(args.amount);
  if (
    Number.isNaN(paidAmount) ||
    Math.abs(expectedAmount - paidAmount) > 1
  ) {
    console.error(
      `[payments] Amount mismatch for ${payment.id}: expected ${expectedAmount}, got ${paidAmount}`,
    );
    return { ok: false as const, reason: "amount_mismatch" as const };
  }

  if (args.currency.toUpperCase() !== String(payment.currency).toUpperCase()) {
    console.error(
      `[payments] Currency mismatch for ${payment.id}: expected ${payment.currency}, got ${args.currency}`,
    );
    return { ok: false as const, reason: "currency_mismatch" as const };
  }

  const now = new Date().toISOString();

  const { data: updated, error: payError } = await supabase
    .from("payments")
    .update({
      status: "paid",
      jjuma_transaction_id: args.transactionId,
      jjuma_reference: args.reference,
      paid_at: now,
      updated_at: now,
    })
    .eq("id", payment.id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (payError) throw payError;

  // Another delivery already flipped it to paid.
  if (!updated) {
    const again = await getPaymentById(payment.id);
    if (again?.status === "paid") {
      return { ok: true as const, alreadyProcessed: true as const, payment: again };
    }
    return { ok: false as const, reason: "update_failed" as const };
  }

  if (payment.kind === "subscription") {
    const restaurantUpdate: Record<string, string> = {
      subscription_status: "active",
      jjuma_subscription_ref: args.reference,
      subscription_paid_at: now,
      updated_at: now,
    };
    if (payment.plan) restaurantUpdate.plan = payment.plan;
    if (payment.billing_cycle) restaurantUpdate.billing_cycle = payment.billing_cycle;

    const { error } = await supabase
      .from("restaurants")
      .update(restaurantUpdate)
      .eq("id", payment.reference_id);

    if (error) throw error;
  } else if (payment.kind === "order") {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        jjuma_transaction_id: args.transactionId,
        jjuma_reference: args.reference,
        paid_at: now,
        updated_at: now,
      })
      .eq("id", payment.reference_id)
      .in("payment_status", ["awaiting_payment", "unpaid"]);

    if (error) throw error;
  }

  return {
    ok: true as const,
    alreadyProcessed: false as const,
    payment: updated as PaymentRow,
  };
}

export async function markPaymentTerminal(
  paymentId: string,
  status: "failed" | "cancelled",
) {
  const now = new Date().toISOString();
  const { data: payment, error } = await supabase
    .from("payments")
    .update({ status, updated_at: now })
    .eq("id", paymentId)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!payment) return null;

  if (payment.kind === "order") {
    await supabase
      .from("orders")
      .update({
        payment_status: status === "failed" ? "failed" : "cancelled",
        updated_at: now,
      })
      .eq("id", payment.reference_id)
      .eq("payment_status", "awaiting_payment");
  }

  return payment as PaymentRow;
}
