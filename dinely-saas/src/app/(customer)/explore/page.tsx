"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CategoryPills } from "@/components/customer/CategoryPills";
import { RestaurantCard } from "@/components/customer/RestaurantCard";

const allRestaurants = [
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
    name: "KFC Kigali",
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
  {
    id: "7",
    name: "Azzurri Club & Lounge",
    cuisine: "Italian · Bar",
    rating: 4.3,
    deliveryTime: "30 – 45 Min",
    deliveryFee: "$2.00 Delivery",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80",
  },
  {
    id: "8",
    name: "House of Mandi",
    cuisine: "Middle Eastern · Rice",
    rating: 4.8,
    deliveryTime: "25 – 35 Min",
    deliveryFee: "Free delivery Over $20",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  },
  {
    id: "9",
    name: "Kigali Marriott Bistro",
    cuisine: "International · Fine Dining",
    rating: 4.9,
    deliveryTime: "40 – 55 Min",
    deliveryFee: "$3.00 Delivery",
    image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80",
    promo: "10% off",
  },
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("burgers");

  const filtered = allRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-extrabold text-neutral-900">Explore Restaurants</h1>

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
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="mt-5">
        <CategoryPills selected={category} onSelect={setCategory} />
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="mb-4 text-sm text-neutral-500">
          {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} found
        </p>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center">
            <p className="text-base font-semibold text-neutral-500">
              No restaurants match your search
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-semibold text-[#22c51f] hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} {...r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
