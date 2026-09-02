"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Loader2, X, Upload } from "lucide-react";
import { DashboardPageHeader } from "../DashboardPageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { menuApi, uploadApi } from "@/lib/api";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  available?: boolean;
  meal_times?: string[];
  price_range?: string;
}

const CATEGORIES = [
  "Pizza", "Chicken", "Pasta", "Salad", "Desserts", "Burger", "Seafood", "Drinks", "Other",
];
const MEAL_TIMES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const PRICE_RANGES = ["$5 - $10", "$10 - $20", "$20 - $30", "Above $30"];

const EMPTY_FORM = {
  name: "",
  category: "Other",
  price: "",
  description: "",
  image: "",
  available: true,
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-neutral-100 py-4 last:border-0 last:pb-0 first:pt-0 dark:border-neutral-800">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
        {title}
      </h3>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  );
}

export function MenuPageClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMealTimes, setSelectedMealTimes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await menuApi.list(undefined, {
        search: query || undefined,
        category: selectedCategory || undefined,
        mealTime: selectedMealTimes.length === 1 ? selectedMealTimes[0] : undefined,
        priceRange: selectedPriceRanges.length === 1 ? selectedPriceRanges[0] : undefined,
        available: availableOnly || undefined,
      });
      setItems(data as unknown as MenuItem[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, selectedMealTimes, selectedPriceRanges, availableOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleMealTime = (t: string) =>
    setSelectedMealTimes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const togglePriceRange = (r: string) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesMealTime =
        selectedMealTimes.length === 0 ||
        (item.meal_times ?? []).some((t) => selectedMealTimes.includes(t));
      const matchesPriceRange =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.includes(item.price_range ?? "");
      return matchesQuery && matchesCategory && matchesMealTime && matchesPriceRange;
    });
  }, [items, query, selectedCategory, selectedMealTimes, selectedPriceRanges]);

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
      const { url } = await uploadApi.upload(file, "dinely/menu");
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

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await menuApi.delete(deleteTarget);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget));
    } catch {
      // ignore
    }
    setDeleteTarget(null);
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

      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        {/* Sidebar filters */}
        <div className="w-full shrink-0 rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:w-[220px]">
          <p className="mb-1 text-sm font-bold text-neutral-900 dark:text-white">Filters</p>
          <p className="mb-2 text-xs font-medium text-neutral-400">Refine your menu view</p>

          {/* Category */}
          <FilterSection title="Category">
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <input
                  type="radio"
                  checked={!selectedCategory}
                  onChange={() => setSelectedCategory("")}
                  className="h-4 w-4 border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
                />
                All
              </label>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  <input
                    type="radio"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className="h-4 w-4 border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
                  />
                  {cat}
                </label>
              </li>
            ))}
          </FilterSection>

          {/* Meal times */}
          <FilterSection title="Meal times">
            {MEAL_TIMES.map((t) => (
              <li key={t}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  <input
                    type="checkbox"
                    checked={selectedMealTimes.includes(t)}
                    onChange={() => toggleMealTime(t)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
                  />
                  {t}
                </label>
              </li>
            ))}
          </FilterSection>

          {/* Price ranges */}
          <FilterSection title="Price">
            {PRICE_RANGES.map((r) => (
              <li key={r}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(r)}
                    onChange={() => togglePriceRange(r)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
                  />
                  {r}
                </label>
              </li>
            ))}
          </FilterSection>

          {/* Available only */}
          <FilterSection title="Availability">
            <li>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={() => setAvailableOnly(!availableOnly)}
                  className="h-4 w-4 rounded border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
                />
                Available only
              </label>
            </li>
          </FilterSection>

          {/* Clear all */}
          {(selectedCategory || selectedMealTimes.length > 0 || selectedPriceRanges.length > 0 || availableOnly) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedMealTimes([]);
                setSelectedPriceRanges([]);
                setAvailableOnly(false);
              }}
              className="mt-3 w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Search + category pills + menu grid */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Search + category pills */}
          <div className="flex flex-col gap-3">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Search menu items..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-2 focus:ring-green-100/80 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[#22c555]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  !selectedCategory
                    ? "bg-[#22c51f] text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
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
                      : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-56 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-base font-semibold text-neutral-500 dark:text-neutral-400">
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
                    className="group overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-green-200/60 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
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
                          className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item.id)}
                          className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-red-500 shadow-sm hover:bg-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-neutral-800 dark:text-white">{item.name}</h3>
                          <p className="mt-0.5 text-sm font-semibold text-[#22c51f]">
                            {item.category}
                          </p>
                        </div>
                        <p className="text-base font-bold text-amber-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {editing ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
              <button onClick={closeModal} className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
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
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Margherita Pizza"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Category *</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Price ($) *</span>
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
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Image</span>
                  <label className="flex h-[42px] w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-500 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                    {form.image ? (
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.image} alt="Preview" className="h-8 w-8 rounded-md object-cover" />
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          {uploading ? "Uploading…" : "Image uploaded ✓"}
                        </span>
                      </div>
                    ) : (
                      <>
                        {uploading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        {uploading ? "Uploading…" : "Upload image"}
                      </>
                    )}
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">Description</span>
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
                <button type="button" onClick={closeModal} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? "Save changes" : "Add item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
