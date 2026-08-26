"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Clock, Trash2, ArrowRight } from "lucide-react";
import { RestaurantCard } from "@/components/customer/RestaurantCard";
import { useFavourites } from "@/hooks/useFavourites";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
];

function getImage(r: { logo?: string }, idx: number): string {
  if (r.logo && r.logo.startsWith("http")) return r.logo;
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
}

export default function FavouritesPage() {
  const { favourites, loading, error, toggle } = useFavourites();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 px-4 py-12 dark:from-red-950/50 dark:via-rose-950/30 dark:to-pink-950/30 lg:px-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-100/40 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-pink-100/30 blur-2xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-200">
              <Heart size={26} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white md:text-4xl">
                My Favourites
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Your saved restaurants, all in one place
              </p>
            </div>
          </div>

          {/* Stats bar */}
          {!loading && (
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur dark:bg-neutral-800/80">
                <Heart size={14} className="text-red-500" fill="red" />
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  {favourites.length}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  saved restaurant{favourites.length !== 1 ? "s" : ""}
                </span>
              </div>
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#22c555] to-[#1bad1a] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:shadow-lg hover:shadow-green-300 active:scale-[0.97]"
              >
                Discover More
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-44 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-4 w-3/4 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-3 w-1/2 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-100">                <Heart size={20} className="text-red-500" />
            </div>
            <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-gradient-to-r from-[#22c555] to-[#1bad1a] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-green-200 transition-all hover:shadow-md active:scale-[0.97]"
            >
              Try Again
            </button>
          </div>
        ) : favourites.length === 0 ? (
          /* ── Empty State ──────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 py-20 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
            <div className="relative">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950">
                <Heart size={36} className="text-red-300" />
              </div>
              <span className="absolute -right-1 -top-1 text-lg opacity-80">💔</span>
            </div>
            <h2 className="mt-5 text-xl font-bold text-neutral-800 dark:text-white">
              No favourites yet
            </h2>              <p className="mt-1.5 max-w-xs text-sm text-neutral-400 dark:text-neutral-500">
              Start exploring restaurants and tap the heart icon to save your
              favourites here
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22c555] to-[#1bad1a] px-6 py-3 text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:shadow-lg hover:shadow-green-300 active:scale-[0.97]"
            >
              Browse Restaurants
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* ── Favourites Grid ──────────────────────────────────────── */
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing{" "}
                <span className="font-bold text-neutral-800 dark:text-white">
                  {favourites.length}
                </span>{" "}
                saved restaurant{favourites.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Heart size={12} className="text-red-400" fill="red" />
                <span>Tap to remove</span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favourites.map((r, i) => {
                const image = getImage(r, i);
                return (
                  <div key={r.id} className="group relative">
                    <RestaurantCard
                      id={r.id}
                      name={r.name}
                      cuisine={r.type}
                      rating={r.rating ?? 0}
                      deliveryTime="30 – 40 Min"
                      deliveryFee="Free delivery"
                      image={image}
                      isFavourite
                      onToggleFavourite={toggle}
                    />
                    {/* Quick remove overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(r.id);
                      }}
                      className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-red-100 bg-white/90 shadow-sm backdrop-blur transition-all hover:border-red-200 hover:bg-red-50 hover:shadow-md active:scale-90 dark:border-red-900 dark:bg-neutral-800/90 dark:hover:border-red-800 dark:hover:bg-red-950 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Remove from favourites"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-green-200 bg-white px-6 py-3 text-sm font-bold text-[#22c555] shadow-sm transition-all hover:border-green-300 hover:bg-green-50 hover:shadow-md active:scale-[0.97] dark:border-green-800 dark:bg-neutral-900 dark:hover:border-green-700 dark:hover:bg-green-950"
              >
                Discover More Restaurants
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </section>

      <div className="h-12" />
    </div>
  );
}
