"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToHomeButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      <ArrowLeft size={16} />
      Back to Home
    </Link>
  );
}
