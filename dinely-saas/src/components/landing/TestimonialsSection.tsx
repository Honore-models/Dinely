"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jean Mutabazi",
    role: "Owner, The Golden Plate",
    avatar: "/man3.jpg",
    quote:
      "Dinely transformed how we manage our restaurant. The platform handles everything from bookings to orders seamlessly. Our revenue grew 40% in the first 3 months of using it.",
  },
  {
    name: "Alice Ndizeye",
    role: "Regular Customer",
    avatar: "/woman2.jpg",
    quote:
      "As a customer, I love how easy it is to browse menus, place orders, and make reservations. The interface is beautiful and everything just works perfectly every time.",
  },
  {
    name: "Patrick Nkurunziza",
    role: "Manager, Café Kigali",
    avatar: "/man4.jpg",
    quote:
      "The analytics dashboard alone is worth it. I can see exactly which items sell best and when peak hours are. It's like having a business consultant built right into the app.",
  },
  {
    name: "Grace Iradukunda",
    role: "Owner, Fresh Bites",
    avatar: "/woman3.jpg",
    quote:
      "Best restaurant management platform I've used. The menu management and table booking features save me hours every day. Highly recommend to any restaurant owner.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 md:text-4xl">
            What clients say?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500">
            Clients love our tasty food, friendly service, and quick, satisfying
            experience every visit.
          </p>
        </div>

        {/* Stacked cards */}
        <div className="relative mt-14 flex justify-center">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {testimonials.map((t, index) => {
              const isCenter = index === 1;
              return (
                <div
                  key={t.name}
                  className={`min-w-[280px] snap-center rounded-2xl p-6 transition md:min-w-[300px] ${
                    isCenter
                      ? "border-2 border-[#22c51f]/30 bg-[#f8fdf8] shadow-lg"
                      : "border border-neutral-200 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{t.name}</p>
                      <p className="text-xs text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
