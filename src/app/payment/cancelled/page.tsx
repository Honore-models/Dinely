"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { XCircle, Loader2 } from "lucide-react";

function CancelledContent() {
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const isOrder = kind === "order";

  const retryHref = isOrder ? "/checkout" : "/onboarding/step-4";
  const secondaryHref =
    isOrder && orderId
      ? `/orders/track?orderId=${encodeURIComponent(orderId)}`
      : "/dashboard";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <XCircle className="h-14 w-14 text-red-500" />
      <h1 className="mt-5 text-2xl font-extrabold text-neutral-900">
        Payment not completed
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {isOrder
          ? "Your order is waiting. You can try paying again or choose cash on delivery."
          : "Your restaurant is set up, but the subscription is not active yet. You can try again anytime."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={retryHref}
          className="inline-flex rounded-xl bg-[#22c51f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
        >
          Try again
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex rounded-xl border border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
        >
          {isOrder ? "View order" : "Dashboard"}
        </Link>
      </div>
    </main>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        </div>
      }
    >
      <CancelledContent />
    </Suspense>
  );
}
