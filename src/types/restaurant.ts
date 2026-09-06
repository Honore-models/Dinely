export type PlanName = "Starter" | "Professional" | "Enterprise";
export type BillingCycle = "monthly" | "yearly";

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  address: string;
  opening_hours: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
  plan: PlanName;
  billing_cycle: BillingCycle;
  /** @deprecated Stripe leftovers — prefer jjuma_subscription_ref */
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  jjuma_subscription_ref?: string | null;
  subscription_paid_at?: string | null;
  subscription_status: "active" | "trialing" | "past_due" | "canceled";
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}
