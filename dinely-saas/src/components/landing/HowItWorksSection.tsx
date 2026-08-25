"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUp,
  smoothEase,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";

const ownerSteps = [
  {
    step: "01",
    title: "Register Your Restaurant",
    description:
      "Sign up in minutes, enter your restaurant details, and choose a plan that fits your needs.",
  },
  {
    step: "02",
    title: "Set Up Your Profile",
    description:
      "Add your menu, set opening hours, upload photos, and configure your restaurant profile.",
  },
  {
    step: "03",
    title: "Start Growing",
    description:
      "Accept bookings, process orders, track analytics, and grow your restaurant business.",
  },
];

const customerSteps = [
  {
    step: "01",
    title: "Explore Restaurants",
    description:
      "Browse nearby restaurants, read reviews, and discover new favourite spots.",
  },
  {
    step: "02",
    title: "Order or Book a Table",
    description:
      "Place a delivery or takeaway order, or reserve a table -all from one place.",
  },
  {
    step: "03",
    title: "Enjoy & Review",
    description:
      "Savour your meal, then rate the restaurant and share your experience.",
  },
];

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-white px-6 py-20">
      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="inline-block rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#22c51f]">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Two ways to get started
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
            Whether you own a restaurant or love dining out, Dinely makes it
            easy.
          </p>
        </motion.div>

        {/* For Restaurant Owners */}
        <motion.div variants={fadeUp} className="mt-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#22c51f] text-white font-bold text-sm">
              🍽️
            </div>
            <h3 className="text-xl font-bold text-neutral-900">
              For Restaurant Owners
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {ownerSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                transition={{ delay: index * 0.12 }}
                className="relative text-center"
              >
                {index < ownerSteps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] bg-green-200 md:block" />
                )}
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border-2 border-green-200 bg-green-50 text-2xl font-extrabold text-[#22c51f]">
                  {step.step}
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Customers */}
        <motion.div variants={fadeUp} className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600 font-bold text-sm">
              🍴
            </div>
            <h3 className="text-xl font-bold text-neutral-900">
              For Customers
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {customerSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                transition={{ delay: index * 0.12 + 0.3 }}
                className="relative text-center"
              >
                {index < customerSteps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] bg-green-200 md:block" />
                )}
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border-2 border-green-200 bg-green-50 text-2xl font-extrabold text-[#22c51f]">
                  {step.step}
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
