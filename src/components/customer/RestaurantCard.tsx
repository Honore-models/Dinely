"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clock, Heart, Loader2, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  const [imgError, setImgError] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setFavLoading(true);
    setFav((v) => !v);
    try {
      await onToggleFavourite?.(id);
    } finally {
      setFavLoading(false);
    }
  };

  const displayImage =
    imgError || !image
      ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
      : image;

  return (
    <Link href={`/restaurants/${id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-neutral-800">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          {/* Promo badge */}
          {promo && (
            <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {promo}
            </span>
          )}

          {/* Favourite button */}
          <button
            type="button"
            onClick={handleFav}
            disabled={favLoading}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:bg-white hover:scale-110 active:scale-95 dark:bg-neutral-800/90 dark:hover:bg-neutral-700"
          >
            {favLoading ? (
              <Loader2 size={16} className="animate-spin text-red-400" />
            ) : (
              <Heart
                size={16}
                className={
                  fav
                    ? "fill-red-500 text-red-500"
                    : "text-neutral-400 transition-colors group-hover:text-neutral-500"
                }
              />
            )}
          </button>

          {/* Rating badge (bottom-left) */}
          {rating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur dark:bg-neutral-800/90">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-neutral-800 dark:text-white">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-neutral-900 dark:text-white">
                {name}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{cuisine}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 border-t border-neutral-50 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-neutral-400" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{deliveryTime}</span>
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-neutral-400" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{deliveryFee}</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
