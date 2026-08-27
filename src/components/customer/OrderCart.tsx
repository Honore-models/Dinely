"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const DELIVERY_FEE = 1.09;
const SERVICE_FEE = 0.5;

export function OrderCart() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-10 text-center shadow-sm">
        <ShoppingCart size={40} className="text-neutral-300" />
        <p className="mt-3 text-base font-semibold text-neutral-500">Your cart is empty</p>
        <p className="mt-1 text-sm text-neutral-400">Add items from a restaurant to get started</p>
        <Link
          href="/home"
          className="mt-5 rounded-full bg-[#22c51f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-900">
        Order Summary
      </h2>

      <div className="mt-1 space-y-5 divide-y divide-neutral-100">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex items-center gap-4 pt-4 first:pt-0">
            {/* Image */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">🍽️</div>
              )}
            </div>

            {/* Name + price */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-neutral-900">{item.name}</p>
              <p className="text-sm font-semibold text-neutral-600">
                ${item.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity + remove */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                className="grid h-7 w-7 place-items-center rounded-full border border-red-300 text-red-400 transition hover:bg-red-50"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-4 text-center text-sm font-bold text-neutral-900">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                className="grid h-7 w-7 place-items-center rounded-full border border-green-300 text-[#22c51f] transition hover:bg-green-50"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.menuItemId)}
                className="ml-1 grid h-7 w-7 place-items-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4">
        <div className="flex justify-between text-sm text-neutral-500">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
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
  );
}
