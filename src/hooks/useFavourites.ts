"use client";

import { useState, useEffect } from "react";
import { favouritesApi } from "@/lib/api";

interface FavRestaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  logo?: string;
  rating?: number;
  [key: string]: unknown;
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<FavRestaurant[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await favouritesApi.list();
      const list = res.data as unknown as FavRestaurant[];
      setFavourites(list);
      setFavouriteIds(new Set(list.map((r) => r.id)));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load favourites";
      // If 401, user isn't logged in - show empty state instead of error
      if (msg.includes("401") || msg.includes("Unauthorized")) {
        setFavourites([]);
        setFavouriteIds(new Set());
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (restaurantId: string) => {
    try {
      if (favouriteIds.has(restaurantId)) {
        await favouritesApi.remove(restaurantId);
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(restaurantId);
          return next;
        });
        setFavourites((prev) => prev.filter((r) => r.id !== restaurantId));
      } else {
        await favouritesApi.add(restaurantId);
        setFavouriteIds((prev) => new Set([...prev, restaurantId]));
        load();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update favourites",
      );
    }
  };

  return { favourites, favouriteIds, loading, error, toggle, refresh: load };
}
