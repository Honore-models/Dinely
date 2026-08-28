import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNavBar } from "@/components/ui/MarketingNavBar";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Dinely's mission to connect diners with amazing restaurants and empower restaurant owners with powerful management tools.",
  openGraph: {
    title: "About Us | Dinely",
    description:
      "Learn about Dinely's mission to connect diners with amazing restaurants and empower restaurant owners.",
    url: "/about",
  },
};
import {
  UtensilsCrossed,
  Heart,
  ShieldCheck,
  Zap,
  Users,
  Globe,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { label: "Restaurants Served", value: "500+", icon: UtensilsCrossed },
  { label: "Orders Processed", value: "1M+", icon: TrendingUp },
  { label: "Happy Customers", value: "100K+", icon: Users },
  { label: "Cities Covered", value: "25+", icon: Globe },
];

const values = [
  {
    icon: Heart,
    title: "Passion for Food",
    description:
      "We believe great food brings people together. Our mission is to connect diners with the best restaurants in their area.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    description:
      "Your data and payments are protected with industry-leading security. We take privacy seriously.",
  },
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We constantly push boundaries to bring you the latest in restaurant technology and food delivery.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We build for our community of diners and restaurant owners, listening to feedback and evolving together.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "Founded",
    description:
      "Dinely was born from a simple idea: make restaurant management effortless and food discovery delightful.",
  },
  {
    year: "2024",
    title: "Launch",
    description:
      "Launched our platform with 50 partner restaurants and hit 10,000 orders in the first 3 months.",
  },
  {
    year: "2025",
    title: "Growth",
    description:
      "Expanded to 25+ cities with 500+ restaurants and processed over 1 million orders.",
  },
  {
    year: "2026",
    title: "The Future",
    description:
      "Expanding globally with AI-powered insights, loyalty programs, and seamless POS integrations.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <MarketingNavBar activePage="/about" />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#22c51f] to-[#189816] px-6 py-20 lg:px-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-black/10 blur-xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
            <Star size={12} className="fill-white" />
            Our Story
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            Redefining the Dining
            <br />
            <span className="text-yellow-300">Experience</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 lg:text-lg">
            Dinely is the all-in-one platform that connects hungry diners with
            amazing restaurants, while giving restaurant owners the tools they
            need to thrive.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1a7a20] shadow-lg transition hover:bg-yellow-50 active:scale-[0.97]"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.97]"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="relative -mt-10 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800 md:grid-cols-4 md:gap-8 md:p-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-green-50 dark:bg-green-950">
                  <Icon size={22} className="text-[#22c51f] dark:text-green-400" />
                </div>
                <p className="mt-3 text-2xl font-extrabold text-neutral-900 dark:text-white md:text-3xl">
                  {value}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-bold text-[#22c51f]">Our Mission</span>
              <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 dark:text-white md:text-4xl">
                Making Great Food
                <br />Accessible to Everyone
              </h2>
              <p className="mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                We started Dinely with a clear vision: bridge the gap between
                great restaurants and the people who love them. Whether you&apos;re
                a diner looking for the perfect meal or a restaurant owner
                seeking to streamline operations, Dinely is built for you.
              </p>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                Our platform combines powerful restaurant management tools with
                an intuitive food ordering experience, creating a seamless
                ecosystem that benefits everyone involved.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 size={18} className="text-[#22c51f]" />
                  Real-time order tracking
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 size={18} className="text-[#22c51f]" />
                  Smart menu management
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 size={18} className="text-[#22c51f]" />
                  Advanced analytics
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 size={18} className="text-[#22c51f]" />
                  Table reservations
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 dark:from-green-950/50 dark:to-emerald-950/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-800">
                    <Clock size={24} className="text-[#22c51f]" />
                    <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">24/7 Support</p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Always here when you need us
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-800">
                    <MapPin size={24} className="text-[#22c51f]" />
                    <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">Local Focus</p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Supporting local restaurants
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-800">
                    <TrendingUp size={24} className="text-[#22c51f]" />
                    <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">Growth Tools</p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Data-driven insights
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-800">
                    <Zap size={24} className="text-[#22c51f]" />
                    <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">Fast Delivery</p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Quick and reliable service
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 px-6 py-20 dark:bg-neutral-900 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-sm font-bold text-[#22c51f]">What We Stand For</span>
          <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 dark:text-white md:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500 dark:text-neutral-400">
            These principles guide every decision we make and every feature we build.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-50 dark:bg-green-950">
                  <Icon size={22} className="text-[#22c51f] dark:text-green-400" />
                </div>
                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold text-[#22c51f]">Our Journey</span>
          <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 dark:text-white md:text-4xl">
            Milestones That Matter
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-0">
            {milestones.map(({ year, title, description }, idx) => (
              <div key={year} className="flex gap-6">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f] text-xs font-bold text-white">
                    {year.slice(-2)}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-green-200 dark:bg-green-900" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <p className="text-xs font-bold text-[#22c51f]">{year}</p>
                  <h3 className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#22c51f] to-[#189816] p-10 text-center md:p-14">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 lg:text-base">
            Join thousands of restaurants and diners already using Dinely.
            Sign up today and experience the future of dining.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1a7a20] shadow-lg transition hover:bg-yellow-50 active:scale-[0.97]"
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.97]"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
