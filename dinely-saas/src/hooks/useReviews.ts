"use client";

import { useState, useEffect, useCallback } from "react";
import { reviewsApi } from "@/lib/api";

interface Review {
  _id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}

export function useReviews(
  restaurantId: string,
  params?: { page?: number; limit?: number },
) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await reviewsApi.list(restaurantId, params);
      setReviews(res.data as unknown as Review[]);
      setTotal(res.total);
      setAvgRating(res.avgRating);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, params?.page, params?.limit]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReview = async (body: {
    rating: number;
    comment: string;
  }) => {
    const res = await reviewsApi.create({ restaurantId, ...body });
    await load();
    return res;
  };

  const markHelpful = async (id: string) => {
    await reviewsApi.markHelpful(id);
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, helpful: r.helpful + 1 } : r)),
    );
  };

  return {
    reviews,
    total,
    avgRating,
    loading,
    error,
    submitReview,
    markHelpful,
    refresh: load,
  };
}
