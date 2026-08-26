"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { CategoryPills } from "@/components/customer/CategoryPills";
import { RestaurantCard } from "@/components/customer/RestaurantCard";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useFavourites } from "@/hooks/useFavourites";

interface Restaurant {
  id: string;
  name: string;
  type: string;
  address?: string;
  logo?: string;
  rating?: number;
  review_count?: number;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
];

function getRestaurantImage(r: Restaurant, idx: number): string {
  if (r.logo && r.logo.startsWith("http")) return r.logo;
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
}

const ratingOptions = ["4.5 & above", "4.0 & above", "3.5 & above", "3.0 & above"];
const ratingValues: Record<string, number> = {
  "4.5 & above": 4.5,
  "4.0 & above": 4.0,
  "3.5 & above": 3.5,
  "3.0 & above": 3.0,
};

export default function HomePage() {
  const [sortBy, setSortBy] = useState("Recommended");
  const [deliveryFilters, setDeliveryFilters] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [offerFilters, setOfferFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");

  const ratingValue = ratingFilter ? ratingValues[ratingFilter] : undefined;
  const { restaurants, loading } = useRestaurants({
    search: searchQuery || undefined,
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
    setCategory("");
  };

  const toggleFilter = (
    key: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(list.includes(key) ? list.filter((v) => v !== key) : [...list, key]);
  };

  const sorted = useMemo(() => {
    const arr = [...restaurants];
    if (sortBy === "Rating") arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return arr;
  }, [restaurants, sortBy]);

  const popular = sorted.slice(0, 3);
  const topRated = [...sorted].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 2);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <section className="mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] px-8 py-8 dark:from-[#0a1f0c] dark:to-[#0c2a0e] lg:mx-8 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="max-w-md">
            <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 dark:text-white md:text-4xl">
              Discover the best
              <br />
              Restaurants near you.
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">
              Explore top-rated restaurants, delicious cuisines
              <br />
              and exclusive offers all in one place
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-neutral-100/80 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200/70 active:scale-[0.98] dark:bg-neutral-700/80 dark:text-neutral-300 dark:hover:bg-neutral-600/70"
              >
                <MapPin size={15} className="text-[#22c555]" />
                <span className="font-semibold">Kigali-Rwanda</span>
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
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500"
              />
              <button
                type="button"
                onClick={() => setSearchQuery(searchInput)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-[#22c555] to-[#1bad1a] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:shadow-lg hover:shadow-green-300 active:scale-[0.97]"
              >
                Search
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-64 w-72">
              <Image
                src="/home_image.png"
                alt="Delicious food"
                fill
                className="rounded-2xl object-cover shadow-lg"
                sizes="288px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore by category ──────────────────────────────────────────────── */}
      <section className="mx-4 mt-8 lg:mx-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Explore by Category</h2>
        </div>
        <CategoryPills selected={category} onSelect={setCategory} />
      </section>

      {/* ── Main: Filters + Restaurants + Promo ─────────────────────────────── */}
      <div className="mx-4 mt-8 flex gap-6 lg:mx-8">
        {/* Filters sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">Filters</h3>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg bg-gradient-to-r from-[#22c555] to-[#1bad1a] px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-green-200 transition-all hover:shadow-md hover:shadow-green-300 active:scale-[0.95]"
              >
                Clear all
              </button>
            </div>

            {/* Sort by */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sort by</p>
              <div className="relative mt-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-green-200 bg-gradient-to-r from-[#22c555]/10 to-[#1bad1a]/10 py-2.5 pl-3 pr-8 text-sm font-semibold text-neutral-700 outline-none transition-all focus:border-[#22c555] focus:shadow-md focus:shadow-green-100 dark:border-green-800 dark:bg-green-950/30 dark:text-neutral-300 dark:focus:border-green-600"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#22c555]" />
              </div>
            </div>

            {/* Delivery Time */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Delivery Time</p>
              <div className="mt-2 space-y-1.5">
                {["10 min or less", "15 –30 min", "30–45 min", "45 min or more"].map((opt) => {
                  const active = deliveryFilters.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleFilter(opt, deliveryFilters, setDeliveryFilters)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all duration-200 ${                          active
                            ? "bg-[#dcfce7] text-[#15803d] shadow-sm ring-1 ring-[#22c555]/40 dark:bg-green-950 dark:text-green-400 dark:ring-green-800"
                            : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          active
                            ? "border-[#22c555] bg-[#22c555]"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {active && (
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ratings */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Ratings</p>
              <div className="mt-2 space-y-1.5">
                {ratingOptions.map((opt) => {
                  const active = ratingFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRatingFilter(opt)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all duration-200 ${                          active
                            ? "bg-[#dcfce7] text-[#15803d] shadow-sm ring-1 ring-[#22c555]/40 dark:bg-green-950 dark:text-green-400 dark:ring-green-800"
                            : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          active
                            ? "border-[#22c555] bg-[#22c555]"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <Star size={11} className={active ? "fill-amber-400 text-amber-400" : "fill-neutral-300 text-neutral-300"} />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Offers */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Offers</p>
              <div className="mt-2 space-y-1.5">
                {["Special Offers", "Free delivery"].map((opt) => {
                  const active = offerFilters.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleFilter(opt, offerFilters, setOfferFilters)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all duration-200 ${                          active
                            ? "bg-[#dcfce7] text-[#15803d] shadow-sm ring-1 ring-[#22c555]/40 dark:bg-green-950 dark:text-green-400 dark:ring-green-800"
                            : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          active
                            ? "border-[#22c555] bg-[#22c555]"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {active && (
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main feed */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-base font-semibold text-neutral-500 dark:text-neutral-300">
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
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Popular Restaurants Nearby
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {popular.map((r, i) => (
                    <RestaurantCard
                      key={r.id}
                      id={r.id}
                      name={r.name}
                      cuisine={r.type}
                      rating={r.rating ?? 0}
                      deliveryTime="30 – 40 Min"
                      deliveryFee="Free delivery Over $25"
                      image={getRestaurantImage(r, i)}
                      isFavourite={favouriteIds.has(r.id)}
                      onToggleFavourite={toggleFav}
                    />
                  ))}
                </div>
              </section>

              {topRated.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Top related Restaurants
                  </h2>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    {topRated.map((r, i) => (
                      <Link
                        key={r.id}
                        href={`/restaurants/${r.id}`}
                        className="group flex overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-neutral-800"
                      >
                        <div className="flex-1 p-4">
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{r.name}</h3>
                          <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{(r.rating ?? 0).toFixed(1)} ({r.review_count ?? 0})</span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{r.type}</p>
                          <p className="mt-1 text-xs text-[#22c51f]">
                            {r.address || "OpenBakenessergracht 109"}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#22c51f] hover:underline">
                            Ask about
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-700 dark:text-neutral-300">{r.name}</p>
                        </div>
                        <div className="relative h-auto w-36 shrink-0 bg-neutral-100 dark:bg-neutral-800">
                          <Image
                            src={getRestaurantImage(r, i)}
                            alt={r.name}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-105"
                            sizes="144px"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Promo sidebar */}
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="overflow-hidden rounded-2xl border border-green-100 bg-[#f0fdf4] p-4 dark:border-green-900 dark:bg-green-950/30">
            <p className="text-xl font-extrabold text-[#22c51f] dark:text-green-400">20% OFF</p>
            <p className="mt-0.5 text-sm font-bold text-neutral-800 dark:text-neutral-200">On your first order</p>
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
              className="mt-3 block w-full rounded-xl bg-gradient-to-r from-[#22c555] to-[#1bad1a] py-2.5 text-center text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:shadow-lg hover:shadow-green-300 active:scale-[0.97]"
            >
              Order Now
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">Free Delivery</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">On orders over $20</p>
            <div className="mt-3 flex items-center justify-center text-4xl">🛵</div>
            <Link
              href="/offers"
              className="mt-3 block w-full rounded-xl border-2 border-amber-400 bg-amber-50 py-2.5 text-center text-sm font-bold text-amber-700 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md active:scale-[0.97]"
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
