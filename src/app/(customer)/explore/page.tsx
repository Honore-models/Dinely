"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { CategoryPills } from "@/components/customer/CategoryPills";
import { RestaurantCard } from "@/components/customer/RestaurantCard";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useFavourites } from "@/hooks/useFavourites";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
];

function getImage(logo: string | undefined, idx: number): string {
  if (logo && logo.startsWith("http")) return logo;
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("burgers");
  const [sortBy, setSortBy] = useState("Recommended");

  const { restaurants, loading } = useRestaurants({ search: query || undefined });
  const { favouriteIds, toggle: toggleFav } = useFavourites();

  const sorted = [...restaurants].sort((a, b) => {
    if (sortBy === "Rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
        Explore Restaurants
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Discover the best restaurants and cuisines near you
      </p>

      {/* Search bar */}
      <div className="mt-5 flex gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines or dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:ring-green-900"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <option>Recommended</option>
          <option>Rating</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mt-5">
        <CategoryPills selected={category} onSelect={setCategory} />
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-base font-semibold text-neutral-500 dark:text-neutral-400">
              {query ? "No restaurants match your search" : "No restaurants found"}
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-semibold text-[#22c51f] hover:underline"
            >
              {query ? "Clear search" : "Check back later"}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
              {sorted.length} restaurant{sorted.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((r, i) => (
                <RestaurantCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  cuisine={r.type}
                  rating={r.rating ?? 0}
                  deliveryTime="30 – 40 Min"
                  deliveryFee="Free delivery"
                  image={getImage(r.logo, i)}
                  isFavourite={favouriteIds.has(r.id)}
                  onToggleFavourite={toggleFav}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
