"use client";

import { useState, useEffect, useCallback } from "react";
import { restaurantsApi } from "@/lib/api";

interface Restaurant {
  _id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  subscriptionStatus: string;
}

export function useRestaurants(params?: {
  search?: string;
  category?: string;
  rating?: number;
}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await restaurantsApi.list(params);
      setRestaurants(res.data as unknown as Restaurant[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load restaurants",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.search, params?.category, params?.rating]);

  useEffect(() => {
    load();
  }, [load]);

  return { restaurants, loading, error, refresh: load };
}
