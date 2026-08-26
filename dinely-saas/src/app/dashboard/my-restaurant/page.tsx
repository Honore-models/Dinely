"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { useRestaurant } from "@/hooks/useRestaurant";
import { analyticsApi, menuApi } from "@/lib/api";
import {
  Camera,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Star,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { uploadApi } from "@/lib/api";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  orders: number;
  image?: string;
}

const FALLBACK =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";

export default function MyRestaurantPage() {
  const { restaurant, loading, update } = useRestaurant();

  const [topItems, setTopItems] = useState<
    { name: string; revenue: number; quantity: number }[]
  >([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    openingHours: "",
    description: "",
    logo: "",
    website: "",
    capacity: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name ?? "",
        type: restaurant.type ?? "",
        address: restaurant.address ?? "",
        phone: restaurant.phone ?? "",
        email: restaurant.email ?? "",
        openingHours: restaurant.opening_hours ?? "",
        description: restaurant.description ?? "",
        logo: restaurant.logo ?? "",
        website: restaurant.website ?? "",
        capacity: restaurant.capacity ?? "",
      });
    }
  }, [restaurant]);

  useEffect(() => {
    analyticsApi
      .get("30d")
      .then((data) => {
        setTopItems(data.topItems.slice(0, 3));
        setTotalRevenue(data.revenue.current);
        setTotalOrders(data.orders.current);
      })
      .catch(() => {});
  }, []);

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const { url } = await uploadApi.upload(file);
      setForm((p) => ({ ...p, logo: url }));
    } catch {
      /* ignore */
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(form);
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-20 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-green-50 dark:bg-green-950">
          <Loader2 size={24} className="text-[#22c555]" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-neutral-800 dark:text-white">
          Setting up your restaurant...
        </h2>
        <p className="mt-1 max-w-xs text-sm text-neutral-400 dark:text-neutral-500">
          If this persists, try logging out and back in, or complete the onboarding process.
        </p>
        <a
          href="/onboarding/step-2"
          className="mt-5 rounded-xl bg-gradient-to-r from-[#22c555] to-[#1bad1a] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:shadow-lg hover:shadow-green-300 active:scale-[0.97]"
        >
          Complete Setup
        </a>
      </div>
    );
  }

  const coverImage =
    form.logo && form.logo.startsWith("http") ? form.logo : FALLBACK;

  return (
    <>
      <DashboardPageHeader
        title="My Restaurant"
        description="Manage your restaurant profile, hours, and branding."
        action={
          editMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <X size={15} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-[#22c51f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : saved ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Save size={15} />
                )}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <Pencil size={15} /> Edit Profile
            </button>
          )
        }
      />

      {saved && (
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-sm font-semibold text-[#22c51f] dark:border-green-900 dark:bg-green-950 dark:text-green-400">
          Restaurant profile updated ✓
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left: Profile card */}
        <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
          {/* Cover image */}
          <div className="relative h-52 bg-neutral-200 dark:bg-neutral-800">
            <Image
              src={coverImage}
              alt={form.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {editMode && (
              <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/80">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                {uploadingLogo ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
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
                    { label: "Website", field: "website", placeholder: "https://yourrestaurant.com" },
                    { label: "Seating Capacity", field: "capacity", placeholder: "e.g. 50 seats" },
                  ].map(({ label, field, placeholder }) => (
                    <label key={field} className="block">
                      <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        {label}
                      </span>
                      <input
                        value={(form as Record<string, string>)[field]}
                        onChange={set(field)}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-900"
                      />
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={set("description")}
                    rows={3}
                    placeholder="Tell customers what makes your restaurant special…"
                    className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-green-900"
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {restaurant.name}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {restaurant.type}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {((restaurant as unknown as Record<string, unknown>).rating as number) ?? "-"}
                      </span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">
                        ({((restaurant as unknown as Record<string, unknown>).review_count as number) ?? 0} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="rounded-xl bg-green-50 px-4 py-3 dark:bg-green-950/50">
                      <p className="text-lg font-bold text-[#22c51f] dark:text-green-400">
                        ${totalRevenue.toFixed(0)}
                      </p>
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        Revenue (30d)
                      </p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
                      <p className="text-lg font-bold text-neutral-900 dark:text-white">
                        {totalOrders}
                      </p>
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        Orders (30d)
                      </p>
                    </div>
                  </div>
                </div>

                {restaurant.description && (
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {restaurant.description}
                  </p>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                    <MapPin size={15} className="shrink-0 text-[#22c51f]" />
                    {restaurant.address}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                    <Clock size={15} className="shrink-0 text-neutral-400" />
                    {restaurant.opening_hours}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                    <Phone size={15} className="shrink-0 text-neutral-400" />
                    {restaurant.phone}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                    <Mail size={15} className="shrink-0 text-neutral-400" />
                    {restaurant.email}
                  </div>
                  {restaurant.website && (
                    <div className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                      <Globe size={15} className="shrink-0 text-neutral-400" />
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-[#22c555] hover:underline">
                        {restaurant.website}
                      </a>
                    </div>
                  )}
                  {restaurant.capacity && (
                    <div className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                      <Users size={15} className="shrink-0 text-neutral-400" />
                      {restaurant.capacity}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Top selling items */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-4 text-base font-bold text-neutral-900 dark:text-white">
            Top Selling Items
          </h3>
          {topItems.length === 0 ? (
            <p className="text-sm text-neutral-400 dark:text-neutral-500">No order data yet.</p>
          ) : (
            <div className="space-y-4">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-green-50 text-xs font-bold text-[#22c51f] dark:bg-green-950 dark:text-green-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.quantity} orders · ${item.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Subscription</h3>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  {restaurant.plan}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    restaurant.subscription_status === "active"
                      ? "bg-green-100 text-[#22c51f] dark:bg-green-950 dark:text-green-400"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                  }`}
                >
                  {restaurant.subscription_status}
                </span>
              </div>
              <p className="mt-0.5 text-xs capitalize text-neutral-500 dark:text-neutral-400">
                {restaurant.billing_cycle} billing
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
