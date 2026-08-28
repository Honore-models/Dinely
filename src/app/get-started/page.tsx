"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChefHat, Utensils, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DinelyLogo } from "@/components/brand/DinelyLogo";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

const roles = [
  {
    id: "owner" as const,
    icon: ChefHat,
    title: "Restaurant Owner",
    subtitle: "List & manage your restaurant",
    description:
      "Set up your restaurant profile, manage menus, accept orders, track bookings, and grow your business—all from one powerful dashboard.",
    features: [
      "Restaurant profile & menu setup",
      "Order & booking management",
      "Analytics & revenue tracking",
      "Customer reviews & insights",
    ],
    cta: "Start Onboarding",
    href: "/onboarding/step-1",
    color: "green" as const,
  },
  {
    id: "customer" as const,
    icon: Utensils,
    title: "Customer",
    subtitle: "Discover & order great food",
    description:
      "Browse nearby restaurants, explore menus, place delivery or takeaway orders, book tables, and leave reviews for your favourite spots.",
    features: [
      "Explore nearby restaurants",
      "Browse menus & place orders",
      "Book tables & track reservations",
      "Rate & review your experiences",
    ],
    cta: "Create Account",
    href: "/register-customer",
    color: "amber" as const,
  },
];

export default function GetStartedPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white via-green-50/30 to-white px-4 py-12">
      {/* Logo + Toggle */}
      <div className="mb-10 flex items-center gap-4">
        <Link href="/" className="flex items-center">
          <DinelyLogo width={120} height={42} priority />
        </Link>
        <DarkModeToggle variant="compact" />
      </div>

      {/* Heading */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl"
        >
          Welcome to <span className="text-[#22c51f]">Dinely</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500 md:text-base"
        >
          How would you like to use Dinely? Choose your role to get started.
        </motion.p>
      </div>

      {/* Role cards */}
      <div className="mt-10 grid w-full max-w-3xl gap-5 md:grid-cols-2">
        {roles.map((role, i) => {
          const isHovered = hovered === role.id;
          const Icon = role.icon;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
              onMouseEnter={() => setHovered(role.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(role.href)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 p-7 transition-all duration-300 ${
                isHovered
                  ? role.color === "green"
                    ? "border-[#22c51f] bg-green-50/60 shadow-xl shadow-green-100/60"
                    : "border-amber-400 bg-amber-50/60 shadow-xl shadow-amber-100/60"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              {/* Icon */}
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl transition-all duration-300 ${
                  isHovered
                    ? role.color === "green"
                      ? "bg-[#22c51f] text-white"
                      : "bg-amber-400 text-white"
                    : role.color === "green"
                      ? "bg-green-50 text-[#22c51f]"
                      : "bg-amber-50 text-amber-500"
                }`}
              >
                <Icon size={26} />
              </div>

              {/* Text */}
              <h2 className="mt-5 text-xl font-extrabold text-neutral-900">
                {role.title}
              </h2>
              <p
                className={`mt-0.5 text-sm font-semibold ${
                  role.color === "green" ? "text-[#22c51f]" : "text-amber-500"
                }`}
              >
                {role.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {role.description}
              </p>

              {/* Feature list */}
              <ul className="mt-5 space-y-2">
                {role.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-neutral-600"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                        role.color === "green" ? "bg-[#22c51f]" : "bg-amber-400"
                      }`}
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div
                className={`mt-6 flex items-center justify-between rounded-xl border-2 px-5 py-3 text-sm font-bold transition-all duration-300 ${
                  isHovered
                    ? role.color === "green"
                      ? "border-[#22c51f] bg-[#22c51f] text-white"
                      : "border-amber-400 bg-amber-400 text-white"
                    : role.color === "green"
                      ? "border-[#22c51f] text-[#22c51f]"
                      : "border-amber-400 text-amber-500"
                }`}
              >
                <span>{role.cta}</span>
                {isHovered ? (
                  <ArrowRight size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.5 }}
        className="mt-8 text-center text-xs text-neutral-400"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#22c51f] hover:underline"
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
