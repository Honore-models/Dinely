"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  CookingPot,
  Loader2,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { ordersApi } from "@/lib/api";

interface Order {
  id: string;
  customer_name: string;
  items: { name: string; quantity: number; price: number }[];
  type: "Delivery" | "Takeaway" | "Dine-in";
  total: number;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  payment_method?: "jjuma" | "cash";
  payment_status?: string;
  created_at: string;
  delivery_address?: string;
}

const statusSteps = [
  { key: "Pending", label: "Order Placed", icon: Clock, description: "Your order has been received" },
  { key: "Active", label: "Preparing", icon: CookingPot, description: "The kitchen is preparing your food" },
  { key: "Completed", label: "Delivered", icon: CheckCircle, description: "Your order has been delivered" },
];

export default function OrderTrackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await ordersApi.get(orderId);
        setOrder(data as unknown as Order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <Loader2 size={32} className="mx-auto animate-spin text-neutral-300" />
        <p className="mt-4 text-sm text-neutral-500">Loading your order...</p>
      </div>
    );
  }

  if (!orderId || error || !order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <XCircle size={48} className="mx-auto text-neutral-300" />
        <p className="mt-4 text-base font-semibold text-neutral-500">
          {error || "Order not found"}
        </p>
        <Link
          href="/home"
          className="mt-4 inline-block rounded-full bg-[#22c51f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="mx-auto max-w-xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/home" className="transition hover:text-neutral-800">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/orders" className="transition hover:text-neutral-800">
          Orders
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-neutral-900">Track</span>
      </nav>

      {/* Order header */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm text-center">
        {isCancelled ? (
          <>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="mt-4 text-xl font-extrabold text-neutral-900">
              Order Cancelled
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              This order has been cancelled
            </p>
          </>
        ) : order.status === "Completed" ? (
          <>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100">
              <CheckCircle size={32} className="text-[#22c51f]" />
            </div>
            <h1 className="mt-4 text-xl font-extrabold text-neutral-900">
              Order Delivered! 🎉
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Your order has been delivered successfully
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-100">
              <Truck size={32} className="text-blue-600" />
            </div>
            <h1 className="mt-4 text-xl font-extrabold text-neutral-900">
              {order.status === "Pending" ? "Order Confirmed!" : "Preparing Your Order..."}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Order #{order.id.slice(-6).toUpperCase()}
            </p>
          </>
        )}
      </div>

      {/* Status timeline */}
      {!isCancelled && (
        <div className="mt-6 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-neutral-900">Order Status</h2>
          <div className="mt-5 space-y-0">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Icon + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                        isCompleted
                          ? "bg-[#22c51f] text-white"
                          : "border-2 border-neutral-200 bg-white text-neutral-400"
                      }`}
                    >
                      <StepIcon size={14} />
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 ${
                          idx < currentStepIndex ? "bg-[#22c51f]" : "bg-neutral-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="pb-6">
                    <p
                      className={`text-sm font-bold ${
                        isCompleted ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                      {isCurrent && !isCompleted && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                          Current
                        </span>
                      )}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${
                        isCompleted ? "text-neutral-500" : "text-neutral-300"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="mt-6 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Order Details</h2>

        <div className="mt-4 space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-neutral-700">
                <span className="font-bold text-[#22c51f]">{item.quantity}×</span>{" "}
                {item.name}
              </span>
              <span className="font-semibold text-neutral-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-neutral-100 pt-3">
          <div className="flex justify-between text-sm font-bold text-neutral-900">
            <span>Total</span>
            <span className="text-[#22c51f]">${order.total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-neutral-500">
            <span>
              {order.payment_method === "cash"
                ? "Cash on delivery"
                : "Paid online (Jjuma)"}
            </span>
            <span className="font-semibold capitalize text-neutral-700">
              {order.payment_status === "paid"
                ? "Paid"
                : order.payment_status === "awaiting_payment"
                  ? "Awaiting payment"
                  : order.payment_status === "unpaid"
                    ? "Pay on delivery"
                    : order.payment_status ?? "—"}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-neutral-400" />
            <span>{order.type}</span>
          </div>
          {order.delivery_address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-neutral-400" />
              <span>{order.delivery_address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/home"
          className="flex-1 rounded-xl border border-[#22c51f] py-3 text-center text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
        >
          Order Again
        </Link>
        <Link
          href="/orders"
          className="flex-1 rounded-xl bg-neutral-900 py-3 text-center text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
