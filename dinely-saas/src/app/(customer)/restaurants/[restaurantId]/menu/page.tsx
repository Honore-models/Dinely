"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DishRow } from "@/components/customer/DishRow";
import { menuApi, restaurantsApi } from "@/lib/api";

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  available: boolean;
}

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function MenuPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, rRes] = await Promise.all([
          menuApi.list(id),
          restaurantsApi.get(id),
        ]);
        setItems(
          (mRes.data as unknown as MenuItem[]).filter((i) => i.available !== false),
        );
        setRestaurantName((rRes.data as Record<string, unknown>).name as string);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "menu";
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

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-base font-semibold text-neutral-500">
            No menu items available yet.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">{category}</h2>
              <div className="space-y-3">
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <DishRow
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      image={item.image}
                      restaurantId={id}
                      restaurantName={restaurantName}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
