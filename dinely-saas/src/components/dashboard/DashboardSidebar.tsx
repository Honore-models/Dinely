"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Utensils } from "lucide-react";
import { useState } from "react";
import { DinelyLogo } from "../brand/DinelyLogo";
import { dashboardNav } from "../../lib/dashboard/nav";
import { restaurantProfile } from "../../lib/dashboard/mockData";
import { useOnboardingStore } from "../../store/onboardingStore";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { restaurantInfo } = useOnboardingStore();
  const [bookingsOpen, setBookingsOpen] = useState(
    pathname.startsWith("/dashboard/bookings"),
  );
  const restaurantName = restaurantInfo.name || restaurantProfile.name;

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-neutral-200/80 bg-white">
      <div className="px-6 py-6">
        <DinelyLogo width={108} height={38} />
      </div>

      <div className="px-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/60 px-3.5 py-3 text-left transition hover:border-neutral-200 hover:bg-neutral-50"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f] text-white shadow-sm">
            <Utensils size={18} />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-neutral-800">
            {restaurantName}
          </span>
          <ChevronDown size={16} className="shrink-0 text-neutral-400" />
        </button>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Main menu
        </p>
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
                        ? "bg-green-50 text-[#1a9e18]"
                        : "text-neutral-600 hover:bg-neutral-50"
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
                    <div className="ml-5 mt-1 space-y-0.5 border-l border-neutral-200 pl-3">
                      {item.children!.map((child) => {
                        const childIsActive = isActive(pathname, child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-lg px-3 py-2 text-[13px] font-semibold transition ${
                              childIsActive
                                ? "bg-[#22c51f] text-white"
                                : "text-neutral-600 hover:bg-neutral-50"
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
                    ? "bg-green-50 text-[#1a9e18] ring-1 ring-green-100"
                    : "text-neutral-600 hover:bg-neutral-50"
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

      <div className="border-t border-neutral-200/80 p-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-700"
        >
          <LogOut size={18} strokeWidth={2} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
