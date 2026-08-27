"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

interface RestaurantDetailHeaderProps {
  name: string;
  type: string;
  rating: number;
  reviewCount: string;
  coverImage: string;
  logoImage?: string;
  tagline?: string;
  onOrderNow?: () => void;
  onBookTable?: () => void;
}

export function RestaurantDetailHeader({
  name,
  type,
  rating,
  reviewCount,
  coverImage,
  tagline,
  onOrderNow,
  onBookTable,
}: RestaurantDetailHeaderProps) {
  const [fav, setFav] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: 340 }}>
      {/* Cover image */}
      <Image
        src={coverImage}
        alt={name}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {tagline && (
          <p className="mb-1 text-sm font-medium italic text-white/80">{tagline}</p>
        )}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-sm">
              {name}
            </h1>
            <p className="mt-0.5 text-sm font-medium text-white/80">{type}</p>
            <div className="mt-1 flex items-center gap-1.5 text-sm">
              <Star size={14} className="fill-[#22c51f] text-[#22c51f]" />
              <span className="font-bold text-white">{rating.toFixed(1)}</span>
              <span className="text-white/60">({reviewCount} Reviews)</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={onOrderNow}
                className="rounded-full bg-[#22c51f] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
              >
                Order Now
              </button>
              <button
                type="button"
                onClick={onBookTable}
                className="rounded-full border border-white px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Book a Table
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 bg-white/20 backdrop-blur-sm transition hover:bg-white/30"
          >
            <Heart
              size={18}
              className={fav ? "fill-red-400 text-red-400" : "text-white"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
