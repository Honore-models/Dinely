"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { ordersApi } from "@/lib/api";
import {
  Package,
  Truck,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FoodBooking {
  id: string;
  customer_name: string;
  items: { name: string; quantity: number; price: number }[];
  type: "Delivery" | "Takeaway";
  total: number;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Active: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-600",
};

const PAGE_SIZE = 10;

export default function FoodBookingsPage() {
  const [bookings, setBookings] = useState<FoodBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersApi.list({ limit: 100 });
      const all = res.data as unknown as FoodBooking[];
      // Filter to only Delivery and Takeaway orders
      setBookings(
        all.filter(
          (b) => b.type === "Delivery" || b.type === "Takeaway"
        )
      );
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = bookings.filter(
    (b) =>
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    active: bookings.filter((b) => b.status === "Active").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
  };

  return (
    <>
      <DashboardPageHeader
        title="Food Bookings"
        description="Manage takeaway and delivery reservations."
      />

      <DashboardSection className="mb-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total, color: "text-neutral-900" },
            { label: "Pending", value: stats.pending, color: "text-amber-600" },
            { label: "Active", value: stats.active, color: "text-blue-600" },
            { label: "Completed", value: stats.completed, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className={`text-2xl font-bold ${color} dark:text-white`}>{value}</p>
              <p className="mt-0.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</p>
            </div>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#22c51f] focus:outline-none focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-neutral-300" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400">
              No food bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 dark:border-neutral-700">
                  <tr className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginated.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      <td className="px-4 py-4 text-sm font-semibold text-neutral-900 dark:text-white">
                        #{b.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                        {b.customer_name}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          {b.type === "Delivery" ? (
                            <Truck size={14} className="text-neutral-400" />
                          ) : (
                            <Package size={14} className="text-neutral-400" />
                          )}
                          {b.type}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                        {b.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-neutral-900 dark:text-white">
                        ${b.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[b.status] ?? "bg-neutral-100 text-neutral-500"}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                  (p) => (
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
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardSection>
    </>
  );
}
