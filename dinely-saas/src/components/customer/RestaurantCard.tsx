"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Star } from "lucide-react";
import { useState } from "react";

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  image: string;
  promo?: string;
  isFavourite?: boolean;
  onToggleFavourite?: (id: string) => void;
}

export function RestaurantCard({
  id,
  name,
  cuisine,
  rating,
  deliveryTime,
  deliveryFee,
  image,
  promo,
  isFavourite = false,
  onToggleFavourite,
}: RestaurantCardProps) {
  const [fav, setFav] = useState(isFavourite);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav((v) => !v);
    onToggleFavourite?.(id);
  };

  return (
    <Link href={`/restaurants/${id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {promo && (
            <span className="absolute left-3 top-3 rounded-full bg-[#22c51f] px-2.5 py-0.5 text-xs font-bold text-white">
              {promo}
            </span>
          )}
          <button
            type="button"
            onClick={handleFav}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
          >
            <Heart
              size={16}
              className={fav ? "fill-red-500 text-red-500" : "text-neutral-400"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="truncate text-[15px] font-bold text-neutral-900">{name}</h3>
          <p className="mt-0.5 text-xs text-neutral-500">{cuisine}</p>

          <div className="mt-2.5 flex items-center gap-3 text-xs text-neutral-600">
            <span className="flex items-center gap-1 font-semibold text-[#22c51f]">
              <Star size={12} className="fill-[#22c51f]" />
              {rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-neutral-400" />
              {deliveryTime}
            </span>
            <span className="text-neutral-500">{deliveryFee}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
