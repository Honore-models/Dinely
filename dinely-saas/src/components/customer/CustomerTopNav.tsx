"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Search, ShoppingCart } from "lucide-react";
import { DinelyLogo } from "@/components/brand/DinelyLogo";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Explore", href: "/explore" },
  { label: "Offers", href: "/offers" },
  { label: "Favourites", href: "/favourites" },
];

export function CustomerTopNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user } = useAuth();

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "Guest";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "G";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-6 border-b border-neutral-200/80 bg-white px-6 lg:px-10">
      {/* Logo */}
      <Link href="/home" className="shrink-0">
        <DinelyLogo width={100} height={34} priority />
      </Link>

      {/* Nav links */}
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-semibold transition ${
                active
                  ? "text-[#22c51f] underline underline-offset-4"
                  : "text-neutral-700 hover:text-neutral-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Search */}
      <div className="hidden max-w-xs flex-1 md:block">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search for restaurants"
            className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Cart */}
        <Link
          href="/cart"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-neutral-600 transition hover:bg-neutral-50"
          aria-label="Cart"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#22c51f] text-[10px] font-bold text-white">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-neutral-600 transition hover:bg-neutral-50"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* User */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-neutral-200/80 py-1.5 pl-1.5 pr-3 transition hover:bg-neutral-50"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">
            {initials}
          </span>
          <span className="hidden text-sm font-semibold text-neutral-800 md:inline">
            {displayName}
          </span>
          <ChevronDown size={14} className="text-neutral-400" />
        </button>
      </div>
    </header>
  );
}
