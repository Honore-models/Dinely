"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { RestaurantCard } from "@/components/customer/RestaurantCard";
import { useFavourites } from "@/hooks/useFavourites";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
];

export default function FavouritesPage() {
  const { favourites, loading, error, toggle } = useFavourites();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="flex items-center gap-3">
        <Heart size={24} className="fill-red-500 text-red-500" />
        <h1 className="text-2xl font-extrabold text-neutral-900">My Favourites</h1>
      </div>
      {!loading && (
        <p className="mt-1 text-sm text-neutral-500">
          {favourites.length} saved restaurant{favourites.length !== 1 ? "s" : ""}
        </p>
      )}

      {loading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : favourites.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm">
          <Heart size={40} className="text-neutral-200" />
          <p className="mt-3 text-base font-semibold text-neutral-500">No favourites yet</p>
          <p className="mt-1 text-sm text-neutral-400">
            Tap the heart icon on any restaurant to save it here
          </p>
          <Link
            href="/explore"
            className="mt-5 rounded-full bg-[#22c51f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((r, i) => {
            const image =
              r.logo && r.logo.startsWith("http")
                ? r.logo
                : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            return (
              <RestaurantCard
                key={r._id}
                id={r._id}
                name={r.name}
                cuisine={r.type}
                rating={r.rating ?? 0}
                deliveryTime="30 – 40 Min"
                deliveryFee="Free delivery"
                image={image}
                isFavourite
                onToggleFavourite={toggle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
