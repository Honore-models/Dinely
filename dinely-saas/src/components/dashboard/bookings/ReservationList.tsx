"use client";

import { Check, Phone, Plus, Search } from "lucide-react";
import { DashboardCard } from "../DashboardCard";
import { reservations } from "../../../lib/dashboard/mockData";

export function ReservationList() {
  return (
    <DashboardCard
      className="flex w-full flex-col xl:w-[300px] xl:shrink-0"
      padding="none"
    >
      <div className="border-b border-neutral-100 px-5 py-4">
        <p className="text-sm font-bold text-neutral-900">Reservations</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#22c51f] bg-green-50 px-3.5 py-1.5 text-xs font-bold text-[#22c51f]"
          >
            All 12
          </button>
          <button
            type="button"
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-neutral-500 transition hover:bg-neutral-50"
          >
            Reservation
          </button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="search"
            placeholder="Search customer..."
            className="h-10 w-full rounded-lg border border-neutral-200/80 bg-neutral-50/50 pl-9 pr-3 text-sm font-medium outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80"
          />
        </div>
      </div>

      <ul className="max-h-[480px] flex-1 space-y-2 overflow-y-auto p-4 xl:max-h-none">
        {reservations.map((res) => {
          const isDine = res.statusType === "dine";
          return (
            <li
              key={res.id}
              className="flex gap-3 rounded-lg border border-neutral-100 p-3 transition hover:border-green-200/60 hover:bg-green-50/40"
            >
              <div
                className={`flex w-[68px] shrink-0 flex-col items-center justify-center rounded-lg px-1.5 py-2.5 text-center text-[11px] font-bold leading-tight text-white ${
                  isDine ? "bg-[#f59e0b]" : "bg-[#22c51f]"
                }`}
              >
                {isDine ? "On Dine" : res.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-neutral-800">{res.customer}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#22c51f]">
                  <Check size={11} />
                  {res.status}
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-neutral-500">
                  <Phone size={11} />
                  {res.phone}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-neutral-100 p-4">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22c51f] text-sm font-bold text-white shadow-sm transition hover:bg-[#1bad1a]"
        >
          <Plus size={18} />
          Add reservation
        </button>
      </div>
    </DashboardCard>
  );
}
