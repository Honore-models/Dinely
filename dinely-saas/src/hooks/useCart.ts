"use client";

import { useState } from "react";
import { ordersApi } from "../lib/api";

// This hook wires the Zustand cart store to the real orders API.
// Import useCartStore from "@/store/cartStore" for cart state;
// use this hook for submitting the cart as a real order.

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export function useCart() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const checkout = async (params: {
    restaurantId: string;
    items: CartItem[];
    type: "Delivery" | "Takeaway" | "Dine-in";
    deliveryAddress?: string;
    notes?: string;
  }) => {
    if (params.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await ordersApi.create(params);
      setOrderId(result.orderId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { checkout, submitting, error, orderId };
}
