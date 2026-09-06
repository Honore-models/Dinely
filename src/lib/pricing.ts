import type { BillingCycle, PlanName } from "@/types/restaurant";

/** Catalog / UI prices are USD; JJuma is charged in RWF. */
export const PAYMENT_CURRENCY = "RWF" as const;

export const RWF_PER_USD = Number(process.env.JJUMA_RWF_PER_USD ?? "1350");

/** Order fees (USD, same units as menu prices). */
export const DELIVERY_FEE_USD = 1.09;
export const SERVICE_FEE_USD = 0.5;

/** Subscription list prices in USD (before tax). */
export const PLAN_PRICES_USD: Record<
  PlanName,
  { monthly: number; yearly: number }
> = {
  Starter: { monthly: 9, yearly: 7 },
  Professional: { monthly: 14, yearly: 11 },
  Enterprise: { monthly: 20, yearly: 16 },
};

export const SUBSCRIPTION_TAX_RATE = 0.1;

export function isPlanName(value: string): value is PlanName {
  return value in PLAN_PRICES_USD;
}

export function subscriptionTotalUsd(
  plan: PlanName,
  billingCycle: BillingCycle,
): number {
  const base = PLAN_PRICES_USD[plan][billingCycle];
  return Math.round((base + base * SUBSCRIPTION_TAX_RATE) * 100) / 100;
}

/** Convert a USD catalog amount to whole RWF francs for JJuma. */
export function usdToRwf(amountUsd: number): number {
  return Math.max(1, Math.round(amountUsd * RWF_PER_USD));
}

export function amountsNearlyEqual(
  a: number,
  b: number,
  tolerance = 1,
): boolean {
  return Math.abs(a - b) <= tolerance;
}

export function formatMoney(
  amount: number,
  currency: "USD" | "RWF" = "USD",
): string {
  if (currency === "RWF") {
    return `RWF ${Math.round(amount).toLocaleString("en-US")}`;
  }
  return `$${amount.toFixed(2)}`;
}
