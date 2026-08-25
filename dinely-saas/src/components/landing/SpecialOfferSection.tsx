"use client";

import Image from "next/image";
import Link from "next/link";

export function SpecialOfferSection() {
  return (
    <section className="bg-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8f5e9] to-[#dcfce7] p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Left content */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#22c51f]">
                Special Offer
              </p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-neutral-900 md:text-3xl">
                Tasty Fare, Refreshing Drinks, Joyful Company
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
                Discover restaurants that bring joy to every bite, perfect ambiance
                to refresh the spirit, and wonderful company that makes every
                moment brighter and truly unforgettable.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/explore"
                  className="inline-flex h-12 items-center rounded-xl bg-[#22c51f] px-8 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
                >
                  Order Now
                </Link>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-neutral-900">$58.99</span>
                  <span className="text-sm text-neutral-400 line-through">$79.99</span>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              {/* Discount badge */}
              <div className="absolute -right-2 top-0 z-10 grid h-16 w-16 place-items-center rounded-full bg-[#22c51f] text-lg font-extrabold text-white shadow-lg">
                -50%
              </div>
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border-8 border-white shadow-xl md:h-80 md:w-80">
                <Image
                  src="/food9.jpg"
                  alt="Special offer food"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 h-4 w-4 rounded-full bg-[#22c51f]/30" />
              <div className="absolute -right-4 top-1/2 h-3 w-3 rounded-full bg-[#22c51f]/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
