"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";

const offers = [
  {
    id: "o1",
    title: "20% OFF on your first order",
    description: "Use code 00958SD to get 20% off your first order from any restaurant.",
    code: "00958SD",
    expiresIn: "3 days",
    restaurant: "All Restaurants",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    bgColor: "from-green-50 to-emerald-50",
    badgeColor: "bg-[#22c51f]",
  },
  {
    id: "o2",
    title: "Free Delivery on orders over $20",
    description: "No delivery fee when you order $20 or more from participating restaurants.",
    code: "FREEDEL",
    expiresIn: "7 days",
    restaurant: "Selected Restaurants",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80",
    bgColor: "from-amber-50 to-orange-50",
    badgeColor: "bg-amber-500",
  },
  {
    id: "o3",
    title: "Buy 1 Get 1 Free – Burgers",
    description: "Order any burger and get a second one free every Tuesday.",
    code: "BOGO2GO",
    expiresIn: "6 hours",
    restaurant: "The Golden Plate",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    bgColor: "from-red-50 to-pink-50",
    badgeColor: "bg-red-500",
  },
  {
    id: "o4",
    title: "15% OFF Sushi Orders",
    description: "Save 15% on all sushi rolls and combos this weekend only.",
    code: "SUSHI15",
    expiresIn: "2 days",
    restaurant: "Sushi Palace",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
    bgColor: "from-blue-50 to-indigo-50",
    badgeColor: "bg-blue-500",
  },
];

export default function OffersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="flex items-center gap-3">
        <Tag size={24} className="text-[#22c51f]" />
        <h1 className="text-2xl font-extrabold text-neutral-900">Offers & Deals</h1>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        Exclusive discounts and promotions just for you
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {offers.map((offer) => (
          <article
            key={offer.id}
            className={`overflow-hidden rounded-2xl border border-neutral-100 bg-gradient-to-br ${offer.bgColor} shadow-sm`}
          >
            <div className="flex gap-4 p-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${offer.badgeColor}`}
                >
                  {offer.restaurant}
                </span>
                <h3 className="mt-1.5 text-sm font-bold text-neutral-900 leading-snug">
                  {offer.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                  {offer.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/60 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-dashed border-neutral-300 bg-white px-3 py-1.5">
                  <p className="text-xs font-bold tracking-widest text-neutral-700">
                    {offer.code}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock size={11} />
                  Expires in {offer.expiresIn}
                </span>
              </div>
              <Link
                href="/home"
                className="rounded-full bg-[#22c51f] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#1bad1a]"
              >
                Use now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
