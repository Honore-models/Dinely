"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderDetails } from "@/components/dashboard/OrderDetails";
import { ordersApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  customer_name: string;
  customer_email?: string;
  items: OrderItem[];
  type: "Delivery" | "Takeaway" | "Dine-in";
  total: number;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  created_at: string;
  delivery_address?: string;
  notes?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await ordersApi.get(orderId);
        setOrder(data as unknown as OrderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-semibold text-neutral-500">
          {error || "Order not found"}
        </p>
        <Link
          href="/dashboard/orders"
          className="mt-4 text-sm font-bold text-[#22c51f] hover:underline"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = new Date(order.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const subtotal = order.total * 0.9;
  const deliveryFee = order.total * 0.1;

  return (
    <OrderDetails
      orderID={`#${order.id.slice(-6).toUpperCase()}`}
      date={date}
      time={time}
      status={order.status as "Completed" | "Active" | "Cancelled"}
      customer={{
        name: order.customer_name || "Customer",
        phone: order.customer_email || "-",
        address: order.delivery_address || "-",
      }}
      type={order.type}
      items={order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: `$${item.price.toFixed(2)}`,
      }))}
      subtotal={`$${subtotal.toFixed(2)}`}
      deliveryFee={`$${deliveryFee.toFixed(2)}`}
      total={`$${order.total.toFixed(2)}`}
      payment={{
        method: "Online Payment",
        status: order.status === "Completed" ? "Paid" : "Pending",
        transactionID: `TXN-${order.id.slice(-8).toUpperCase()}`,
      }}
    />
  );
}
