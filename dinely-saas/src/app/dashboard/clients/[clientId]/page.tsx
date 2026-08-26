"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clientsApi } from "@/lib/api";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Clock,
} from "lucide-react";

interface ClientDetail {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  orders: {
    id: string;
    total: number;
    status: string;
    created_at: string;
    items: { name: string; quantity: number; price: number }[];
  }[];
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await clientsApi.get(clientId);
        setClient(data as unknown as ClientDetail);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load client");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-semibold text-neutral-500">
          {error || "Client not found"}
        </p>
        <Link
          href="/dashboard/clients"
          className="mt-4 text-sm font-bold text-[#22c51f] hover:underline"
        >
          Back to clients
        </Link>
      </div>
    );
  }

  const { user, orders } = client;
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Customer";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const completedOrders = orders.filter((o) => o.status === "Completed").length;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="flex items-center gap-2 text-[#22c51f] font-bold text-lg hover:underline transition"
        >
          <ArrowLeft size={20} />
          Client Details
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#22c51f]/10 text-xl font-bold text-[#22c51f]">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{name}</h1>
                <div className="mt-1 flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order history */}
          <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">Order History</h2>
            </div>
            {orders.length === 0 ? (
              <div className="py-12 text-center text-sm text-neutral-400">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-neutral-100">
                    <tr className="text-xs font-semibold text-neutral-500">
                      <th className="px-6 py-3 text-left">Order ID</th>
                      <th className="px-6 py-3 text-left">Items</th>
                      <th className="px-6 py-3 text-left">Total</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-700">
                          {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                          ${(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              order.status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "Active"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-neutral-500">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900">Client Stats</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#22c51f]/10">
                  <ShoppingBag size={16} className="text-[#22c51f]" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Total Orders</p>
                  <p className="text-sm font-bold text-neutral-900">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#22c51f]/10">
                  <DollarSign size={16} className="text-[#22c51f]" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Total Spent</p>
                  <p className="text-sm font-bold text-neutral-900">
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#22c51f]/10">
                  <Clock size={16} className="text-[#22c51f]" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Completed</p>
                  <p className="text-sm font-bold text-neutral-900">
                    {completedOrders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900">Contact</h3>
            <div className="mt-4 space-y-3">
              <a
                href={`mailto:${user.email}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                <Mail size={14} />
                Send Email
              </a>
              {user.phone && (
                <a
                  href={`tel:${user.phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  <Phone size={14} />
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
