import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Store,
  Table2,
  Users,
  UtensilsCrossed,
  UserCog,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { label: string; href: string }[];
}

export const dashboardNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
    children: [
      { label: "Tables", href: "/dashboard/bookings/tables" },
      { label: "Foods", href: "/dashboard/bookings/foods" },
    ],
  },
  { label: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Tables", href: "/dashboard/tables", icon: Table2 },
  { label: "My restaurant", href: "/dashboard/my-restaurant", icon: Store },
  { label: "Employees", href: "/dashboard/employees", icon: UserCog },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
