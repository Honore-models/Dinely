"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, Globe, MapPin, Phone, Timer, Loader2 } from "lucide-react";
import { restaurantsApi } from "@/lib/api";

interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  opening_hours?: string;
  description?: string;
}

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function InfoPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await restaurantsApi.get(id);
        setRestaurant(data as unknown as Restaurant);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Generate opening hours from the restaurant's opening_hours string
  const openingHours = [
    { day: "Monday", hours: restaurant?.opening_hours || "10:00 – 22:00" },
    { day: "Tuesday", hours: restaurant?.opening_hours || "10:00 – 22:00" },
    { day: "Wednesday", hours: restaurant?.opening_hours || "10:00 – 22:00" },
    { day: "Thursday", hours: restaurant?.opening_hours || "10:00 – 22:00" },
    { day: "Friday", hours: restaurant?.opening_hours || "10:00 – 23:00" },
    { day: "Saturday", hours: restaurant?.opening_hours || "11:00 – 23:00" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "info";
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
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-neutral-300" />
        </div>
      ) : !restaurant ? (
        <div className="py-16 text-center">
          <p className="text-base font-semibold text-neutral-500">
            Restaurant not found
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900">
              Contact & Location
            </h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#22c51f]"
                />
                <div>
                  <p className="font-semibold text-neutral-900">
                    {restaurant.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="shrink-0 text-neutral-400" />
                <a
                  href={`tel:${restaurant.phone}`}
                  className="text-neutral-700 hover:text-[#22c51f]"
                >
                  {restaurant.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe size={16} className="shrink-0 text-neutral-400" />
                <span className="text-[#22c51f]">{restaurant.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Timer size={16} className="shrink-0 text-[#22c51f]" />
                <span className="font-semibold text-[#22c51f]">
                  Currently Open
                </span>
                {restaurant.opening_hours && (
                  <span className="text-neutral-500">
                    • {restaurant.opening_hours}
                  </span>
                )}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-5 overflow-hidden rounded-xl bg-neutral-100" style={{ height: 180 }}>
              <div className="flex h-full items-center justify-center text-neutral-400">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto text-neutral-300" />
                  <p className="mt-2 text-sm">Map view</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening hours */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900">
              Opening Hours
            </h2>
            <div className="mt-5 space-y-2.5">
              {openingHours.map(({ day, hours }) => {
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      isToday ? "bg-green-50" : ""
                    }`}
                  >
                    <span
                      className={`font-semibold ${
                        isToday ? "text-[#22c51f]" : "text-neutral-700"
                      }`}
                    >
                      {day}
                      {isToday && (
                        <span className="ml-2 rounded-full bg-[#22c51f] px-2 py-0.5 text-[10px] text-white">
                          Today
                        </span>
                      )}
                    </span>
                    <span
                      className={
                        hours === "Closed"
                          ? "font-semibold text-red-500"
                          : isToday
                            ? "font-bold text-[#22c51f]"
                            : "text-neutral-500"
                      }
                    >
                      {hours}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* About */}
            {restaurant.description && (
              <div className="mt-6 border-t border-neutral-100 pt-5">
                <h3 className="text-sm font-bold text-neutral-900">About</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {restaurant.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
