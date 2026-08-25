"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, smoothEase, staggerContainer, viewportOnce } from "@/lib/motion";

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in minutes with your restaurant details. Choose a plan that fits your needs.",
  },
  {
    step: "02",
    title: "Set Up Your Profile",
    description:
      "Add your menu, set opening hours, upload photos, and configure your restaurant profile.",
  },
  {
    step: "03",
    title: "Start Managing",
    description:
      "Accept bookings, process orders, track analytics, and grow your restaurant business.",
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
            Get started in{" "}
            <span className="text-[#22c51f]">three simple steps</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
            No complicated setup. No technical knowledge required. Just
            straightforward onboarding.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              transition={{ delay: index * 0.12 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
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
    </section>
  );
}
