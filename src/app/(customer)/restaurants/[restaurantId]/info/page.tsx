"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, Globe, MapPin, Phone, Timer, Loader2, CalendarCheck, Users, CheckCircle2 } from "lucide-react";
import { restaurantsApi, bookingsApi } from "@/lib/api";

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
  const router = useRouter();
  const id = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("19:00");
  const [partySize, setPartySize] = useState("2");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00",
  ];

  const handleBooking = async () => {
    if (!bookingDate) {
      setBookingError("Please select a date");
      return;
    }
    setBookingLoading(true);
    setBookingError(null);
    try {
      await bookingsApi.create({
        restaurantId: id,
        date: bookingDate,
        time: bookingTime,
        partySize: parseInt(partySize),
        notes: bookingNotes || undefined,
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

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

          {/* Booking Form */}
          <div className="mt-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
              <CalendarCheck size={20} className="text-[#22c51f]" />
              Book a Table
            </h2>

            {bookingSuccess ? (
              <div className="mt-5 flex flex-col items-center py-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100">
                  <CheckCircle2 size={28} className="text-[#22c51f]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-neutral-900">Booking Confirmed!</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Your table has been reserved for {bookingDate} at {bookingTime}.
                </p>
                <p className="mt-1 text-xs text-neutral-400">Party of {partySize}</p>
                <div className="mt-5 flex gap-3">
                  <Link
                    href="/orders"
                    className="rounded-xl border border-[#22c51f] px-5 py-2.5 text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
                  >
                    View My Bookings
                  </Link>
                  <button
                    onClick={() => { setBookingSuccess(false); setBookingDate(""); setBookingTime("19:00"); setPartySize("2"); setBookingNotes(""); }}
                    className="rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="text-sm text-neutral-500">Reserve your spot at {restaurant.name}.</p>

n                {bookingError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {bookingError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">Date *</span>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">Time *</span>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">Party Size *</span>
                    <div className="relative">
                      <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <select
                        value={partySize}
                        onChange={(e) => setPartySize(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
                        ))}
                      </select>
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">Special Requests</span>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Birthday, high chair"
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </label>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || !bookingDate}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c51f] py-3 text-sm font-bold text-white transition hover:bg-[#1bad1a] disabled:opacity-60"
                >
                  {bookingLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Booking...</>
                  ) : (
                    <><CalendarCheck size={16} /> Reserve Table</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
