"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { ToggleBilling } from "../../../components/ui/ToggleBilling";
import { PlanCard } from "../../../components/onboarding/PlanCard";
import { useOnboardingStore, type PlanName } from "../../../store/onboardingStore";

const plans = [
  {
    name: "Starter" as const,
    price: 9,
    description: "Small restaurants starting out",
    features: ["Basic restaurant profile", "Menu management", "Limited orders"],
  },
  {
    name: "Professional" as const,
    price: 14,
    description: "Growing restaurants",
    features: ["Everything in Starter", "Unlimited orders", "Analytics dashboard", "Priority support"],
    isRecommended: true,
  },
  {
    name: "Enterprise" as const,
    price: 20,
    description: "Multi-branch restaurants",
    features: ["Multi-restaurant management", "Advanced analytics", "Custom integrations", "Dedicated support"],
  },
];

export default function StepThreePage() {
  const router = useRouter();
  const { selectedPlan, setSelectedPlan, billingCycle, setBillingCycle } = useOnboardingStore();

  return (
    <div className="mt-14">
      <p className="font-bold text-neutral-500">Step 3/4</p>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#22c51f]">Choose your plan</h1>
        <p className="mt-4 text-lg font-semibold text-neutral-600">
          Select a subscription plan that fits your restaurant&apos;s needs. You can upgrade or cancel anytime.
        </p>
        <div className="mt-7">
          <ToggleBilling value={billingCycle} onChange={setBillingCycle} />
        </div>
      </div>
      <div className="mt-9 grid items-center gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            isSelected={selectedPlan === plan.name}
            onClick={(name: PlanName) => setSelectedPlan(name)}
          />
        ))}
      </div>
      <div className="mt-10 flex items-end justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold">Any Question?</h2>
          <p className="mt-1 text-sm font-semibold text-neutral-500">
            <span className="text-[#22c51f]">Not sure?</span> You can start with a free trial or change your plan anytime.
          </p>
        </div>
        <Button type="button" onClick={() => router.push("/onboarding/step-4")}>
          Next
        </Button>
      </div>
    </div>
  );
}
