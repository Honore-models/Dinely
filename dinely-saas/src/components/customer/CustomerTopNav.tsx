"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, Search, ShoppingCart, User } from "lucide-react";
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
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "Guest";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "G";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
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

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-neutral-200/80 py-1.5 pl-1.5 pr-3 transition hover:bg-neutral-50"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">
                {initials}
              </span>
              <span className="hidden text-sm font-semibold text-neutral-800 md:inline">
                {displayName}
              </span>
              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                {/* User info */}
                <div className="border-b border-neutral-100 px-4 py-3">
                  <p className="text-sm font-bold text-neutral-900">{displayName}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{user?.email || "Guest"}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/profile");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <User size={16} className="text-neutral-400" />
                    My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-100">
                <LogOut size={22} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Log out of your account?
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                You&apos;ll need to sign in again to access your orders, favourites, and profile.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
