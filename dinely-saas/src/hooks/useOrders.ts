"use client";

import { useState, useEffect, useCallback } from "react";
import { ordersApi } from "@/lib/api";

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  type: "Delivery" | "Takeaway" | "Dine-in";
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  total: number;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.list(params);
      setOrders(res.data as Order[]);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.status, params?.page, params?.limit]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: Order["status"]) => {
    try {
      await ordersApi.updateStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
      throw err;
    }
  };

  const placeOrder = async (data: {
    restaurantId: string;
    items: OrderItem[];
    type: Order["type"];
    deliveryAddress?: string;
    notes?: string;
  }) => {
    try {
      const result = await ordersApi.create(data);
      await load();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
      throw err;
    }
  };

  return {
    orders,
    total,
    loading,
    error,
    updateStatus,
    placeOrder,
    refresh: load,
  };
}
