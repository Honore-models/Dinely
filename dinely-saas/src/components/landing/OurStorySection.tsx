"use client";

import Image from "next/image";
import { Play } from "lucide-react";

const stats = [
  { value: "10K+", label: "Restaurants Onboarded" },
  { value: "15K", label: "Satisfied Customers" },
  { value: "10K+", label: "Orders Completed" },
  { value: "45+", label: "Cities Covered" },
];

const teamAvatars = ["/man1.webp", "/woman.jpg", "/man2.jpg"];

export function OurStorySection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left side */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#22c51f]">
              <span className="h-px w-8 bg-[#22c51f]" />
              Our Story
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">
              Crafted with love, <span className="text-[#22c51f]">spiced with passion</span>, and made to satisfy every bite.
            </h2>

            {/* Large kitchen image */}
            <div className="relative mt-8 h-72 overflow-hidden rounded-2xl md:h-80">
              <Image
                src="/food3.jpg"
                alt="Chef preparing food"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col justify-center">
            {/* Two small images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-44 overflow-hidden rounded-xl md:h-52">
                <Image
                  src="/food1.jpg"
                  alt="Grilled chicken"
                  fill
                  className="object-cover"
                />
                <span className="absolute right-2 top-2 rounded-full bg-[#22c51f] px-3 py-1 text-[10px] font-bold text-white">
                  From Kitchen To You
                </span>
              </div>
              <div className="relative h-44 overflow-hidden rounded-xl md:h-52">
                <Image
                  src="/food2.jpg"
                  alt="Fresh pizza"
                  fill
                  className="object-cover"
                />
                <span className="absolute right-2 top-2 rounded-full bg-[#22c51f] px-3 py-1 text-[10px] font-bold text-white">
                  Fresh & Organic
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-neutral-500">
              At Dinely, every dish is crafted with love and every restaurant is
              carefully selected. From our kitchen to your plate, we create flavors
              that delight, satisfy, and bring joy in every bite. That&apos;s the Dinely
              promise.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-neutral-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Team + Watch intro */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {teamAvatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white"
                  >
                    <Image
                      src={avatar}
                      alt="Team member"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            <button
              type="button"
              onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
              className="flex items-center gap-2 text-sm font-bold text-neutral-900 transition hover:text-[#22c51f]"
            >
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-neutral-200 text-[#22c51f]">
                  <Play size={16} className="ml-0.5" />
                </span>
                Watch Intro
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
