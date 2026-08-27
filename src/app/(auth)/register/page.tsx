"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, UtensilsCrossed } from "lucide-react";
import { DinelyLogo } from "@/components/brand/DinelyLogo";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <DinelyLogo width={120} height={42} />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="text-center text-2xl font-extrabold text-neutral-900 dark:text-white">
            Join Dinely
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Choose how you want to use Dinely
          </p>

          <div className="mt-8 space-y-4">
            {/* Customer option */}
            <button
              type="button"
              onClick={() => router.push("/register-customer")}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-neutral-200 bg-white p-5 text-left transition-all hover:border-[#22c51f] hover:bg-green-50/30 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#22c555]"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 transition group-hover:from-green-200 group-hover:to-emerald-200 dark:from-green-900 dark:to-emerald-900">
                <User size={24} className="text-[#22c51f] dark:text-green-400" />
              </div>
              <div>
                <p className="text-base font-bold text-neutral-900 dark:text-white">
                  I&apos;m a Customer
                </p>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  Explore restaurants, order food, and make reservations
                </p>
              </div>
            </button>

            {/* Owner option */}
            <button
              type="button"
              onClick={() => router.push("/onboarding/step-1")}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-neutral-200 bg-white p-5 text-left transition-all hover:border-[#22c51f] hover:bg-green-50/30 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#22c555]"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 transition group-hover:from-amber-200 group-hover:to-orange-200 dark:from-amber-900 dark:to-orange-900">
                <UtensilsCrossed size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-base font-bold text-neutral-900 dark:text-white">
                  I&apos;m a Restaurant Owner
                </p>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  Manage your restaurant, menu, orders, and bookings
                </p>
              </div>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
