"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { RestaurantCard } from "@/components/customer/RestaurantCard";

const initialFavourites = [
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
];

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState(initialFavourites);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="flex items-center gap-3">
        <Heart size={24} className="fill-red-500 text-red-500" />
        <h1 className="text-2xl font-extrabold text-neutral-900">My Favourites</h1>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        {favourites.length} saved restaurant{favourites.length !== 1 ? "s" : ""}
      </p>

      {favourites.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center">
          <Heart size={40} className="text-neutral-200" />
          <p className="mt-3 text-base font-semibold text-neutral-500">
            No favourites yet
          </p>
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
          {favourites.map((r) => (
            <RestaurantCard
              key={r.id}
              {...r}
              isFavourite
              onToggleFavourite={toggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
