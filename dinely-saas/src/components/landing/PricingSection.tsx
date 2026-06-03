"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../ui/Button";
import { fadeUp, smoothEase, staggerContainer, viewportOnce } from "../../lib/motion";

const features = ["Live bookings", "Menu control", "Customer insights"];

export function PricingSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white px-6 py-16">
      <motion.div
        className="mx-auto flex max-w-7xl flex-col gap-8 rounded-xl border border-green-100 bg-green-50/40 p-8 md:flex-row md:items-center md:justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="text-sm font-bold uppercase tracking-wide text-[#22c51f]"
          >
            Restaurant owners
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-2 text-3xl font-bold text-neutral-950">
            Start managing smarter today.
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-4">
            {features.map((feature, index) => (
              <motion.span
                key={feature}
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: smoothEase }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700"
              >
                <Check size={17} className="text-[#22c51f]" />
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <motion.div
          variants={fadeUp}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="shrink-0"
        >
          <Button href="/onboarding/step-1">Get Started as a Restaurant</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
