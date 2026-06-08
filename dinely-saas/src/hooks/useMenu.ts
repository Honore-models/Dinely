"use client";

import { useState, useEffect, useCallback } from "react";
import { menuApi } from "@/lib/api";

interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  mealTimes: string[];
  priceRange: string;
  promo?: string;
  rating: number;
  reviews: number;
  orders: number;
  favourites: number;
  available: boolean;
}

export function useMenu(restaurantId?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await menuApi.list(restaurantId);
      setItems(data as unknown as MenuItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    load();
  }, [load]);

  const createItem = async (
    data: Omit<
      MenuItem,
      "_id" | "restaurantId" | "rating" | "reviews" | "orders" | "favourites"
    >,
  ) => {
    try {
      const result = await menuApi.create(data as Record<string, unknown>);
      await load(); // refresh list
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item");
      throw err;
    }
  };

  const updateItem = async (id: string, data: Partial<MenuItem>) => {
    try {
      await menuApi.update(id, data as Record<string, unknown>);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...data } : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await menuApi.delete(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: load,
  };
}
