"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  MoreVertical,
  Truck,
  Package,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { ordersApi } from "@/lib/api";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
interface Order {
  id: string;
  customer_name: string;
  items: OrderItem[];
  type: "Delivery" | "Takeaway" | "Dine-in";
  total: number;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
  Completed: "text-emerald-600",
  Active: "text-blue-600",
  Pending: "text-amber-600",
  Cancelled: "text-red-600",
};

const STATUS_OPTIONS: {
  label: string;
  value: Order["status"];
  icon: typeof CheckCircle;
  color: string;
}[] = [
  {
    label: "Start Preparing",
    value: "Active",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    label: "Mark Completed",
    value: "Completed",
    icon: CheckCircle,
    color: "text-emerald-600",
  },
  { label: "Cancel", value: "Cancelled", icon: XCircle, color: "text-red-600" },
];

const PAGE_SIZE = 10;

export function OrdersTable({ refreshKey }: { refreshKey?: number } = {}) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersApi.list({ page, limit: PAGE_SIZE });
      setOrders(res.data as unknown as Order[]);
      setTotal(res.total);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // Close action menu on outside click
  useEffect(() => {
    const handler = () => setActionMenuId(null);
    if (actionMenuId) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [actionMenuId]);

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setUpdatingId(orderId);
    setActionMenuId(null);
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch {
      /* ignore */
    } finally {
      setUpdatingId(null);
    }
  };

  const getAvailableActions = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return STATUS_OPTIONS.filter(
          (o) => o.value === "Active" || o.value === "Cancelled",
        );
      case "Active":
        return STATUS_OPTIONS.filter(
          (o) => o.value === "Completed" || o.value === "Cancelled",
        );
      default:
        return [];
    }
  };

  return (
    <section>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-[#22c51f] focus:outline-none focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[#22c555]"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600">
            <Download size={15} /> Export
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (              <div key={i}
                className="h-14 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 dark:border-neutral-700">
                <tr className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-sm text-neutral-400"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const date = new Date(order.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    );
                    const time = new Date(order.created_at).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );
                    const actions = getAvailableActions(order.status);
                    return (
                      <tr
                        key={order.id}
                        onClick={() =>
                          router.push(`/dashboard/orders/${order.id}`)
                        }
                        className="cursor-pointer transition hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                          {order.customer_name}
                        </td>
                        <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                          {order.items.map((item, i) => (
                            <div key={i}>
                              <span className="font-semibold text-neutral-900 dark:text-white">
                                {item.quantity}× {item.name}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            {order.type === "Delivery" && (
                              <Truck size={15} className="text-neutral-400" />
                            )}
                            {order.type === "Takeaway" && (
                              <Package size={15} className="text-neutral-400" />
                            )}
                            {order.type === "Dine-in" && (
                              <UtensilsCrossed
                                size={15}
                                className="text-neutral-400"
                              />
                            )}
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {order.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-xs text-neutral-500 dark:text-neutral-400">
                          <span>{time}</span>
                          <br />
                          <span>{date}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-sm font-semibold ${STATUS_COLOR[order.status] ?? "text-neutral-600"}`}
                          >
                            {updatingId === order.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              order.status
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {actions.length > 0 ? (
                            <div className="relative">
                              <button
                                className="text-neutral-400 hover:text-neutral-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActionMenuId(
                                    actionMenuId === order.id ? null : order.id,
                                  );
                                }}
                              >
                                <MoreVertical size={16} />
                              </button>
                              {actionMenuId === order.id && (
                                <div
                                  className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {actions.map((action) => (
                                    <button
                                      key={action.value}
                                      onClick={() =>
                                        handleStatusChange(
                                          order.id,
                                          action.value,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                      <action.icon
                                        size={14}
                                        className={action.color}
                                      />
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-neutral-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
            {Math.min(page * PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded text-xs font-semibold ${
                  p === page
                    ? "bg-[#22c51f] text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrdersTable;
