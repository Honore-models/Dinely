"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  User,
  Building2,
  MapPin,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useOnboardingStore, type PlanName } from "@/store/onboardingStore";
import { VisaIcon, MastercardIcon, AmexIcon } from "../ui/Icons";
import { restaurantsApi, paymentsApi, authApi } from "@/lib/api";

const planPrices: Record<PlanName, number> = {
  Starter: 9,
  Professional: 14,
  Enterprise: 20,
};

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

type SetupStep = "payment" | "registering" | "creating" | "done" | "error";

export function PaymentForm() {
  const router = useRouter();
  const { selectedPlan, billingCycle, restaurantInfo, ownerInfo } =
    useOnboardingStore();
  const price = planPrices[selectedPlan];
  const tax = Number((price * 0.1).toFixed(2));
  const total = price + tax;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<SetupStep>("payment");

  // Payment form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

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
        // If already registered (e.g. page refresh), continue
        if (
          !msg.includes("already exists") &&
          !msg.includes("already have")
        ) {
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

      // Step 3: Try Stripe Checkout (optional — skip if not configured)
      try {
        const { url } = await paymentsApi.createCheckout(
          selectedPlan,
          billingCycle
        );
        if (url) {
          window.location.href = url;
          return;
        }
      } catch {
        // Stripe not configured — go straight to dashboard
      }

      // Done — redirect to dashboard
      setStep("done");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setStep("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100">
          <Check size={32} className="text-[#22c51f]" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-neutral-900">
          All Set!
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Your restaurant is being set up. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-sm font-bold text-neutral-400">Step 4 of 4</p>
      <h1 className="mt-2 text-2xl font-extrabold text-neutral-900">
        Complete Your Setup
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Confirm your plan and add payment details to activate your restaurant
        account.
      </p>
      <div className="mt-4 h-px bg-neutral-100" />

      {/* Loading overlay */}
      {(step === "registering" || step === "creating") && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {step === "registering"
              ? "Creating your account..."
              : "Setting up your restaurant..."}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <p className="font-medium">Setup failed</p>
          <p className="mt-0.5">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep("payment");
            }}
            className="mt-2 text-xs font-bold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Payment form */}
        <div className="max-w-lg">
          <h2 className="flex items-center gap-2 text-base font-bold text-neutral-700">
            <CreditCard size={18} className="text-[#22c51f]" />
            Payment Details
          </h2>

          <div className="mt-4 space-y-3">
            <Input
              label="Cardholder Name"
              placeholder="Name on card"
              icon={<User size={16} />}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                Card Number
              </span>
              <div className="relative">
                <CreditCard
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={16}
                />
                <input
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 pl-10 pr-32 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                />
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                  <AmexIcon className="h-5 w-[28px]" />
                  <VisaIcon className="h-5 w-[28px]" />
                  <MastercardIcon className="h-5 w-[36px]" />
                </div>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Expiry"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) =>
                  setCardExpiry(formatExpiry(e.target.value))
                }
                maxLength={5}
              />
              <Input
                label="CVC"
                placeholder="123"
                value={cardCvc}
                onChange={(e) =>
                  setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                maxLength={4}
              />
            </div>

            {/* Billing Address */}
            <div className="pt-2">
              <h3 className="mb-3 text-sm font-bold text-neutral-700">
                Billing Address
              </h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Country
                  </span>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={16}
                    />
                    <select
                      className="h-12 w-full appearance-none rounded-lg border border-neutral-200 bg-neutral-50/50 pl-10 pr-10 text-sm text-neutral-700 outline-none transition focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="">Select country</option>
                      <option value="RW">Rwanda</option>
                      <option value="KE">Kenya</option>
                      <option value="UG">Uganda</option>
                      <option value="TZ">Tanzania</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    placeholder="Kigali"
                    icon={<Building2 size={16} />}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    label="ZIP / Postal Code"
                    placeholder="00000"
                    icon={<MapPin size={16} />}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#22c51f]">
                <ShieldCheck size={18} className="text-white" />
              </span>
              <p className="text-xs font-medium text-neutral-600">
                Your payment is secure and encrypted. You will only be charged
                after confirmation.
              </p>
            </div>            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleActivate}
              disabled={loading || step === "registering" || step === "creating"
            }>
              {loading || step === "registering" || step === "creating" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <LockKeyhole size={18} />
                  Activate Subscription
                </>
              )}
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-neutral-500">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#22c51f]" size={14} />{" "}
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
        <aside className="h-fit rounded-2xl border border-green-100 bg-white p-5 shadow-lg shadow-green-50">
          <h2 className="text-base font-bold text-neutral-900">
            Order Summary
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-100">
              <Award size={20} className="text-yellow-500" />
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900">
                {selectedPlan} Plan
              </p>
              <p className="text-xs capitalize text-neutral-500">
                {billingCycle} billing
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 border-b border-neutral-100 pb-4 text-sm text-neutral-600">
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
            <span>Total Due Today</span>
            <span className="text-[#22c51f]">${total.toFixed(2)}</span>
          </p>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <h3 className="text-sm font-bold text-[#22c51f]">
              What&apos;s Included
            </h3>
            <ul className="mt-3 space-y-2.5">
              {planFeatures[selectedPlan].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-xs text-neutral-600"
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
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <h3 className="text-sm font-bold text-neutral-700">
              Restaurant
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              {restaurantInfo.name || "Not set"}
            </p>
            <p className="text-xs text-neutral-400">
              {restaurantInfo.type || "Not set"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
