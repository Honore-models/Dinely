"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Award,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useOnboardingStore, type PlanName } from "@/store/onboardingStore";
import { restaurantsApi, paymentsApi, authApi } from "@/lib/api";
import {
  PLAN_PRICES_USD,
  SUBSCRIPTION_TAX_RATE,
} from "@/lib/pricing";

const planPrices = PLAN_PRICES_USD;

const planFeatures: Record<PlanName, string[]> = {
  Starter: [
    "Restaurant profile page",
    "Menu management (up to 30 items)",
    "Up to 100 orders/month",
    "Basic analytics",
    "Email support",
  ],
  Professional: [
    "Everything in Starter",
    "Unlimited menu items & orders",
    "Advanced analytics dashboard",
    "Table bookings & management",
    "Priority support",
    "Customer insights",
  ],
  Enterprise: [
    "Multi-restaurant management",
    "Advanced analytics",
    "Custom integrations (POS, delivery)",
    "Dedicated account manager",
    "API access & custom branding",
  ],
};

type SetupStep =
  | "payment"
  | "registering"
  | "creating"
  | "processing"
  | "done"
  | "error";

export function PaymentForm() {
  const { selectedPlan, billingCycle, restaurantInfo, ownerInfo } =
    useOnboardingStore();
  const price = planPrices[selectedPlan][billingCycle];
  const tax = Number((price * SUBSCRIPTION_TAX_RATE).toFixed(2));
  const total = price + tax;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<SetupStep>("payment");

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Register the owner account
      setStep("registering");
      try {
        await authApi.register(ownerInfo);
      } catch (regErr) {
        const msg = regErr instanceof Error ? regErr.message : "";
        if (!msg.includes("already exists") && !msg.includes("already have")) {
          throw regErr;
        }
      }

      // Step 2: Create the restaurant record
      setStep("creating");
      await restaurantsApi.create({
        ...restaurantInfo,
        plan: selectedPlan,
        billingCycle,
      });

      // Step 3: Create Jjuma Checkout session and redirect
      setStep("processing");
      const { url } = await paymentsApi.createCheckout(
        selectedPlan,
        billingCycle,
      );
      if (!url) {
        throw new Error("Payment checkout did not return a URL.");
      }
      window.location.href = url;
      return;
    } catch (err) {
      setStep("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 dark:bg-green-950">
          <Check size={32} className="text-[#22c51f]" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-white">
          All Set!
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Your restaurant is being set up. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500">
        Step 4 of 4
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">
        Complete Your Setup
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Confirm your plan and activate your restaurant account.
      </p>
      <div className="mt-4 h-px bg-neutral-100 dark:bg-neutral-800" />

      {/* Status steps */}
      {(step === "registering" ||
        step === "creating" ||
        step === "processing") && (
        <div className="mt-4 space-y-2">
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${step === "registering" ? "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400" : "text-neutral-400"}`}
          >
            {step === "registering" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} className="text-green-500" />
            )}
            Creating your account...
          </div>
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${step === "creating" ? "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400" : step === "processing" ? "text-neutral-400" : "text-neutral-300"}`}
          >
            {step === "creating" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : step === "processing" ? (
              <CheckCircle2 size={16} className="text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-neutral-200" />
            )}
            Setting up your restaurant...
          </div>
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${step === "processing" ? "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400" : "text-neutral-300"}`}
          >
            {step === "processing" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-neutral-200" />
            )}
            Redirecting to secure payment...
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          <p className="font-medium">Setup failed</p>
          <p className="mt-0.5">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep("payment");
            }}
            className="mt-2 text-xs font-bold text-red-700 underline dark:text-red-400"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Payment info */}
        <div className="max-w-lg">
          <h2 className="flex items-center gap-2 text-base font-bold text-neutral-700 dark:text-neutral-300">
            <CreditCard size={18} className="text-[#22c51f]" />
            Payment
          </h2>

          <div className="mt-4 space-y-4">
            {/* Security badge */}
            <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/50">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f]">
                <ShieldCheck size={20} className="text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                  Secure Payment by Jjuma
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Your payment is processed securely by Jjuma. We never store
                  your card details.
                </p>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                How payment works
              </h3>
              <ol className="mt-3 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-100 text-xs font-bold text-[#22c51f] dark:bg-green-900">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Click &ldquo;Activate Subscription&rdquo;
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      You&apos;ll be redirected to Jjuma&apos;s secure checkout
                      page
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-100 text-xs font-bold text-[#22c51f] dark:bg-green-900">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Enter your card details
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Pay securely with credit/debit card on Jjuma&apos;s page
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-100 text-xs font-bold text-[#22c51f] dark:bg-green-900">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Start managing your restaurant
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      You&apos;ll be redirected back to your dashboard
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleActivate}
              loading={
                loading ||
                step === "registering" ||
                step === "creating" ||
                step === "processing"
              }
              loadingText={
                step === "registering"
                  ? "Creating account..."
                  : step === "creating"
                    ? "Setting up restaurant..."
                    : step === "processing"
                      ? "Redirecting to Jjuma..."
                      : "Processing..."
              }
            >
              <LockKeyhole size={18} />
              Activate Subscription
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
              <ExternalLink size={12} />
              <span>Powered by Jjuma</span>
            </div>

            <p className="flex items-start gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[#22c51f]"
                size={14}
              />{" "}
              By proceeding, you agree to our{" "}
              <Link href="/privacy" className="font-semibold text-[#22c51f]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-[#22c51f]">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="h-fit rounded-2xl border border-green-100 bg-white p-5 shadow-lg shadow-green-50 dark:border-green-900 dark:bg-neutral-900 dark:shadow-green-950/50">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Order Summary
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-100 dark:bg-green-950">
              <Award size={20} className="text-yellow-500" />
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                {selectedPlan} Plan
              </p>
              <p className="text-xs capitalize text-neutral-500 dark:text-neutral-400">
                {billingCycle} billing
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 border-b border-neutral-100 pb-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            <p className="flex justify-between">
              <span>Subscription ({billingCycle})</span>
              <span className="font-semibold">${price.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (10%)</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </p>
          </div>

          <p className="mt-3 flex justify-between text-sm font-bold">
            <span className="text-neutral-900 dark:text-white">
              Total Due Today
            </span>
            <span className="text-[#22c51f]">${total.toFixed(2)}</span>
          </p>

          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-[#22c51f]">
              What&apos;s Included
            </h3>
            <ul className="mt-3 space-y-2.5">
              {planFeatures[selectedPlan].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                >
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-[#22c51f]"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Restaurant info preview */}
          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Restaurant
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {restaurantInfo.name || "Not set"}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {restaurantInfo.type || "Not set"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
