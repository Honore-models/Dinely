"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { DinelyLogo } from "../brand/DinelyLogo";
import { dashboardNav } from "@/lib/dashboard/nav";
import { authApi } from "@/lib/api";
import { useRestaurant } from "@/hooks/useRestaurant";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [bookingsOpen, setBookingsOpen] = useState(
    pathname.startsWith("/dashboard/bookings"),
  );
  const { restaurant } = useRestaurant();
  const restaurantName = restaurant?.name || "My Restaurant";
  const restaurantLogo = restaurant?.logo || "";
  const restaurantInitials = restaurantName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="px-6 py-6">
        <DinelyLogo width={108} height={38} />
      </div>

      <div className="px-6 pb-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 bg-transparent py-2 text-left transition hover:opacity-80"
        >
          {restaurantLogo ? (
            <img
              src={restaurantLogo}
              alt={restaurantName}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-green-100 dark:ring-green-900"
            />
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f] text-xs font-bold text-white">
              {restaurantInitials}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-neutral-950 dark:text-white">
            {restaurantName}
          </span>
          <ChevronDown size={18} className="shrink-0 text-neutral-950 dark:text-white" strokeWidth={2.5} />
        </button>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          {dashboardNav.map((item) => {
            const active = isActive(pathname, item.href);
            const hasChildren = Boolean(item.children?.length);

            if (hasChildren) {
              const childActive = item.children!.some((c) => isActive(pathname, c.href));
              return (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setBookingsOpen((o) => !o)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                      childActive
                        ? "bg-green-50 text-[#1a9e18] dark:bg-green-950 dark:text-green-400"
                        : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={2} className="shrink-0 opacity-80" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-neutral-400 transition ${bookingsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {bookingsOpen ? (
                    <div className="ml-5 mt-1 space-y-0.5 border-l border-neutral-200 pl-3 dark:border-neutral-700">
                      {item.children!.map((child) => {
                        const childIsActive = isActive(pathname, child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
                              childIsActive
                                ? "bg-[#22c51f] text-white"
                                : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                  active
                    ? "bg-green-50 text-[#1a9e18] ring-1 ring-green-100 dark:bg-green-950 dark:text-green-400 dark:ring-green-900"
                    : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <item.icon
                  size={18}
                  strokeWidth={2}
                  className={`shrink-0 ${active ? "text-[#22c51f]" : "opacity-75"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-neutral-200/80 p-4 dark:border-neutral-800">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 size={18} strokeWidth={2} className="animate-spin" />
          ) : (
            <LogOut size={18} strokeWidth={2} />
          )}
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
