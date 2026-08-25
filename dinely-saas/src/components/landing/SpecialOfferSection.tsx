"use client";

import Image from "next/image";
import Link from "next/link";

export function SpecialOfferSection() {
  return (
    <section className="bg-white px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#dcfce7] p-6 md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-2">
            {/* Left content */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#22c51f]">
                Special Offer
              </p>
              <h2 className="mt-2 text-xl font-extrabold leading-tight text-neutral-900 md:text-2xl">
                Tasty Fare, Refreshing Drinks, Joyful Company
              </h2>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-600">
                Discover restaurants that bring joy to every bite, perfect ambiance
                to refresh the spirit, and wonderful company that makes every
                moment brighter and truly unforgettable.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/explore"
                  className="inline-flex h-11 items-center rounded-xl bg-[#22c51f] px-7 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
                >
                  Order Now
                </Link>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-neutral-900">$58.99</span>
                  <span className="text-xs text-neutral-400 line-through">$79.99</span>
                </div>
              </div>
            </div>

            {/* Right image — offer.png as-is */}
            <div className="relative h-[200px] w-full overflow-hidden md:h-[260px]">
              <Image
                src="/offer.png"
                alt="Special offer"
                fill
                className="object-contain scale-125 object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
