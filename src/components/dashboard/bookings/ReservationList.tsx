"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Phone, Plus, Search, X, Loader2, Calendar, Users } from "lucide-react";
import { DashboardCard } from "../DashboardCard";
import { bookingsApi, tablesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_id: string;
  date: string;
  time: string;
  party_size: number;
  table_id: string | null;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  notes: string | null;
  created_at: string;
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: string;
}

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  Confirmed: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  Completed: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  Cancelled: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-600 dark:text-red-400" },
};

export function ReservationList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "Pending" | "Confirmed" | "Completed">("all");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    party_size: "2",
    table_id: "",
    notes: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, tablesRes] = await Promise.all([
        bookingsApi.list(),
        tablesApi.list(),
      ]);
      setBookings(bookingsRes.data as unknown as Booking[]);
      setTables(
        (tablesRes.data as unknown as Table[]).filter(
          (t) => t.status === "available" || t.status === "reserved",
        ),
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

  const filtered = bookings.filter((b) => {
    const matchesTab = activeTab === "all" || b.status === activeTab;
    const matchesSearch =
      !search ||
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: bookings.length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Create a placeholder booking via the API
      const payload = {
        restaurantId: user?.restaurantId || "",
        date: form.date,
        time: form.time,
        partySize: parseInt(form.party_size),
        tableId: form.table_id || undefined,
        notes: form.notes || undefined,
      };
      await bookingsApi.create(payload);
      await load();
      setShowModal(false);
      setForm({
        customer_name: "",
        customer_email: "",
        date: new Date().toISOString().split("T")[0],
        time: "19:00",
        party_size: "2",
        table_id: "",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reservation");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsApi.update(bookingId, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as Booking["status"] } : b)),
      );
    } catch {
      // ignore
    }
  };

  return (
    <>
      <DashboardCard className="flex w-full flex-col xl:w-[340px] xl:shrink-0" padding="none">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">Reservations</p>
              <p className="mt-0.5 text-xs text-neutral-400">
                {bookings.length} total · {counts.Pending} pending
              </p>
            </div>
          </div>

          {/* Status tabs */}
          <div className="mt-3 flex gap-1.5">
            {(["all", "Pending", "Confirmed", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#22c51f] text-white"
                    : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {tab === "all" ? `All ${counts.all}` : `${tab} ${counts[tab]}`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="search"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200/80 bg-neutral-50/50 pl-9 pr-3 text-sm font-medium outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[#22c555]"
            />
          </div>
        </div>

        {/* Booking list */}
        <ul className="max-h-[420px] flex-1 space-y-2 overflow-y-auto p-4 xl:max-h-none">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-neutral-300" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-400">
              {bookings.length === 0 ? "No reservations yet" : "No matches found"}
            </div>
          ) : (
            filtered.map((booking) => {
              const badge = STATUS_BADGE[booking.status] || STATUS_BADGE.Pending;
              return (
                <li
                  key={booking.id}
                  className="rounded-lg border border-neutral-100 p-3 transition hover:border-green-200/60 hover:bg-green-50/40 dark:border-neutral-800 dark:hover:border-green-800 dark:hover:bg-green-950/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-800 dark:text-white">
                        {booking.customer_name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {booking.date}
                        </span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {booking.party_size}
                        </span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Quick actions */}
                  {booking.status === "Pending" && (
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => handleStatusChange(booking.id, "Confirmed")}
                        className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400"
                      >
                        <Check size={10} className="mr-0.5 inline" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id, "Cancelled")}
                        className="rounded-md bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {booking.status === "Confirmed" && (
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => handleStatusChange(booking.id, "Completed")}
                        className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>

        <div className="border-t border-neutral-100 p-4 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22c51f] text-sm font-bold text-white shadow-sm transition hover:bg-[#1bad1a]"
          >
            <Plus size={18} />
            Add reservation
          </button>
        </div>
      </DashboardCard>

      {/* Add Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">New Reservation</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                  {error}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Customer Name *</span>
                  <input
                    required
                    value={form.customer_name}
                    onChange={(e) => setForm((p) => ({ ...p, customer_name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Email</span>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm((p) => ({ ...p, customer_email: e.target.value }))}
                    placeholder="john@email.com"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Date *</span>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Time *</span>
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Party Size *</span>
                  <input
                    required
                    type="number"
                    min="1"
                    max="50"
                    value={form.party_size}
                    onChange={(e) => setForm((p) => ({ ...p, party_size: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Table</span>
                  <select
                    value={form.table_id}
                    onChange={(e) => setForm((p) => ({ ...p, table_id: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  >
                    <option value="">Auto-assign</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        Table #{t.number} ({t.capacity} seats)
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Notes</span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    rows={2}
                    placeholder="Special requests..."
                    className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
