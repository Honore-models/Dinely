"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Loader2, X, Upload } from "lucide-react";
import { DashboardPageHeader } from "../DashboardPageHeader";
import { menuApi, uploadApi } from "@/lib/api";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  available?: boolean;
}

const CATEGORIES = [
  "Pizza", "Chicken", "Pasta", "Salad", "Desserts", "Burger", "Seafood", "Drinks", "Other",
];

const EMPTY_FORM = {
  name: "",
  category: "Other",
  price: "",
  description: "",
  image: "",
  available: true,
};

export function MenuPageClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await menuApi.list();
      setItems(data as unknown as MenuItem[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, selectedCategory]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description || "",
      image: item.image || "",
      available: item.available ?? true,
    });
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.upload(file);
      setForm((p) => ({ ...p, image: url }));
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        description: form.description,
        image: form.image,
        available: form.available,
      };
      if (editing) {
        await menuApi.update(editing.id, payload);
      } else {
        await menuApi.create(payload);
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await menuApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // ignore
    }
  };

  const categories = [...new Set(items.map((i) => i.category))].sort();

  return (
    <>
      <DashboardPageHeader
        title="Menu"
        description="Browse, filter, and manage your restaurant menu items."
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#22c51f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1bad1a]"
          >
            <Plus size={15} /> Add Item
          </button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="search"
            placeholder="Search menu items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-2 focus:ring-green-100/80"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              !selectedCategory
                ? "bg-[#22c51f] text-white"
                : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#22c51f] text-white"
                  : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center">
          <p className="text-base font-semibold text-neutral-500">
            {items.length === 0 ? "No menu items yet" : "No items match your search"}
          </p>
          {items.length === 0 && (
            <button
              onClick={openAdd}
              className="mt-4 rounded-full bg-[#22c51f] px-6 py-2 text-sm font-bold text-white hover:bg-[#1bad1a]"
            >
              Add your first item
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-green-200/60 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-300">
                    No image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-red-500 shadow-sm hover:bg-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-neutral-800">{item.name}</h3>
                    <p className="mt-0.5 text-sm font-semibold text-[#22c51f]">
                      {item.category}
                    </p>
                  </div>
                  <p className="text-base font-bold text-amber-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-neutral-500">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">
                {editing ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
              <button onClick={closeModal} className="rounded-full p-1 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              {error && (
                <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Margherita Pizza"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Category *</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Price ($) *</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f]"
                  />
                </label>
                <div className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Image</span>
                  <label className="flex h-[42px] w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-500 hover:bg-neutral-100">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {uploading ? "Uploading..." : form.image ? "Image selected" : "Upload image"}
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">Description</span>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      placeholder="Describe this item..."
                      className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editing ? "Save changes" : "Add item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
