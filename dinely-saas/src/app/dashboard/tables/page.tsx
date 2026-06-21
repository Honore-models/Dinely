"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { tablesApi } from "@/lib/api";

interface Table {
  _id: string;
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
        await tablesApi.update(editing._id, payload as Record<string, unknown>);
      } else {
        await tablesApi.create(payload);
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this table?")) return;
    try {
      await tablesApi.delete(id);
      setTables((prev) => prev.filter((t) => t._id !== id));
    } catch { /* ignore */ }
  };

  const toggleStatus = async (table: Table) => {
    const next: Table["status"] = table.status === "available" ? "occupied" : "available";
    try {
      await tablesApi.update(table._id, { status: next });
      setTables((prev) => prev.map((t) => t._id === table._id ? { ...t, status: next } : t));
    } catch { /* ignore */ }
  };

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

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: "text-neutral-900" },
          { label: "Available", value: stats.available, color: "text-emerald-600" },
          { label: "Occupied", value: stats.occupied, color: "text-blue-600" },
          { label: "Reserved", value: stats.reserved, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center">
          <p className="text-base font-semibold text-neutral-500">No tables yet</p>
          <button onClick={openAdd} className="mt-4 rounded-full bg-[#22c51f] px-6 py-2 text-sm font-bold text-white hover:bg-[#1bad1a]">
            Add your first table
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <div key={table._id} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-neutral-900">Table #{table.number}</p>
                  <p className="text-xs text-neutral-500">{table.capacity} seats{table.location ? ` · ${table.location}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(table)} className="grid h-7 w-7 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-[#22c51f]">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(table._id)} className="grid h-7 w-7 place-items-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500">
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
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    {table.status === "available" ? "Mark Occupied" : "Mark Free"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">{editing ? "Edit Table" : "Add Table"}</h2>
              <button onClick={closeModal} className="rounded-full p-1 hover:bg-neutral-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Table Number</span>
                  <input type="number" min="1" required value={form.number} onChange={set("number")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Capacity (seats)</span>
                  <input type="number" min="1" required value={form.capacity} onChange={set("capacity")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Location</span>
                  <input value={form.location} onChange={set("location")} placeholder="e.g. Main Hall, Terrace"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Status</span>
                  <select value={form.status} onChange={set("status")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f]">
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editing ? "Save" : "Add Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
