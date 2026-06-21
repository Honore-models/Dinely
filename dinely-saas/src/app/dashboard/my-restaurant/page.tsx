"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { useRestaurant } from "@/hooks/useRestaurant";
import { analyticsApi, menuApi } from "@/lib/api";
import {
  Camera, CheckCircle2, Clock, Globe, Loader2, Mail, MapPin, Pencil, Phone, Save, Star, X,
} from "lucide-react";
import Image from "next/image";
import { uploadApi } from "@/lib/api";

interface MenuItem { _id: string; name: string; price: number; orders: number; image?: string; }

const FALLBACK = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";

export default function MyRestaurantPage() {
  const { restaurant, loading, update } = useRestaurant();

  const [topItems, setTopItems] = useState<{ name: string; revenue: number; quantity: number }[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", address: "", phone: "", email: "", openingHours: "", description: "", logo: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Hydrate edit form when restaurant loads
  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name ?? "",
        type: restaurant.type ?? "",
        address: restaurant.address ?? "",
        phone: restaurant.phone ?? "",
        email: restaurant.email ?? "",
        openingHours: restaurant.openingHours ?? "",
        description: restaurant.description ?? "",
        logo: restaurant.logo ?? "",
      });
    }
  }, [restaurant]);

  useEffect(() => {
    analyticsApi.get("30d").then((data) => {
      setTopItems(data.topItems.slice(0, 3));
      setTotalRevenue(data.revenue.current);
      setTotalOrders(data.orders.current);
    }).catch(() => {});
  }, []);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const { url } = await uploadApi.upload(file);
      setForm((p) => ({ ...p, logo: url }));
    } catch { /* ignore */ } finally { setUploadingLogo(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(form);
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    );
  }
  if (!restaurant) {
    return (
      <div className="flex h-48 items-center justify-center text-neutral-400">
        No restaurant found. Complete onboarding first.
      </div>
    );
  }

  const coverImage = form.logo && form.logo.startsWith("http") ? form.logo : FALLBACK;

  return (
    <>
      <DashboardPageHeader
        title="My Restaurant"
        description="Manage your restaurant profile, hours, and branding."
        action={
          editMode ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditMode(false)} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
                <X size={15} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-[#22c51f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60">
                {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          ) : (
            <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
              <Pencil size={15} /> Edit Profile
            </button>
          )
        }
      />

      {saved && (
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-sm font-semibold text-[#22c51f]">
          Restaurant profile updated ✓
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left: Profile card */}
        <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
          {/* Cover image */}
          <div className="relative h-52 bg-neutral-200">
            <Image src={coverImage} alt={form.name} fill className="object-cover" priority sizes="100vw" />
            {editMode && (
              <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/80">
                <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} disabled={uploadingLogo} />
                {uploadingLogo ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                {uploadingLogo ? "Uploading…" : "Change Cover"}
              </label>
            )}
          </div>

          <div className="p-6">
            {editMode ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Restaurant Name", field: "name", placeholder: "The Golden Plate" },
                    { label: "Type / Cuisine", field: "type", placeholder: "Burgers & American" },
                    { label: "Address", field: "address", placeholder: "KN 5 Rd, Kigali, Rwanda" },
                    { label: "Phone", field: "phone", placeholder: "+250 245 253 342" },
                    { label: "Email", field: "email", placeholder: "contact@restaurant.com" },
                    { label: "Opening Hours", field: "openingHours", placeholder: "10:45 – 20:30" },
                  ].map(({ label, field, placeholder }) => (
                    <label key={field} className="block">
                      <span className="mb-1 block text-xs font-semibold text-neutral-600">{label}</span>
                      <input
                        value={(form as Record<string, string>)[field]}
                        onChange={set(field)}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                      />
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Description</span>
                  <textarea
                    value={form.description}
                    onChange={set("description")}
                    rows={3}
                    placeholder="Tell customers what makes your restaurant special…"
                    className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{restaurant.name}</h2>
                    <p className="text-sm text-neutral-500">{restaurant.type}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-neutral-900">
                        {(restaurant as unknown as Record<string, unknown>).rating as number ?? "—"}
                      </span>
                      <span className="text-sm text-neutral-400">
                        ({(restaurant as unknown as Record<string, unknown>).reviewCount as number ?? 0} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="rounded-xl bg-green-50 px-4 py-3">
                      <p className="text-lg font-bold text-[#22c51f]">${totalRevenue.toFixed(0)}</p>
                      <p className="text-xs font-semibold text-neutral-500">Revenue (30d)</p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 px-4 py-3">
                      <p className="text-lg font-bold text-neutral-900">{totalOrders}</p>
                      <p className="text-xs font-semibold text-neutral-500">Orders (30d)</p>
                    </div>
                  </div>
                </div>

                {restaurant.description && (
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">{restaurant.description}</p>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <MapPin size={15} className="shrink-0 text-[#22c51f]" />
                    {restaurant.address}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <Clock size={15} className="shrink-0 text-neutral-400" />
                    {restaurant.openingHours}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <Phone size={15} className="shrink-0 text-neutral-400" />
                    {restaurant.phone}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <Mail size={15} className="shrink-0 text-neutral-400" />
                    {restaurant.email}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Top selling items */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-neutral-900">Top Selling Items</h3>
          {topItems.length === 0 ? (
            <p className="text-sm text-neutral-400">No order data yet.</p>
          ) : (
            <div className="space-y-4">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-green-50 text-xs font-bold text-[#22c51f]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.quantity} orders · ${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
            <h3 className="text-sm font-bold text-neutral-900">Subscription</h3>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-700">{restaurant.plan}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${restaurant.subscriptionStatus === "active" ? "bg-green-100 text-[#22c51f]" : "bg-amber-100 text-amber-600"}`}>
                  {restaurant.subscriptionStatus}
                </span>
              </div>
              <p className="mt-0.5 text-xs capitalize text-neutral-500">{restaurant.billingCycle} billing</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
