"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { CategoryPills } from "@/components/customer/CategoryPills";
import { RestaurantCard } from "@/components/customer/RestaurantCard";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useFavourites } from "@/hooks/useFavourites";

interface Restaurant {
  _id: string;
  name: string;
  type: string;
  logo?: string;
  rating?: number;
}

const ratingOptions = ["4.5 & above", "4.0 & above", "3.5 & above", "3.0 & above"];
const ratingValues: Record<string, number> = {
  "4.5 & above": 4.5,
  "4.0 & above": 4.0,
  "3.5 & above": 3.5,
  "3.0 & above": 3.0,
};

// Fallback images when no logo is uploaded
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
];

function getRestaurantImage(r: Restaurant, idx: number): string {
  if (r.logo && r.logo.startsWith("http")) {
    return r.logo;
  }
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
}

export default function HomePage() {
  const [sortBy, setSortBy] = useState("Recommended");
  const [deliveryFilters, setDeliveryFilters] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [offerFilters, setOfferFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("burgers");

  const ratingValue = ratingFilter ? ratingValues[ratingFilter] : undefined;
  const { restaurants, loading } = useRestaurants({
    search: searchQuery,
    rating: ratingValue,
  });
  const { favouriteIds, toggle: toggleFav } = useFavourites();

  const clearAll = () => {
    setSortBy("Recommended");
    setDeliveryFilters([]);
    setRatingFilter("");
    setOfferFilters([]);
    setSearchQuery("");
    setSearchInput("");
  };

  const toggleFilter = (
    key: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(list.includes(key) ? list.filter((v) => v !== key) : [...list, key]);
  };

  const sorted = [...restaurants].sort((a, b) => {
    if (sortBy === "Rating")
      return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  const popular = sorted.slice(0, 3);
  const more = sorted.slice(3);

  return (
    <div>
      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <section className="mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] px-8 py-8 lg:mx-8 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="max-w-md">
            <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">
              Discover the best
              <br />
              Restaurants near you.
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Explore top-rated restaurants, delicious cuisines
              <br />
              and exclusive offers all in one place
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                <MapPin size={14} className="text-[#22c51f]" />
                <span>Kigali-Rwanda</span>
                <ChevronDown size={14} className="text-neutral-400" />
              </button>
              <input
                type="text"
                placeholder="Search for restaurants, cuisines or dishes"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearchQuery(searchInput);
                }}
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setSearchQuery(searchInput)}
                className="shrink-0 rounded-lg bg-[#22c51f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
              >
                Search
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-44 w-44">
              <Image
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
                alt="Delicious food"
                fill
                className="rounded-full object-cover shadow-lg"
                sizes="176px"
              />
              <span className="absolute -left-4 top-4 text-2xl">🌿</span>
              <span className="absolute -right-2 bottom-6 text-xl">🌿</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore by category ──────────────────────────────────────────────── */}
      <section className="mx-4 mt-8 lg:mx-8">
        <h2 className="mb-4 text-lg font-bold text-neutral-900">Explore by Category</h2>
        <CategoryPills selected={category} onSelect={setCategory} />
      </section>

      {/* ── Main: Filters + Restaurants + Promo ─────────────────────────────── */}
      <div className="mx-4 mt-8 flex gap-6 lg:mx-8">
        {/* Filters sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900">Filters</h3>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-[#22c51f] transition hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sort by</p>
              <div className="relative mt-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-[#22c51f]"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Delivery Time</p>
              <div className="mt-2 space-y-2">
                {["10 min or less", "15 -30 min", "30-45 min", "45 min or more"].map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={deliveryFilters.includes(opt)}
                      onChange={() => toggleFilter(opt, deliveryFilters, setDeliveryFilters)}
                      className="h-4 w-4 rounded border-neutral-300 accent-[#22c51f]"
                    />
                    <span className="text-xs text-neutral-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Ratings</p>
              <div className="mt-2 space-y-2">
                {ratingOptions.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingFilter === opt}
                      onChange={() => setRatingFilter(opt)}
                      className="h-4 w-4 accent-[#22c51f]"
                    />
                    <span className="flex items-center gap-1 text-xs text-neutral-600">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{opt}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Offers</p>
              <div className="mt-2 space-y-2">
                {["Special Offers", "Free delivery"].map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={offerFilters.includes(opt)}
                      onChange={() => toggleFilter(opt, offerFilters, setOfferFilters)}
                      className="h-4 w-4 rounded border-neutral-300 accent-[#22c51f]"
                    />
                    <span className="text-xs text-neutral-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main feed */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center">
              <p className="text-base font-semibold text-neutral-500">
                No restaurants found
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-3 text-sm font-semibold text-[#22c51f] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-bold text-neutral-900">
                  Popular Restaurants Nearby
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {popular.map((r, i) => (
                  <RestaurantCard
                    key={r._id}
                    id={r._id}
                    name={r.name}
                    cuisine={r.type}
                    rating={r.rating ?? 0}
                    deliveryTime="30 – 40 Min"
                    deliveryFee="Free delivery Over $25"
                    image={getRestaurantImage(r, i)}
                    isFavourite={favouriteIds.has(r._id)}
                    onToggleFavourite={toggleFav}
                  />
                ))}
                </div>
              </section>

              {more.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-bold text-neutral-900">
                    More Restaurants
                  </h2>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {more.map((r, i) => (
                    <RestaurantCard
                      key={r._id}
                      id={r._id}
                      name={r.name}
                      cuisine={r.type}
                      rating={r.rating ?? 0}
                      deliveryTime="30 – 40 Min"
                      deliveryFee="Free delivery"
                      image={getRestaurantImage(r, i + 3)}
                      isFavourite={favouriteIds.has(r._id)}
                      onToggleFavourite={toggleFav}
                    />
                  ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Promo sidebar */}
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="overflow-hidden rounded-2xl border border-green-100 bg-[#f0fdf4] p-4">
            <p className="text-xl font-extrabold text-[#22c51f]">20% OFF</p>
            <p className="mt-0.5 text-sm font-bold text-neutral-800">On your first order</p>
            <p className="mt-1 text-xs text-neutral-500">User Code: 00958SD</p>
            <div className="relative mx-auto mt-3 h-20 w-20">
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80"
                alt="Promo food"
                fill
                className="rounded-full object-cover"
                sizes="80px"
              />
            </div>
            <Link
              href="/offers"
              className="mt-3 block w-full rounded-full bg-[#22c51f] py-2 text-center text-sm font-bold text-white transition hover:bg-[#1bad1a]"
            >
              Order Now
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-lg font-extrabold text-amber-600">Free Delivery</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-700">On orders over $20</p>
            <div className="mt-3 flex items-center justify-center text-4xl">🛵</div>
            <Link
              href="/offers"
              className="mt-3 block w-full rounded-full border border-amber-400 py-2 text-center text-sm font-bold text-amber-600 transition hover:bg-amber-100"
            >
              Order Now
            </Link>
          </div>
        </aside>
      </div>

      <div className="h-12" />
    </div>
  );
}
