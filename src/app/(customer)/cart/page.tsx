"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Shield, Truck, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const DELIVERY_FEE = 1.09;
const SERVICE_FEE = 0.5;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());

  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/home" className="transition hover:text-neutral-800">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-neutral-900">Cart</span>
      </nav>

      <h1 className="text-2xl font-extrabold text-neutral-900">
        Your Cart{" "}
        <span className="text-neutral-500">({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
      </h1>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-neutral-500">Your cart is empty</p>
          <p className="mt-1 text-sm text-neutral-400">
            Browse restaurants and add dishes to get started
          </p>
          <Link
            href="/home"
            className="mt-5 rounded-full bg-[#22c51f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      🍽️
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-600">
                    ${item.price.toFixed(1)}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-red-300 text-red-400 transition hover:bg-red-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-neutral-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-green-300 text-[#22c51f] transition hover:bg-green-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.menuItemId)}
                  className="ml-1 grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>

            <div className="mt-5 space-y-3">
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
                <span>${SERVICE_FEE.toFixed(1)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-bold text-neutral-900">
                <span>Total</span>
                <span className="text-[#22c51f]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 block w-full rounded-xl bg-[#22c51f] py-3 text-center text-base font-bold text-white transition hover:bg-[#1bad1a]"
            >
              Checkout
            </Link>
            <Link
              href="/home"
              className="mt-3 block w-full rounded-xl border border-[#22c51f] py-3 text-center text-base font-bold text-[#22c51f] transition hover:bg-green-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Bottom trust badges */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-neutral-100 pt-8">
        <div className="flex items-center gap-2 text-sm">
          <Clock size={22} className="text-[#22c51f]" />
          <div>
            <p className="font-bold text-neutral-800">30 – 40 Min</p>
            <p className="text-xs text-neutral-500">Delivery Time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck size={22} className="text-[#22c51f]" />
          <div>
            <p className="font-bold text-neutral-800">Free delivery</p>
            <p className="text-xs text-neutral-500">On orders over $120</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield size={22} className="text-[#22c51f]" />
          <div>
            <p className="font-bold text-neutral-800">Secure payments</p>
            <p className="text-xs text-neutral-500">100% Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
