"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Mail, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurant } from "@/hooks/useRestaurant";
import { authApi } from "@/lib/api";
import { DarkModeToggle } from "../ui/DarkModeToggle";
import { NotificationDropdown } from "../ui/NotificationDropdown";

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
  const { restaurant } = useRestaurant();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ownerName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "Dashboard";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  const avatar = user?.avatar || restaurant?.logo || "";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await authApi.logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/95 px-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/95 lg:px-8">
      <p className="min-w-0 truncate text-xs font-medium text-neutral-500 dark:text-neutral-400 sm:text-sm">
        <span className="hidden text-neutral-400 dark:text-neutral-500 sm:inline">Today · </span>
        {formatToday()}
      </p>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-[#22c51f] transition hover:bg-green-50 dark:hover:bg-green-950"
          aria-label="Messages"
        >
          <Mail size={18} />
        </button>
        <NotificationDropdown />

        <DarkModeToggle />

        <div className="mx-1 hidden h-6 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg border border-neutral-200/80 py-1.5 pl-1.5 pr-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={ownerName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#22c51f] text-xs font-bold text-white">
                {initials || <User size={16} />}
              </span>
            )}
            <span className="hidden text-sm font-bold text-neutral-800 dark:text-neutral-200 md:inline">{ownerName}</span>
            <ChevronDown size={14} className={`text-neutral-400 transition ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
              <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{ownerName}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email || ""}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/dashboard/settings");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Settings size={15} className="text-neutral-400" />
                Settings
              </button>
              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
