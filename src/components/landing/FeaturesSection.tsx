"use client";

import {
  BarChart3,
  CalendarCheck,
  ChefHat,
  CreditCard,
  Headphones,
  LayoutDashboard,
  MapPin,
  Smartphone,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUp,
  smoothEase,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";

const features = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Monitor revenue, orders, and customer trends at a glance with real-time analytics.",
  },
  {
    icon: ChefHat,
    title: "Menu Management",
    description:
      "Create, update, and organize your menu with categories, meal times, and pricing.",
  },
  {
    icon: CalendarCheck,
    title: "Table Bookings",
    description:
      "Manage reservations, table availability, and seating capacity effortlessly.",
  },
  {
    icon: CreditCard,
    title: "Order Processing",
    description:
      "Handle delivery, takeaway, and dine-in orders with real-time status tracking.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Understand your top items, peak hours, and customer behavior with detailed reports.",
  },
  {
    icon: Smartphone,
    title: "Customer Experience",
    description:
      "A beautiful mobile-first experience for customers to browse menus, order food, and leave reviews.",
  },
  {
    icon: MapPin,
    title: "Restaurant Discovery",
    description:
      "Customers find restaurants with ratings, reviews, photos, and detailed profiles.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description:
      "Dedicated assistance for restaurant owners whenever you need it with our expert support team.",
  },
];

export function FeaturesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="bg-neutral-50 px-6 py-20">
      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="inline-block rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#22c51f]">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Built for owners.{" "}
            <span className="text-[#22c51f]">Loved by customers.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500">
            Restaurant owners get powerful tools to manage their business -menu,
            bookings, orders, and analytics. Customers get a seamless way to
            discover, order, and review their favourite restaurants.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ delay: index * 0.05 }}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-green-200 hover:shadow-lg hover:shadow-green-50"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-50 text-[#22c51f] transition group-hover:bg-[#22c51f] group-hover:text-white">
                <feature.icon size={22} />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
