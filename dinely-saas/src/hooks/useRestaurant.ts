"use client";

import { useState, useEffect } from "react";
import { restaurantsApi } from "../lib/api";

interface Restaurant {
  _id: string;
  name: string;
  type: string;
  address: string;
  openingHours: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
  plan: string;
  billingCycle: string;
  subscriptionStatus: string;
}

export function useRestaurant(restaurantId?: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (restaurantId) {
          const { data } = await restaurantsApi.get(restaurantId);
          setRestaurant(data as Restaurant);
        } else {
          // Owner fetching their own restaurant
          const { data } = await restaurantsApi.mine();
          setRestaurant(data as Restaurant | null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load restaurant",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [restaurantId]);

  const update = async (data: Partial<Restaurant>) => {
    if (!restaurant?._id) return;
    try {
      await restaurantsApi.update(
        restaurant._id,
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
      .then(({ data }) => setRestaurants(data as Restaurant[]))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load restaurants",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { restaurants, loading, error };
}
