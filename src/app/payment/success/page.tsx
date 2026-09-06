"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ordersApi, restaurantsApi } from "@/lib/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const [status, setStatus] = useState<"checking" | "confirmed" | "pending">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        if (kind === "order" && orderId) {
          const { data } = await ordersApi.get(orderId);
          const paymentStatus = String(
            (data as { payment_status?: string }).payment_status ?? "",
          );
          if (paymentStatus === "paid") {
            if (!cancelled) setStatus("confirmed");
            return;
          }
        } else if (kind === "subscription") {
          const { data } = await restaurantsApi.mine();
          const sub = String(
            (data as { subscription_status?: string } | null)?.subscription_status ??
              "",
          );
          if (sub === "active") {
            if (!cancelled) setStatus("confirmed");
            return;
          }
        }
      } catch {
        // Keep pending — webhook may still be in flight.
      }

      if (attempts >= 8) {
        if (!cancelled) setStatus("pending");
        return;
      }

      window.setTimeout(poll, 1500);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [kind, orderId]);

  const isOrder = kind === "order";
  const continueHref =
    isOrder && orderId
      ? `/orders/track?orderId=${encodeURIComponent(orderId)}`
      : "/dashboard";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      {status === "checking" ? (
        <Loader2 className="h-12 w-12 animate-spin text-[#22c51f]" />
      ) : (
        <CheckCircle2 className="h-14 w-14 text-[#22c51f]" />
      )}
      <h1 className="mt-5 text-2xl font-extrabold text-neutral-900">
        {status === "confirmed" ? "Payment confirmed" : "Payment received"}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {status === "confirmed"
          ? isOrder
            ? "Your order is paid and the restaurant can start preparing it."
            : "Your Dinely subscription is now active."
          : "We’re confirming your payment. This usually takes a few seconds."}
      </p>
      <Link
        href={continueHref}
        className="mt-8 inline-flex rounded-xl bg-[#22c51f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
      >
        {isOrder ? "Track order" : "Go to dashboard"}
      </Link>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
