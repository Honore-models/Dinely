"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { menuApi } from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  available?: boolean;
}

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await menuApi.get(itemId);
        setItem(data as unknown as MenuItem);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleToggleAvailability = async () => {
    if (!item) return;
    setToggling(true);
    try {
      await menuApi.update(item.id, { available: !item.available });
      setItem((prev) => (prev ? { ...prev, available: !prev.available } : prev));
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!item) return;
    try {
      await menuApi.delete(item.id);
      router.push("/dashboard/menu");
    } catch {
      // ignore
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-semibold text-neutral-500">
          {error || "Item not found"}
        </p>
        <Link
          href="/dashboard/menu"
          className="mt-4 text-sm font-bold text-[#22c51f] hover:underline"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/menu"
          className="flex items-center gap-2 text-[#22c51f] font-bold text-lg hover:underline transition"
        >
          <ArrowLeft size={20} />
          Menu Details
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          >
            {toggling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : item.available ? (
              <ToggleRight size={16} className="text-[#22c51f]" />
            ) : (
              <ToggleLeft size={16} className="text-neutral-400" />
            )}
            {item.available ? "Available" : "Unavailable"}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
          {item.image && (
            <div className="relative aspect-[21/9] bg-neutral-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {item.name}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-[#22c51f]/10 px-2.5 py-0.5 text-xs font-bold text-[#22c51f]">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      item.available !== false
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {item.available !== false ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-500">
                ${item.price.toFixed(2)}
              </p>
            </div>

            {item.description && (
              <div className="mt-6">
                <h2 className="text-base font-bold text-neutral-800">
                  Description
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900">Item Details</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <span className="text-sm text-neutral-500">Price</span>
                <span className="text-sm font-bold text-neutral-900">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <span className="text-sm text-neutral-500">Category</span>
                <span className="text-sm font-bold text-neutral-900">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <span className="text-sm text-neutral-500">Status</span>
                <span
                  className={`text-sm font-bold ${
                    item.available !== false ? "text-[#22c51f]" : "text-neutral-400"
                  }`}
                >
                  {item.available !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <Link
                href="/dashboard/menu"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                <ArrowLeft size={14} />
                Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
