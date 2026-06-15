"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ThumbsUp } from "lucide-react";

const reviews = [
  {
    id: "r1",
    author: "John D.",
    avatar: "JD",
    rating: 5,
    date: "May 28, 2026",
    text: "Absolutely fantastic food! The herb-roasted meat was perfectly cooked, juicy and full of flavor. Service was attentive and the ambiance was wonderful. Will definitely be coming back!",
    helpful: 12,
  },
  {
    id: "r2",
    author: "Sarah M.",
    avatar: "SM",
    rating: 4,
    date: "May 20, 2026",
    text: "Great spot for a nice dinner. The pizza was crispy and delicious. Slightly long wait time but the food made up for it. Portions are generous.",
    helpful: 7,
  },
  {
    id: "r3",
    author: "Peterson K.",
    avatar: "PK",
    rating: 5,
    date: "May 15, 2026",
    text: "One of the best restaurants in Kigali! The crispy chicken was incredible and the service was top-notch. Highly recommend for any occasion.",
    helpful: 20,
  },
  {
    id: "r4",
    author: "Alice N.",
    avatar: "AN",
    rating: 3,
    date: "May 10, 2026",
    text: "Decent food but nothing extraordinary. The atmosphere is nice. Would have liked bigger portions for the price. Service could be improved.",
    helpful: 3,
  },
];

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews (2.4K)", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function ReviewsPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  const avgRating = 4.6;
  const starCounts = [
    { stars: 5, count: 1820, pct: 73 },
    { stars: 4, count: 490, pct: 20 },
    { stars: 3, count: 100, pct: 4 },
    { stars: 2, count: 50, pct: 2 },
    { stars: 1, count: 40, pct: 1 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "reviews";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`relative pb-3 text-sm font-semibold transition ${
                isActive
                  ? "border-b-2 border-[#22c51f] text-[#22c51f]"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* Rating summary */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-neutral-900">{avgRating}</p>
            <div className="mt-2 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-200"
                  }
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-neutral-500">Based on 2,500 reviews</p>
          </div>

          <div className="mt-5 space-y-2">
            {starCounts.map(({ stars, count, pct }) => (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right text-neutral-600">{stars}</span>
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <div className="flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-1.5 rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-neutral-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f] text-sm font-bold text-white">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-neutral-900">{review.author}</p>
                    <p className="text-xs text-neutral-400">{review.date}</p>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {review.text}
                  </p>
                  <button
                    type="button"
                    className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400 transition hover:text-neutral-600"
                  >
                    <ThumbsUp size={12} />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
