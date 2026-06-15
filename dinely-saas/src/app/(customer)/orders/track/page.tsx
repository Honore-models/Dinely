"use client";

import Link from "next/link";
import { Check, ChevronRight, Circle, Clock, Mail, Phone } from "lucide-react";

const orderSteps = [
  {
    id: "confirmed",
    label: "Order Confirmed",
    time: "10:30 AM",
    done: true,
  },
  {
    id: "preparing",
    label: "Preparing your food",
    time: "11:00 AM",
    done: true,
  },
  {
    id: "onway",
    label: "On the way",
    time: "10:00 AM",
    done: false,
  },
  {
    id: "delivered",
    label: "Delivered",
    time: "–",
    done: false,
  },
];

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/home" className="transition hover:text-neutral-800">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/orders" className="transition hover:text-neutral-800">
          Orders
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-neutral-900">Track Orders</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Order status panel */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">Order Status</h2>

          <div className="relative mt-6">
            {orderSteps.map((step, idx) => {
              const isLast = idx === orderSteps.length - 1;
              return (
                <div key={step.id} className="flex items-start gap-3">
                  {/* Indicator + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        step.done
                          ? "border-[#22c51f] bg-[#22c51f] text-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {step.done ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <Circle size={10} className="text-neutral-300" />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`my-1 w-0.5 flex-1 ${
                          step.done ? "bg-[#22c51f]" : "bg-neutral-200"
                        }`}
                        style={{ minHeight: 32 }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="pb-6">
                    <p
                      className={`text-sm font-bold ${
                        step.done ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map area */}
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          {/* ETA banner */}
          <div className="flex items-center gap-4 border-b border-neutral-100 px-6 py-4">
            <div>
              <p className="text-sm font-bold text-neutral-900">Estimated Delivery</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-[#22c51f]">
                <Clock size={14} />
                30 – 40 Min
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                The rider is on the way to you
              </p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="relative flex-1 bg-neutral-100" style={{ height: 360 }}>
            {/* Using an OpenStreetMap iframe as a real map */}
            <iframe
              title="Delivery map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=30.0272%2C-1.9878%2C30.0872%2C-1.9278&layer=mapnik"
              className="h-full w-full border-0"
              loading="lazy"
            />

            {/* Rider info overlay */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-neutral-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-200 text-sm font-bold text-neutral-600">
                  P
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Peterson</p>
                  <p className="text-xs text-neutral-500">Your delivery partner</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Call delivery partner"
                  className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
                >
                  <Phone size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Message delivery partner"
                  className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
                >
                  <Mail size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
