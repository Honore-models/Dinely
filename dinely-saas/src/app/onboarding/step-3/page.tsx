"use client";

import { useRouter } from "next/navigation";
import { Award, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToggleBilling } from "@/components/ui/ToggleBilling";
import { useOnboardingStore, type PlanName } from "@/store/onboardingStore";

const plans: {
  name: PlanName;
  monthly: number;
  yearly: number;
  description: string;
  features: string[];
  recommended?: boolean;
}[] = [
  {
    name: "Starter",
    monthly: 9,
    yearly: 7,
    description: "For small restaurants just getting started",
    features: [
      "Restaurant profile page",
      "Menu management (up to 30 items)",
      "Up to 100 orders/month",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Professional",
    monthly: 14,
    yearly: 11,
    description: "For growing restaurants that need more power",
    features: [
      "Everything in Starter",
      "Unlimited menu items & orders",
      "Advanced analytics dashboard",
      "Table bookings & management",
      "Priority support",
      "Customer insights",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    monthly: 20,
    yearly: 16,
    description: "For multi-branch restaurants and chains",
    features: [
      "Everything in Professional",
      "Multi-restaurant management",
      "Custom integrations (POS, delivery)",
      "Dedicated account manager",
      "API access & custom branding",
    ],
  },
];

export default function StepThreePage() {
  const router = useRouter();
  const { selectedPlan, setSelectedPlan, billingCycle, setBillingCycle } =
    useOnboardingStore();

  const getPrice = (plan: (typeof plans)[number]) =>
    billingCycle === "yearly" ? plan.yearly : plan.monthly;

  return (
    <div className="mt-2">
      <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500">Step 3 of 4</p>
      <h1 className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">
        Choose Your Plan
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Select a subscription plan that fits your restaurant&apos;s needs. You
        can upgrade or cancel anytime.
      </p>
      <div className="mt-4 h-px bg-neutral-100 dark:bg-neutral-800" />

      <div className="mt-5 flex items-center justify-center gap-3">
        <ToggleBilling value={billingCycle} onChange={setBillingCycle} />
        {billingCycle === "yearly" && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-[#22c51f] dark:bg-green-950 dark:text-green-400">
            Save up to 20%
          </span>
        )}
      </div>

      <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          const price = getPrice(plan);

          return (
            <button
              key={plan.name}
              type="button"
              onClick={() => setSelectedPlan(plan.name)}
              className={`group relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#22c51f] bg-green-50/40 shadow-lg shadow-green-100/50 dark:bg-green-950/30 dark:shadow-green-950/50"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#22c51f] px-3 py-1 text-[10px] font-bold text-white shadow-sm">
                  <Zap size={10} className="fill-white" />
                  Most Popular
                </span>
              )}

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {plan.description}
                  </p>
                </div>
                {plan.recommended && (
                  <span className="shrink-0 rounded-lg bg-yellow-100 p-1.5 dark:bg-yellow-950">
                    <Award size={18} className="text-yellow-500" />
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                  ${price}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">/month</span>
              </div>
              {billingCycle === "yearly" ? (
                <div className="mt-0.5 flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#22c51f]">
                    Billed annually (${price * 12}/yr)
                  </p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-[#22c51f] dark:bg-green-950 dark:text-green-400">
                    Save ${Math.round((1 - price / plan.monthly) * 100)}%
                  </span>
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                  Billed monthly
                </p>
              )}

              {/* Features */}
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-300"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-[#22c51f]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Select indicator */}
              <div
                className={`mt-5 flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition-all ${
                  isSelected
                    ? "border-[#22c51f] bg-[#22c51f] text-white"
                    : "border-neutral-200 text-neutral-500 group-hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-400 dark:group-hover:border-neutral-600"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={16} />
                    Selected
                  </>
                ) : (
                  "Select Plan"
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Any Questions?</h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-[#22c51f]">Not sure?</span> You
            can start with a free trial or change your plan anytime.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={() => router.push("/onboarding/step-4")}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
