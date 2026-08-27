"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, smoothEase, staggerContainer, viewportOnce } from "@/lib/motion";

const stats = [
  { value: "1.8M+", label: "Monthly diners" },
  { value: "12K+", label: "Restaurant partners" },
  { value: "98%", label: "Booking uptime" },
  { value: "4.8/5", label: "Average rating" },
];

export function StatsBar() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-y border-neutral-100 bg-white">
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            transition={{ delay: index * 0.05 }}
          >
            <motion.p
              className="text-3xl font-bold text-[#22c51f]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: smoothEase }}
            >
              {stat.value}
            </motion.p>
            <p className="mt-1 text-sm font-semibold text-neutral-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
