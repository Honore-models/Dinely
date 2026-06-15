"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const photos = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=600&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
];

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews (2.4K)", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function PhotosPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 border-b border-neutral-200">
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
              className={`relative pb-3 text-sm font-semibold transition ${
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
        <p className="mb-4 text-sm text-neutral-500">{photos.length} photos</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
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
      </div>
    </div>
  );
}
