"use client";

import Link from "next/link";
import { ChevronRight, Clock, Package, Truck, UtensilsCrossed } from "lucide-react";

const orders = [
  {
    id: "ord-1",
    restaurantName: "The Golden Plate",
    items: ["Herb-Roasted Meat", "Crispy Chicken"],
    total: 40.96,
    status: "Delivered",
    date: "May 28, 2026",
    deliveryTime: "30-40 Min",
    type: "Delivery",
  },
  {
    id: "ord-2",
    restaurantName: "Hard Rock CAFE",
    items: ["Pepperoni Pizza"],
    total: 11.0,
    status: "Active",
    date: "June 15, 2026",
    deliveryTime: "35-41 Min",
    type: "Delivery",
  },
  {
    id: "ord-3",
    restaurantName: "Kentucky Fried Chicken",
    items: ["Crispy Bucket", "Coleslaw", "Corn"],
    total: 28.5,
    status: "Cancelled",
    date: "May 10, 2026",
    deliveryTime: "30-40 Min",
    type: "Takeaway",
  },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-green-50 text-[#22c51f]",
  Active: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-500",
  Pending: "bg-amber-50 text-amber-600",
};

export default function OrdersPage() {
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

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/track`}
            className="block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-neutral-900">{order.restaurantName}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {order.items.join(", ")}
                </p>
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
                    {order.deliveryTime}
                  </span>
                  <span>{order.date}</span>
                </div>
              </div>
              <div className="ml-4 shrink-0 text-right">
                <p className="text-base font-bold text-neutral-900">
                  ${order.total.toFixed(2)}
                </p>
                {order.status === "Active" && (
                  <span className="mt-1 block text-xs font-semibold text-[#22c51f]">
                    Track order →
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
