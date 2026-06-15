"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, Globe, MapPin, Phone, Timer } from "lucide-react";

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews (2.4K)", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

const openingHours = [
  { day: "Monday", hours: "10:45 – 20:30" },
  { day: "Tuesday", hours: "10:45 – 20:30" },
  { day: "Wednesday", hours: "10:45 – 20:30" },
  { day: "Thursday", hours: "10:45 – 20:30" },
  { day: "Friday", hours: "10:45 – 22:00" },
  { day: "Saturday", hours: "11:00 – 22:00" },
  { day: "Sunday", hours: "Closed" },
];

export default function InfoPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 border-b border-neutral-200">
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

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Contact info */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">Contact & Location</h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#22c51f]" />
              <div>
                <p className="font-semibold text-neutral-900">KN 5 Rd, Kigali, Rwanda</p>
                <p className="mt-0.5 text-neutral-500">Kigali City, Rwanda</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="shrink-0 text-neutral-400" />
              <a href="tel:+250245253342" className="text-neutral-700 hover:text-[#22c51f]">
                +250 245 253 342
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe size={16} className="shrink-0 text-neutral-400" />
              <a
                href="https://www.goldenplate.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22c51f] underline underline-offset-2"
              >
                www.goldenplate.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Timer size={16} className="shrink-0 text-[#22c51f]" />
              <span className="font-semibold text-[#22c51f]">Currently Open</span>
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
          <h2 className="text-lg font-bold text-neutral-900">Opening Hours</h2>
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
        </div>
      </div>
    </div>
  );
}
