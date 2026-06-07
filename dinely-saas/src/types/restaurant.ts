export type PlanName = "Starter" | "Professional" | "Enterprise";
export type BillingCycle = "monthly" | "yearly";

export interface Restaurant {
  _id?: string;
  ownerId: string;
  name: string;
  type: string;
  address: string;
  openingHours: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
  plan: PlanName;
  billingCycle: BillingCycle;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled";
  createdAt: Date;
  updatedAt: Date;
}
