"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQJsonLd, SoftwareAppJsonLd } from "@/components/seo/JsonLd";
import {
  Award,
  Check,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Zap,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToggleBilling } from "@/components/ui/ToggleBilling";
import { MarketingNavBar } from "@/components/ui/MarketingNavBar";

const plans = [
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
    notIncluded: ["Table bookings", "Customer insights", "Multi-restaurant"],
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
    notIncluded: ["Multi-restaurant"],
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
    notIncluded: [],
  },
];

const faqs = [
  {
    q: "Can I change my plan later?",
    a: "Yes! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately, and we'll prorate the difference.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, every plan comes with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) through our secure payment partner Stripe.",
  },
  {
    q: "What happens when I exceed my order limit?",
    a: "On the Starter plan, you'll be notified when approaching your limit. You can upgrade to Professional for unlimited orders at any time.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Absolutely. You can cancel your subscription from your dashboard at any time. Your access continues until the end of your billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund within the first 7 days of any new subscription. After that, you can cancel anytime but refunds are not provided for partial periods.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (plan: (typeof plans)[number]) =>
    billingCycle === "yearly" ? plan.yearly : plan.monthly;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <MarketingNavBar activePage="/pricing" />
      <SoftwareAppJsonLd />
      <FAQJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#22c51f] to-[#189816] px-6 py-20 lg:px-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-black/10 blur-xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
            <CreditCard size={12} />
            Simple Pricing
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            Plans That Grow
            <br />
            <span className="text-yellow-300">With Your Restaurant</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/80 lg:text-lg">
            Start free, upgrade when you&apos;re ready. All plans include a
            14-day free trial with no credit card required.
          </p>
        </div>
      </section>

      {/* ── Billing Toggle ──────────────────────────────────────────── */}
      <section className="relative -mt-6 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
            <ToggleBilling value={billingCycle} onChange={setBillingCycle} />
            {billingCycle === "yearly" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-[#22c51f] dark:bg-green-950 dark:text-green-400">
                Save up to 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ────────────────────────────────────────────── */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = getPrice(plan);

            return (
              <div
                key={plan.name}
                className={`group relative flex flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  plan.recommended
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
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">
                    ${price}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    /month
                  </span>
                </div>
                {billingCycle === "yearly" ? (
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#22c51f]">
                      Billed annually (${price * 12}/yr)
                    </p>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-[#22c51f] dark:bg-green-950 dark:text-green-400">
                      Save ${Math.round((1 - price / plan.monthly) * 100)}%
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                    Billed monthly · Cancel anytime
                  </p>
                )}

                {/* Included features */}
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-300"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-[#22c51f]"
                      />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-neutral-400 dark:text-neutral-600"
                    >
                      <X size={16} className="mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                    plan.recommended
                      ? "border-[#22c51f] bg-[#22c51f] text-white hover:bg-[#1bad1a]"
                      : "border-neutral-200 text-neutral-700 hover:border-[#22c51f] hover:bg-green-50 hover:text-[#22c51f] dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-[#22c555] dark:hover:bg-green-950"
                  }`}
                >
                  Start Free Trial
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trust Badges ──────────────────────────────────────────────── */}
      <section className="border-t border-neutral-100 bg-neutral-50 px-6 py-12 dark:border-neutral-800 dark:bg-neutral-900 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 dark:bg-green-900">
              <ShieldCheck size={20} className="text-[#22c51f]" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                SSL Secured
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                256-bit encryption
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 dark:bg-green-900">
              <CreditCard size={20} className="text-[#22c51f]" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                Stripe Payments
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                PCI compliant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 dark:bg-green-900">
              <CheckCircle2 size={20} className="text-[#22c51f]" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                14-Day Free Trial
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold text-[#22c51f]">FAQ</span>
          <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 dark:text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500 dark:text-neutral-400">
            Everything you need to know about our pricing and plans.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3 text-sm font-bold text-neutral-900 dark:text-white">
                  <HelpCircle size={18} className="shrink-0 text-[#22c51f]" />
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 text-neutral-400 transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {openFaq === idx && (
                <div className="border-t border-neutral-100 px-5 py-4 dark:border-neutral-800">
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#22c51f] to-[#189816] p-10 text-center md:p-14">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Ready to Grow Your Restaurant?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 lg:text-base">
            Join 500+ restaurants already using Dinely. Start your free trial
            today - no credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1a7a20] shadow-lg transition hover:bg-yellow-50 active:scale-[0.97]"
            >
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.97]"
            >
              <MessageCircle size={16} />
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
