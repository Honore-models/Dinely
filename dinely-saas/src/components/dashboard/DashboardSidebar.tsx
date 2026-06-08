"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, UtensilsCrossed } from "lucide-react";
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

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200/80 bg-white">
      <div className="px-6 py-6">
        <DinelyLogo width={108} height={38} />
      </div>

      <div className="px-6 pb-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 bg-transparent py-2 text-left transition hover:opacity-80"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f] text-neutral-900">
            <UtensilsCrossed size={18} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-neutral-950">
            {restaurantName}
          </span>
          <ChevronDown size={18} className="shrink-0 text-neutral-950" strokeWidth={2.5} />
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
                      childActive ? "bg-green-50 text-[#1a9e18]" : "text-neutral-600 hover:bg-neutral-50"
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
                              childIsActive ? "bg-[#22c51f] text-white" : "text-neutral-600 hover:bg-neutral-50"
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
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-700"
        >
          <LogOut size={18} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}
