"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  ClipboardList,
  Loader2,
  Mail,
  Phone,
  Star,
  Utensils,
} from "lucide-react";

interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  bookingCount: number;
  reviewCount: number;
  totalSpent: number;
  avgRating: number | null;
  lastActivity: string;
}

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  type: string;
  status: string;
  total: number;
  created_at: string;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  party_size: number;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Active: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  Cancelled: "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400",
  Confirmed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  "No-show": "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "bookings" | "reviews">("orders");

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        // Fetch client info from clients list
        const clientsRes = await fetch("/api/clients");
        const clientsData = await clientsRes.json();
        const found = (clientsData.data || []).find((c: any) => c.id === clientId);
        setClient(found || null);

        // Fetch orders for this client
        const ordersRes = await fetch("/api/orders?limit=50");
        const ordersData = await ordersRes.json();
        setOrders(
          (ordersData.data || []).filter((o: any) => o.customer_id === clientId),
        );

        // Fetch bookings
        const bookingsRes = await fetch("/api/bookings");
        const bookingsData = await bookingsRes.json();
        setBookings(
          (bookingsData.data || []).filter((b: any) => b.customer_id === clientId),
        );

        // Fetch reviews
        // Reviews are per-restaurant, so we get all and filter
        const reviewsRes = await fetch(`/api/reviews?restaurantId=${found?.id || ""}&limit=100`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(
            (reviewsData.data || []).filter((r: any) => r.customer_id === clientId),
          );
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-semibold text-neutral-500">
          Client not found
        </p>
        <Link
          href="/dashboard/clients"
          className="mt-3 text-sm font-bold text-[#22c555] hover:underline"
        >
          Back to Clients
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: "orders" as const, label: "Orders", count: orders.length, icon: ClipboardList },
    { key: "bookings" as const, label: "Bookings", count: bookings.length, icon: CalendarCheck },
    { key: "reviews" as const, label: "Reviews", count: reviews.length, icon: Star },
  ];

  return (
    <>
      <div className="mb-4">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Clients
        </Link>
      </div>

      <DashboardPageHeader
        title={client.name}
        description={client.email}
      />

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <ClipboardList size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{client.orderCount}</p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Orders</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <CalendarCheck size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{client.bookingCount}</p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Bookings</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Utensils size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                ${client.totalSpent.toFixed(0)}
              </p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Spent</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Star size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {client.avgRating ? `${client.avgRating}` : "-"}
              </p>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Info ────────────────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-3 text-sm font-bold text-neutral-900 dark:text-white">Contact Information</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Mail size={14} className="text-neutral-400 dark:text-neutral-500" />
            {client.email || "No email"}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Phone size={14} className="text-neutral-400 dark:text-neutral-500" />
            {client.phone || "No phone"}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Clock size={14} className="text-neutral-400 dark:text-neutral-500" />
            Last active: {client.lastActivity ? timeAgo(client.lastActivity) : "Never"}
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex gap-1 rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-[#22c555] text-white shadow-sm"
                  : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <p className="py-12 text-center text-sm text-neutral-400">
                No orders from this customer yet.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <ClipboardList size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                          {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {order.type} · {timeAgo(order.created_at)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-neutral-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <p className="py-12 text-center text-sm text-neutral-400">
                No bookings from this customer yet.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                      <CalendarCheck size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {booking.date} at {booking.time}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[booking.status] || ""}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Party of {booking.party_size}
                        {booking.notes ? ` · ${booking.notes}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {reviews.length === 0 ? (
              <p className="py-12 text-center text-sm text-neutral-400">
                No reviews from this customer yet.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {reviews.map((review) => (
                  <div key={review.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-200 dark:text-neutral-700"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400">
                        {timeAgo(review.created_at)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
