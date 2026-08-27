"use client";

import { useState, useEffect } from "react";
import { restaurantsApi } from "@/lib/api";

interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  opening_hours: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
  website?: string;
  capacity?: string;
  plan: string;
  billing_cycle: string;
  subscription_status: string;
  rating?: number;
  review_count?: number;
}

export function useRestaurant(restaurantId?: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retries = 0;
    const maxRetries = 2;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Record<string, unknown> | null = null;
        if (restaurantId) {
          const res = await restaurantsApi.get(restaurantId);
          data = res.data as Record<string, unknown>;
        } else {
          const res = await restaurantsApi.mine();
          data = res.data as Record<string, unknown> | null;
        }

        if (!cancelled) {
          if (data) {
            setRestaurant(data as unknown as Restaurant);
          } else if (retries < maxRetries) {
            // Restaurant might not be linked yet — retry after a short delay
            retries++;
            setTimeout(load, 1500);
            return;
          } else {
            setRestaurant(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load restaurant",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [restaurantId]);

  const update = async (data: Partial<Restaurant>) => {
    if (!restaurant?.id) return;
    try {
      await restaurantsApi.update(
        restaurant.id,
        data as Record<string, unknown>,
      );
      setRestaurant((prev) => (prev ? { ...prev, ...data } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  return { restaurant, loading, error, update };
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    restaurantsApi
      .list()
      .then(({ data }) => setRestaurants(data as unknown as Restaurant[]))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load restaurants",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { restaurants, loading, error };
}
