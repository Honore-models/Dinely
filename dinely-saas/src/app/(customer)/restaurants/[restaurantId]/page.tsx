"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Globe, MapPin, Phone, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { RestaurantDetailHeader } from "@/components/customer/RestaurantDetailHeader";
import { restaurantsApi, menuApi } from "@/lib/api";

interface Restaurant {
  _id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
  openingHours?: string;
  rating?: number;
  reviewCount?: number;
}

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
}

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

const COVER_FALLBACK =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, mRes] = await Promise.all([
          restaurantsApi.get(id),
          menuApi.list(id),
        ]);
        setRestaurant(rRes.data as unknown as Restaurant);
        setMenuItems(mRes.data as unknown as MenuItem[]);
      } catch {
        // restaurant not found – use empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <div className="h-72 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="mt-6 h-8 w-64 animate-pulse rounded bg-neutral-100" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center lg:px-8">
        <p className="text-lg font-semibold text-neutral-500">Restaurant not found</p>
        <Link href="/home" className="mt-4 inline-block text-sm font-semibold text-[#22c51f] hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const coverImage =
    restaurant.logo && restaurant.logo.startsWith("http")
      ? restaurant.logo
      : COVER_FALLBACK;

  const popular = menuItems.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Header / cover */}
      <RestaurantDetailHeader
        name={restaurant.name}
        type={restaurant.type}
        rating={restaurant.rating ?? 0}
        reviewCount={
          restaurant.reviewCount
            ? restaurant.reviewCount > 999
              ? `${(restaurant.reviewCount / 1000).toFixed(1)}K`
              : String(restaurant.reviewCount)
            : "0"
        }
        coverImage={coverImage}
        onOrderNow={() => router.push(`/restaurants/${id}/menu`)}
        onBookTable={() => router.push(`/restaurants/${id}/info`)}
      />

      {/* Tab nav */}
      <nav className="mt-6 flex gap-6 overflow-x-auto border-b border-neutral-200 pb-0">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`shrink-0 pb-3 text-sm font-semibold transition ${
                isActive
                  ? "border-b-2 border-[#22c51f] text-[#22c51f]"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
              {tab.href === "reviews" && restaurant.reviewCount
                ? ` (${restaurant.reviewCount > 999 ? `${(restaurant.reviewCount / 1000).toFixed(1)}K` : restaurant.reviewCount})`
                : ""}
            </Link>
          );
        })}
      </nav>

      {/* Overview content */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* About + Info */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {restaurant.description ||
              "This restaurant offers a unique dining experience with carefully crafted dishes."}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <MapPin size={16} className="shrink-0 text-[#22c51f]" />
              <span className="font-semibold">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Timer size={16} className="shrink-0 text-[#22c51f]" />
              <span className="font-bold text-[#22c51f]">Active</span>
              {restaurant.openingHours && (
                <span className="text-neutral-500">• {restaurant.openingHours}</span>
              )}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <Phone size={16} className="shrink-0 text-neutral-400" />
              <span>{restaurant.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <Globe size={16} className="shrink-0 text-neutral-400" />
              <span className="text-[#22c51f]">{restaurant.email}</span>
            </div>
          </div>
        </div>

        {/* Popular Dishes */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Popular Dishes</h2>
          {popular.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">No menu items yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {popular.map((dish) => (
                <div key={dish._id} className="flex items-center gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {dish.image ? (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900">{dish.name}</p>
                    {dish.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                        {dish.description}
                      </p>
                    )}
                    <p className="mt-1.5 text-sm font-bold text-[#22c51f]">
                      ${dish.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href={`/restaurants/${id}/menu`}
            className="mt-4 block w-full rounded-xl border border-[#22c51f] py-2.5 text-center text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
