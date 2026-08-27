"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { menuApi, restaurantsApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  image?: string;
}

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
];

export default function PhotosPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, rRes] = await Promise.all([
          menuApi.list(id),
          restaurantsApi.get(id),
        ]);
        const items = mRes.data as unknown as MenuItem[];
        const restaurant = rRes.data as Record<string, unknown>;

        // Collect all menu item images + restaurant logo
        const images: string[] = [];
        if (restaurant.logo && typeof restaurant.logo === "string" && restaurant.logo.startsWith("http")) {
          images.push(restaurant.logo);
        }
        items.forEach((item) => {
          if (item.image && item.image.startsWith("http")) {
            images.push(item.image);
          }
        });

        setPhotos(images.length > 0 ? images : FALLBACK_PHOTOS);
      } catch {
        setPhotos(FALLBACK_PHOTOS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "photos";
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
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-neutral-300" />
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-neutral-500">
              {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100"
                >
                  <Image
                    src={photo}
                    alt={`Restaurant photo ${idx + 1}`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
