"use client";

import Link from "next/link";
import { ChevronRight, Clock, Package, Truck, UtensilsCrossed } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

const statusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-[#22c51f]",
  Active: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-500",
  Pending: "bg-amber-50 text-amber-600",
};

export default function OrdersPage() {
  const { orders, loading, error } = useOrders();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/home" className="transition hover:text-neutral-800">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-neutral-900">Orders</span>
      </nav>

      <h1 className="text-2xl font-extrabold text-neutral-900">My Orders</h1>

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-neutral-500">No orders yet</p>
          <p className="mt-1 text-sm text-neutral-400">
            Place your first order to see it here
          </p>
          <Link
            href="/home"
            className="mt-5 rounded-full bg-[#22c51f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const itemNames = order.items.map((i) => i.name).join(", ");
            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Link
                key={order._id}
                href={order.status === "Active" || order.status === "Pending" ? `/orders/track` : "#"}
                className="block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-neutral-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyles[order.status] ?? "bg-neutral-50 text-neutral-500"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-neutral-500">{itemNames}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        {order.type === "Delivery" ? (
                          <Truck size={12} />
                        ) : order.type === "Takeaway" ? (
                          <Package size={12} />
                        ) : (
                          <UtensilsCrossed size={12} />
                        )}
                        {order.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        30–40 Min
                      </span>
                      <span>{date}</span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-base font-bold text-neutral-900">
                      ${order.total.toFixed(2)}
                    </p>
                    {(order.status === "Active" || order.status === "Pending") && (
                      <span className="mt-1 block text-xs font-semibold text-[#22c51f]">
                        Track order →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
