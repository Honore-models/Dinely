"use client";

import Link from "next/link";
import { Award, Building2, CheckCircle2, CreditCard, LockKeyhole, MapPin, ShieldCheck, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useOnboardingStore, type PlanName } from "../../store/onboardingStore";
import { VisaIcon, MastercardIcon, PaypalIcon, AmexIcon } from "../ui/Icons";

const planPrices: Record<PlanName, number> = {
  Starter: 9,
  Professional: 14,
  Enterprise: 20,
};

const planFeatures: Record<PlanName, string[]> = {
  Starter: ["Basic restaurant profile", "Menu management", "Limited orders"],
  Professional: ["Everything in Starter", "Unlimited Orders", "Analytics Dashboard", "Priority Support", "Advanced Menu Management"],
  Enterprise: ["Multi-restaurant management", "Advanced analytics", "Custom integrations", "Dedicated support"],
};

export function PaymentForm() {
  const { selectedPlan } = useOnboardingStore();
  const price = planPrices[selectedPlan];
  const tax = selectedPlan === "Professional" ? 3.9 : Number((price * 0.1).toFixed(2));
  const total = price + tax;

  return (
    <div className="mt-2">
      <p className="font-bold text-neutral-500">Step 4/4</p>
      <h1 className="mt-1 text-2xl font-bold text-neutral-800">Complete your setup</h1>
      <p className="mt-1 text-base font-semibold text-neutral-600">
        Confirm your plan and add payment details to activate your restaurant account.
      </p>
      <div className="mt-2 h-px bg-neutral-200" />

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_315px]">
        <form className="max-w-lg">
          <h2 className="mb-3 flex items-center gap-3 text-xl font-bold text-neutral-500">
            <CreditCard className="fill-[#22c51f] text-[#22c51f]" /> Payment Details
          </h2>
          <div className="space-y-3">
            <Input label="Cardholder Name" placeholder="Name on card" icon={<User size={20} />} />
            <label className="block">
              <span className="mb-1 block text-base font-semibold text-black">Card Details</span>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="relative md:col-span-2">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={22} />
                  <input
                    className="h-11 w-full rounded-lg border border-neutral-200 pr-40 pl-14 text-base font-semibold outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-4 focus:ring-green-100"
                    placeholder="1234 1234 1234 1234"
                  />
                  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    <AmexIcon className="h-6 w-[34px]" />
                    <VisaIcon className="h-6 w-[34px]" />
                    <MastercardIcon className="h-7 w-[44px]" />
                    <PaypalIcon className="h-6 w-[26px]" />
                  </div>
                </div>
                <Input label="" placeholder="MM/YY" icon={<CreditCard size={20} />} />
                <Input label="" placeholder="CVC" icon={<LockKeyhole size={20} />} />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-semibold text-black">Billing Address</span>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                  <select className="h-11 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-12 text-base font-semibold text-neutral-500 outline-none focus:border-[#22c51f] focus:ring-4 focus:ring-green-100">
                    <option>Country</option>
                    <option>Rwanda</option>
                    <option>Kenya</option>
                    <option>Uganda</option>
                  </select>
                </div>
                <Input label="" placeholder="City" icon={<Building2 size={20} />} />
                <Input label="" placeholder="ZIP/Postal Code" icon={<MapPin size={20} />} />
              </div>
            </label>
            <div className="flex items-center gap-4 rounded-lg border border-green-100 bg-green-50 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#63d658] text-white">
                <ShieldCheck />
              </span>
              <p className="font-semibold text-neutral-600">
                Your payment is secure and encrypted
                <span className="block">You will only be charged after Confirmation</span>
              </p>
            </div>
            <Button type="button" className="h-12 w-full text-xl">
              <LockKeyhole size={22} /> Activate Subscription
            </Button>
            <p className="flex items-start gap-2 text-sm font-semibold text-neutral-600">
              <ShieldCheck className="shrink-0 text-[#22c51f]" size={22} /> By proceeding, you agree to our{" "}
              <Link href="/terms" className="text-[#22c51f]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#22c51f]">
                Privacy policy
              </Link>
            </p>
          </div>
        </form>

        <aside className="rounded-xl border border-green-100 bg-white p-4 shadow-lg shadow-green-100">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-12 w-14 place-items-center rounded-lg bg-green-100">
              <Award className="fill-yellow-300 text-yellow-400" />
            </span>
            <div>
              <p className="text-base font-bold text-neutral-700">{selectedPlan} Plan</p>
              <p className="font-semibold text-neutral-400">Monthly Subscription</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-b border-neutral-200 pb-4 text-sm font-bold text-neutral-700">
            <p className="flex justify-between">
              <span>Subscription(Monthly)</span>
              <span>${price.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax(10%)</span>
              <span>${tax.toFixed(2)}</span>
            </p>
          </div>
          <p className="mt-4 flex justify-between text-base font-bold">
            <span>Total Due Today</span>
            <span className="text-[#22c51f]">${total.toFixed(2)}</span>
          </p>
          <div className="mt-4 border-t border-neutral-200 pt-3">
            <h3 className="font-bold text-[#22c51f]">What&apos;s Included?</h3>
            <ul className="mt-3 space-y-3">
              {planFeatures[selectedPlan].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                  <CheckCircle2 className="text-[#22c51f]" size={19} /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
