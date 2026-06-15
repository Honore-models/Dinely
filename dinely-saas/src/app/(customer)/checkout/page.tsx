"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const DELIVERY_FEE = 1.09;
const SERVICE_FEE = 0.5;

type DeliveryTime = "asap" | "schedule" | "later";
type PaymentMethod = "card" | "apple" | "google" | "cash";

export default function CheckoutPage() {
  const subtotal = useCartStore((s) => s.subtotal());
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>("asap");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [address, setAddress] = useState("KN 5 Rd, Kigali, Rwanda");
  const [instructions, setInstructions] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/home" className="transition hover:text-neutral-800">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-neutral-900">Checkout</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Left: Delivery info ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Delivery address */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900">Delivery Address</h2>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700">
              <span>{address}</span>
              <button
                type="button"
                onClick={() => {
                  const newAddr = prompt("Enter new address", address);
                  if (newAddr) setAddress(newAddr);
                }}
                className="font-bold text-[#22c51f] transition hover:underline"
              >
                Change
              </button>
            </div>
          </div>

          {/* Delivery instructions */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900">
              Delivery Instructions{" "}
              <span className="text-sm font-normal text-neutral-400">(Optional)</span>
            </h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Leave at the door"
              rows={3}
              className="mt-3 w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
            />
          </div>

          {/* Delivery time */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900">Delivery Time</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(
                [
                  { id: "asap", title: "ASAP", subtitle: "30-40 min" },
                  { id: "schedule", title: "Schedule Order", subtitle: "Select time" },
                  { id: "later", title: "Later", subtitle: "Select Date" },
                ] as { id: DeliveryTime; title: string; subtitle: string }[]
              ).map(({ id, title, subtitle }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDeliveryTime(id)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 py-3 text-sm transition ${
                    deliveryTime === id
                      ? "border-[#22c51f] bg-white text-[#22c51f]"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  {deliveryTime === id && (
                    <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#22c51f]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c51f]" />
                    </span>
                  )}
                  <span className="font-bold">{title}</span>
                  <span className="mt-0.5 text-xs text-neutral-500">{subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Payment + summary ────────────────────────── */}
        <div className="space-y-6">
          {/* Payment methods */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900">Payment Method</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  {
                    id: "card",
                    label: "Debit / Credit Card",
                    icon: <CreditCard size={20} className="text-neutral-600" />,
                  },
                  {
                    id: "apple",
                    label: "Apple Pay",
                    icon: (
                      <span className="text-sm font-bold text-neutral-800">
                        🍎 Pay
                      </span>
                    ),
                  },
                  {
                    id: "google",
                    label: "Google Pay",
                    icon: (
                      <span className="text-sm font-bold text-neutral-800">
                        G Pay
                      </span>
                    ),
                  },
                  {
                    id: "cash",
                    label: "Cash on delivery",
                    icon: <span className="text-lg">💵</span>,
                  },
                ] as { id: PaymentMethod; label: string; icon: React.ReactNode }[]
              ).map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    paymentMethod === id
                      ? "border-[#22c51f] bg-green-50"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-6 text-center">{icon}</span>
                  <span className="flex-1 text-left text-neutral-800">{label}</span>
                  {paymentMethod === id && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#22c51f]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22c51f]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900">Order Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Delivery Fee</span>
                <span>${DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Service fee</span>
                <span>${SERVICE_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-bold text-neutral-900">
                <span>Total</span>
                <span className="text-[#22c51f]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/orders/track"
              className="mt-5 block w-full rounded-xl bg-[#22c51f] py-3 text-center text-base font-bold text-white transition hover:bg-[#1bad1a]"
            >
              Place order
            </Link>
            <p className="mt-3 text-center text-xs text-neutral-400">
              By placing an order, you agree to our{" "}
              <Link href="#" className="font-semibold text-[#22c51f] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-semibold text-[#22c51f] hover:underline">
                Privacy policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
