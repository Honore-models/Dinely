"use client";

import Link from "next/link";
import {
  CalendarCheck,
  ClipboardList,
  Coffee,
  Plus,
  Settings,
  Users,
  Utensils,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";

const actions = [
  {
    label: "New Menu Item",
    href: "/dashboard/menu",
    icon: Plus,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "View Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: CalendarCheck,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    label: "Employees",
    href: "/dashboard/employees",
    icon: Users,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    label: "Tables",
    href: "/dashboard/tables",
    icon: Utensils,
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  },
];

export function QuickActions() {
  return (
    <DashboardCard>
      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Quick Actions</h3>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-2 rounded-xl border border-neutral-100 bg-white p-3 text-center transition-all hover:border-green-200 hover:bg-green-50/30 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-800 dark:hover:bg-green-950/30"
            >
              <div
                className={`grid h-9 w-9 place-items-center rounded-lg transition group-hover:scale-105 ${action.color}`}
              >
                <Icon size={16} />
              </div>
              <span className="text-[11px] font-semibold text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}
