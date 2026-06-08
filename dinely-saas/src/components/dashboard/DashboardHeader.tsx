"use client";

import { Bell, ChevronDown, Mail, Sun, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function formatToday() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardHeader() {
  const { user } = useAuth();
  const ownerName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "Dashboard";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/95 px-5 backdrop-blur-sm lg:px-8">
      <p className="min-w-0 truncate text-xs font-medium text-neutral-500 sm:text-sm">
        <span className="hidden text-neutral-400 sm:inline">Today · </span>
        {formatToday()}
      </p>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-[#22c51f] transition hover:bg-green-50"
          aria-label="Messages"
        >
          <Mail size={18} />
        </button>
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-50"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#22c51f]" />
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-50"
          aria-label="Theme"
        >
          <Sun size={18} />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-neutral-200 sm:block" />

        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg border border-neutral-200/80 py-1.5 pl-1.5 pr-3 transition hover:bg-neutral-50"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#22c51f] text-xs font-bold text-white">
            {initials || <User size={16} />}
          </span>
          <span className="hidden text-sm font-bold text-neutral-800 md:inline">{ownerName}</span>
          <ChevronDown size={14} className="text-neutral-400" />
        </button>
      </div>
    </header>
  );
}
