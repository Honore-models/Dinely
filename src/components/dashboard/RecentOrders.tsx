"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Clock, Package, Truck, UtensilsCrossed } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

interface Order {
  id: string;
  customer_name: string;
  items: { name: string; quantity: number; price: number }[];
  type: string;
  status: string;
  total: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  Pending: { label: "Pending", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
  Active: { label: "Active", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
  Completed: { label: "Completed", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
  Cancelled: { label: "Cancelled", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
};

const typeIcons: Record<string, typeof Clock> = {
  Delivery: Truck,
  Takeaway: Package,
  "Dine-in": UtensilsCrossed,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .list({ limit: 6 })
      .then((res) => setOrders(res.data as unknown as Order[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader
        title="Recent Orders"
        subtitle="Latest incoming orders"
        action={
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-bold text-[#22c555] transition hover:underline"
          >
            View all
            <ChevronRight size={14} />
          </Link>
        }
      />

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 text-center text-sm text-neutral-400 dark:text-neutral-500">
          No orders yet. Orders will appear here once placed.
        </div>
      ) : (
        <div className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.Pending;
            const TypeIcon = typeIcons[order.type] || Package;
            const itemSummary = order.items
              .map((i) => `${i.quantity}× ${i.name}`)
              .join(", ");

            return (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center gap-3 py-3 transition hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 -mx-2 px-2 rounded-lg"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  <TypeIcon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                      {order.customer_name || "Customer"}
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {itemSummary}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                    {timeAgo(order.created_at)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
