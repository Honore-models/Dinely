"use client";

import { Check, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../ui/Button";
import { fadeUp, smoothEase, staggerContainer, viewportOnce } from "@/lib/motion";

const plans = [
  {
    name: "Starter",
    price: 9,
    description: "Perfect for small restaurants just getting started.",
    features: [
      "Restaurant profile page",
      "Menu management (up to 30 items)",
      "Up to 100 orders/month",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 14,
    description: "For growing restaurants that need more power.",
    features: [
      "Everything in Starter",
      "Unlimited menu items",
      "Unlimited orders",
      "Advanced analytics dashboard",
      "Table bookings & management",
      "Priority support",
      "Customer insights",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 20,
    description: "For multi-branch restaurants and chains.",
    features: [
      "Everything in Professional",
      "Multi-restaurant management",
      "Custom integrations (POS, delivery)",
      "Dedicated account manager",
      "API access",
      "Advanced reporting",
      "Custom branding",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="pricing" className="bg-white px-6 py-20">
      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="inline-block rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#22c51f]">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
            Start with a 14-day free trial. No credit card required. Upgrade or
            cancel anytime.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-7 ${
                plan.popular
                  ? "border-[#22c51f] bg-green-50/40 shadow-lg shadow-green-100"
                  : "border-neutral-200 bg-white"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#22c51f] px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-neutral-900">
                  ${plan.price}
                </span>
                <span className="text-sm text-neutral-500">/month</span>
              </div>
              <Button
                href="/onboarding/step-1"
                variant={plan.popular ? "primary" : "outline"}
                className={`mt-6 w-full ${
                  plan.popular ? "" : "border-neutral-200 text-neutral-700"
                }`}
              >
                {plan.popular ? (
                  <>
                    <Zap size={16} className="mr-1.5" />
                    Start Free Trial
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-neutral-600"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-[#22c51f]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
