"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loader2, Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { tablesApi } from "@/lib/api";

interface Table {
  id: string;
  number: number;
  capacity: number;
  location?: string;
  status: "available" | "occupied" | "reserved" | "inactive";
}

const STATUS_STYLES: Record<Table["status"], string> = {
  available: "bg-emerald-100 text-emerald-700",
  occupied:  "bg-blue-100 text-blue-700",
  reserved:  "bg-amber-100 text-amber-700",
  inactive:  "bg-neutral-100 text-neutral-500",
};
const STATUS_DOT: Record<Table["status"], string> = {
  available: "bg-emerald-500",
  occupied:  "bg-blue-500",
  reserved:  "bg-amber-500",
  inactive:  "bg-neutral-300",
};

const EMPTY = { number: "", capacity: "", location: "", status: "available" as Table["status"] };

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Table | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await tablesApi.list();
      setTables((res.data as unknown as Table[]).sort((a, b) => a.number - b.number));
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(null); setShowModal(true); };
  const openEdit = (t: Table) => {
    setEditing(t);
    setForm({ number: String(t.number), capacity: String(t.capacity), location: t.location ?? "", status: t.status });
    setError(null);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      number: parseInt(form.number),
      capacity: parseInt(form.capacity),
      location: form.location || undefined,
      status: form.status,
    };
    try {
      if (editing) {
        await tablesApi.update(editing.id, payload as Record<string, unknown>);
      } else {
        await tablesApi.create(payload);
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tablesApi.delete(deleteTarget);
      setTables((prev) => prev.filter((t) => t.id !== deleteTarget));
    } catch { /* ignore */ }
    setDeleteTarget(null);
  };

  const toggleStatus = async (table: Table) => {
    const next: Table["status"] = table.status === "available" ? "occupied" : "available";
    try {
      await tablesApi.update(table.id, { status: next });
      setTables((prev) => prev.map((t) => t.id === table.id ? { ...t, status: next } : t));
    } catch { /* ignore */ }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return tables;
    const q = search.toLowerCase();
    return tables.filter(
      (t) =>
        String(t.number).includes(q) ||
        (t.location && t.location.toLowerCase().includes(q)) ||
        t.status.toLowerCase().includes(q),
    );
  }, [tables, search]);

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  return (
    <>
      <DashboardPageHeader
        title="Tables"
        description="Manage table layout, capacity, and real-time status."
        action={
          <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[#22c51f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1bad1a]">
            <Plus size={15} /> Add Table
          </button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by number, location, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-[#22c51f] focus:outline-none focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[#22c555]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: "text-neutral-900" },
          { label: "Available", value: stats.available, color: "text-emerald-600" },
          { label: "Occupied", value: stats.occupied, color: "text-blue-600" },
          { label: "Reserved", value: stats.reserved, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className={`text-2xl font-bold ${color} dark:text-white`}>{value}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-base font-semibold text-neutral-500 dark:text-neutral-400">
            {search ? "No tables match your search" : "No tables yet"}
          </p>
          <button onClick={openAdd} className="mt-4 rounded-full bg-[#22c51f] px-6 py-2 text-sm font-bold text-white hover:bg-[#1bad1a]">
            Add your first table
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((table) => (
            <div key={table.id} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">Table #{table.number}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{table.capacity} seats{table.location ? ` · ${table.location}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(table)} className="grid h-7 w-7 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-[#22c51f] dark:hover:bg-neutral-800">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteTarget(table.id)} className="grid h-7 w-7 place-items-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[table.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[table.status]}`} />
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </span>
                {(table.status === "available" || table.status === "occupied") && (
                  <button
                    onClick={() => toggleStatus(table)}
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    {table.status === "available" ? "Mark Occupied" : "Mark Free"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Table"
        message="Are you sure you want to delete this table? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">{editing ? "Edit Table" : "Add Table"}</h2>
              <button onClick={closeModal} className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Table Number</span>
                  <input type="number" min="1" required value={form.number} onChange={set("number")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Capacity (seats)</span>
                  <input type="number" min="1" required value={form.capacity} onChange={set("capacity")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Location</span>
                  <input value={form.location} onChange={set("location")} placeholder="e.g. Main Hall, Terrace"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Status</span>
                  <select value={form.status} onChange={set("status")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]">
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? "Save" : "Add Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
