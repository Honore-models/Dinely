"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Download, MoreVertical, Truck, Package, UtensilsCrossed, ChevronLeft, ChevronRight,
} from "lucide-react";
import { ordersApi } from "@/lib/api";

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  _id: string;
  customerName: string;
  items: OrderItem[];
  type: "Delivery" | "Takeaway" | "Dine-in";
  total: number;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  Completed: "text-emerald-600",
  Active: "text-blue-600",
  Pending: "text-amber-600",
  Cancelled: "text-red-600",
};

const PAGE_SIZE = 10;

export function OrdersTable() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersApi.list({ page, limit: PAGE_SIZE });
      setOrders(res.data as unknown as Order[]);
      setTotal(res.total);
    } catch {/* ignore */} finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) =>
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-[#22c51f] focus:outline-none focus:ring-1 focus:ring-green-100"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
            <Download size={15} /> Export
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-neutral-100" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200">
                <tr className="text-xs font-semibold text-neutral-500">
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
                    <td colSpan={8} className="py-12 text-center text-sm text-neutral-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    });
                    const time = new Date(order.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    });
                    return (
                      <tr
                        key={order._id}
                        onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                        className="cursor-pointer transition hover:bg-neutral-50"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-neutral-900">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-4 text-sm text-neutral-700">{order.customerName}</td>
                        <td className="px-4 py-4 text-sm text-neutral-700">
                          {order.items.map((item, i) => (
                            <div key={i}>
                              <span className="font-semibold text-neutral-900">{item.quantity}× {item.name}</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            {order.type === "Delivery" && <Truck size={15} className="text-neutral-400" />}
                            {order.type === "Takeaway" && <Package size={15} className="text-neutral-400" />}
                            {order.type === "Dine-in" && <UtensilsCrossed size={15} className="text-neutral-400" />}
                            <span className="text-neutral-700">{order.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-neutral-900">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-4 text-xs text-neutral-500">
                          <span>{time}</span>
                          <br />
                          <span>{date}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-sm font-semibold ${STATUS_COLOR[order.status] ?? "text-neutral-600"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button className="text-neutral-400 hover:text-neutral-600" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded text-xs font-semibold ${
                  p === page ? "bg-[#22c51f] text-white" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
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
