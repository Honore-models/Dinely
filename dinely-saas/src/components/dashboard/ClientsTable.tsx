"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { clientsApi } from "@/lib/api";
import ClientProfileModal from "./ClientProfileModal";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastVisit: string | Date;
  status: "active" | "new" | "inactive";
}

const STATUS_BADGE: Record<string, string> = {
  active:   "bg-emerald-100 text-emerald-700",
  new:      "bg-amber-100 text-amber-700",
  inactive: "bg-neutral-100 text-neutral-500",
};

const PAGE_SIZE = 10;

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Client | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientsApi.list(debouncedSearch || undefined);
      setClients(res.data as unknown as Client[]);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(clients.length / PAGE_SIZE);
  const paginated = clients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search clients…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#22c51f] focus:outline-none focus:ring-1 focus:ring-green-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-100" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-xs font-semibold text-neutral-500 border-b border-neutral-100">
                    <th className="py-3 px-3 text-left">Name</th>
                    <th className="py-3 px-3 text-left">Email</th>
                    <th className="py-3 px-3 text-left">Phone</th>
                    <th className="py-3 px-3 text-left">Orders</th>
                    <th className="py-3 px-3 text-left">Spent</th>
                    <th className="py-3 px-3 text-left">Last Visit</th>
                    <th className="py-3 px-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} className="py-10 text-center text-neutral-400">No clients found</td></tr>
                  ) : paginated.map((c) => {
                    const initials = c.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                    const lastVisit = c.lastVisit
                      ? new Date(c.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—";
                    return (
                      <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-neutral-50">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#22c51f]/10 text-sm font-bold text-[#22c51f]">
                              {initials}
                            </div>
                            <span className="font-semibold text-neutral-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} className="text-neutral-600 hover:underline">{c.email}</a>
                        </td>
                        <td className="py-3.5 px-3 text-neutral-600">{c.phone || "—"}</td>
                        <td className="py-3.5 px-3 font-semibold text-neutral-900">{c.orderCount}</td>
                        <td className="py-3.5 px-3 font-semibold text-neutral-900">${c.totalSpent.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-neutral-500">{lastVisit}</td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[c.status] ?? "bg-neutral-100 text-neutral-500"}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-neutral-500">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40">
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`h-7 w-7 rounded text-xs font-semibold ${p === page ? "bg-[#22c51f] text-white" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}>{p}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="grid h-7 w-7 place-items-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40">
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {selected && <ClientProfileModal client={selected as never} onClose={() => setSelected(null)} />}
    </>
  );
}

export default ClientsTable;
