"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

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
  {
    name: "Eric Habimana",
    role: "Chef, Taste of Kigali",
    avatar: "/man2.jpg",
    quote:
      "Managing menu items and tracking orders has never been easier. Dinely helps me focus on what I do best — cooking great food for happy customers.",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(2);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  const prev = () => setActive((a) => (a > 0 ? a - 1 : testimonials.length - 1));
  const next = () => setActive((a) => (a < testimonials.length - 1 ? a + 1 : 0));

  // Touch/mouse drag
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    dragStart.current = null;
  };

  return (
    <section className="bg-white px-6 py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-neutral-900 md:text-3xl">
            What clients say?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
            Clients love our tasty food, friendly service, and quick, satisfying
            experience every visit.
          </p>
        </div>

        {/* Slider */}
        <div className="relative mt-8 pb-4">
          {/* Cards container */}
          <div
            ref={dragRef}
            className="relative mx-auto flex justify-center items-end"
            style={{ minHeight: "320px" }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {testimonials.map((t, index) => {
              const diff = index - active;
              // Wrap-around distance
              const len = testimonials.length;
              let d = diff;
              if (d > len / 2) d -= len;
              if (d < -len / 2) d += len;

              const isCenter = d === 0;
              const absD = Math.abs(d);
              const hidden = absD > 2;

              return (
                <div
                  key={t.name}
                  className={`absolute w-[270px] rounded-xl p-5 transition-all duration-500 ease-out select-none cursor-grab active:cursor-grabbing ${
                    hidden
                      ? "opacity-0 pointer-events-none"
                      : isCenter
                        ? "z-30 border-2 border-[#22c51f]/30 bg-[#f8fdf8] shadow-2xl shadow-[#22c51f]/10"
                        : "z-10 border border-neutral-200 bg-white shadow-lg opacity-70"
                  }`}
                  style={{
                    transform: isCenter
                      ? "translateY(0) scale(1)"
                      : `translateX(${d * 40}px) translateY(${absD * 15}px) scale(${1 - absD * 0.05}) rotate(${d * -3}deg)`,
                    left: `calc(50% + ${d * 40}px - 135px)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{t.name}</p>
                      <p className="text-[11px] text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-900"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-[#22c51f]" : "w-2 bg-neutral-300"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-900"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
