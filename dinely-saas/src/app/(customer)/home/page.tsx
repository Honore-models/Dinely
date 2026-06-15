"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, MapPin, Search, Star } from "lucide-react";
import { useState } from "react";
import { CategoryPills } from "@/components/customer/CategoryPills";
import { RestaurantCard } from "@/components/customer/RestaurantCard";

// ─── Mock data ────────────────────────────────────────────────────────────────
const popularRestaurants = [
  {
    id: "1",
    name: "The Golden Plate",
    cuisine: "Burgers · American",
    rating: 4.6,
    deliveryTime: "30 – 40 Min",
    deliveryFee: "Free delivery Over $25",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    promo: "20% off",
  },
  {
    id: "2",
    name: "Hard Rock CAFE",
    cuisine: "Pizza · Italian",
    rating: 3.2,
    deliveryTime: "35 – 41 Min",
    deliveryFee: "$1.99 Delivery",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    id: "3",
    name: "Kentucky Fried Chicken",
    cuisine: "Burgers · American",
    rating: 4.6,
    deliveryTime: "30 – 40 Min",
    deliveryFee: "Free delivery Over $25",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
  },
  {
    id: "4",
    name: "Mano Restaurant",
    cuisine: "Italian · Mediterranean",
    rating: 4.9,
    deliveryTime: "20 – 30 Min",
    deliveryFee: "Free delivery",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  },
  {
    id: "5",
    name: "Sushi Palace",
    cuisine: "Japanese · Sushi",
    rating: 4.7,
    deliveryTime: "25 – 35 Min",
    deliveryFee: "$1.50 Delivery",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
  },
  {
    id: "6",
    name: "The Green Bowl",
    cuisine: "Salads · Healthy",
    rating: 4.5,
    deliveryTime: "15 – 25 Min",
    deliveryFee: "Free delivery Over $15",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  },
];

const topRelated = [
  {
    id: "7",
    name: "Mano Restaurant",
    rating: 4.9,
    reviews: 273,
    priceRange: "€100+",
    address: "Openbakenessergracht 109",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80",
  },
  {
    id: "8",
    name: "Mano Restaurant",
    rating: 4.9,
    reviews: 273,
    priceRange: "€100+",
    address: "Openbakenessergracht 109",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80",
  },
];

const ratingOptions = ["4.5 & above", "4.0 & above", "3.5 & above", "3.0 & above"];
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [sortBy, setSortBy] = useState("Recommended");
  const [deliveryFilters, setDeliveryFilters] = useState<string[]>([]);
  const [ratingFilters, setRatingFilters] = useState<string[]>([]);
  const [offerFilters, setOfferFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilter = (
    key: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(list.includes(key) ? list.filter((v) => v !== key) : [...list, key]);
  };

  const clearAll = () => {
    setSortBy("Recommended");
    setDeliveryFilters([]);
    setRatingFilters([]);
    setOfferFilters([]);
  };

  return (
    <div>
      {/* ── Hero banner ─────────────────────────────────────────── */}
      <section className="mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] px-8 py-8 lg:mx-8 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="max-w-md">
            <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">
              Discover the best
              <br />
              Restaurants near you.
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Explore top-rated restaurants , delicious cuisines
              <br />
              and exclusive offers all in one place
            </p>

            {/* Location + search */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-[#22c51f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
              >
                Search
              </button>
            </div>
          </div>

          {/* Decorative food image */}
          <div className="hidden lg:block">
            <div className="relative h-44 w-44">
              <Image
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
                alt="Delicious food"
                fill
                className="rounded-full object-cover shadow-lg"
                sizes="176px"
              />
              {/* Floating leaves decoration */}
              <span className="absolute -left-4 top-4 text-2xl">🌿</span>
              <span className="absolute -right-2 bottom-6 text-xl">🌿</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore by category ─────────────────────────────────── */}
      <section className="mx-4 mt-8 lg:mx-8">
        <h2 className="mb-4 text-lg font-bold text-neutral-900">Explore by Category</h2>
        <CategoryPills />
      </section>

      {/* ── Main content: Filters + Restaurants + Promo ─────────── */}
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

            {/* Sort by */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Sort by
              </p>
              <div className="relative mt-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-[#22c51f]"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                  <option>Delivery Time</option>
                  <option>Price: Low to High</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* Delivery time */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Delivery Time
              </p>
              <div className="mt-2 space-y-2">
                {["10 min or less", "15 -30 min", "30-45 min", "45 min or more"].map(
                  (opt) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={deliveryFilters.includes(opt)}
                        onChange={() =>
                          toggleFilter(opt, deliveryFilters, setDeliveryFilters)
                        }
                        className="h-4 w-4 rounded border-neutral-300 accent-[#22c51f]"
                      />
                      <span className="text-xs text-neutral-600">{opt}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* Ratings */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Ratings
              </p>
              <div className="mt-2 space-y-2">
                {ratingOptions.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingFilters[0] === opt}
                      onChange={() => setRatingFilters([opt])}
                      className="h-4 w-4 accent-[#22c51f]"
                    />
                    <span className="flex items-center gap-1 text-xs text-neutral-600">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="ml-1">{opt}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Offers */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Offers
              </p>
              <div className="mt-2 space-y-2">
                {["Special Offers", "Free delivery"].map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={offerFilters.includes(opt)}
                      onChange={() =>
                        toggleFilter(opt, offerFilters, setOfferFilters)
                      }
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
          {/* Popular nearby */}
          <section>
            <h2 className="text-lg font-bold text-neutral-900">Popular Restaurants Nearby</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {popularRestaurants.slice(0, 3).map((r) => (
                <RestaurantCard key={r.id} {...r} />
              ))}
            </div>
          </section>

          {/* Top related */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-neutral-900">Top related Restaurants</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {topRelated.map((r) => (
                <Link
                  key={r.id}
                  href={`/restaurants/${r.id}`}
                  className="flex gap-4 overflow-hidden rounded-xl border border-neutral-100 bg-white p-3 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <p className="font-bold text-neutral-900">{r.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-500">
                      <Star size={12} className="fill-[#22c51f] text-[#22c51f]" />
                      <span className="font-semibold text-neutral-700">{r.rating}</span>
                      <span>({r.reviews})</span>
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">{r.priceRange}·Restaurant</p>
                    <p className="mt-0.5 truncate text-xs text-[#22c51f]">{r.address}</p>
                    <button
                      type="button"
                      className="mt-1 text-xs font-semibold text-neutral-500 transition hover:text-neutral-700"
                    >
                      Ask about
                    </button>
                    <p className="text-xs font-semibold text-neutral-700">{r.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* More restaurants */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-neutral-900">More Restaurants</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {popularRestaurants.slice(3).map((r) => (
                <RestaurantCard key={r.id} {...r} />
              ))}
            </div>
          </section>
        </div>

        {/* Promo sidebar */}
        <aside className="hidden w-52 shrink-0 xl:block">
          {/* 20% OFF promo */}
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
            <button
              type="button"
              className="mt-3 w-full rounded-full bg-[#22c51f] py-2 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
            >
              Order Now
            </button>
          </div>

          {/* Free delivery promo */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-lg font-extrabold text-amber-600">Free Delivery</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-700">On orders over $20</p>
            <div className="mt-3 flex items-center justify-center text-4xl">🛵</div>
            <button
              type="button"
              className="mt-3 w-full rounded-full border border-amber-400 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-100"
            >
              Order Now
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom padding */}
      <div className="h-12" />
    </div>
  );
}
