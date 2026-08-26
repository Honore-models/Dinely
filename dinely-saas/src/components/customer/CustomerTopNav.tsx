"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "Guest";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "G";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/home" className="shrink-0">
            <DinelyLogo width={100} height={34} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? "text-emerald-600"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-1 -bottom-[17px] h-0.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop search */}
          <div className="hidden max-w-xs flex-1 md:block">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search restaurants..."
                className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-xl text-neutral-600 transition hover:bg-neutral-50"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl text-neutral-600 transition hover:bg-neutral-50"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            {/* User */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2.5 transition hover:bg-neutral-50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {initials}
                </span>
                <span className="hidden text-sm font-semibold text-neutral-800 lg:inline">
                  {displayName}
                </span>
                <ChevronDown
                  size={14}
                  className={`hidden text-neutral-400 transition-transform lg:block ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xl shadow-neutral-100/50">
                  <div className="border-b border-neutral-50 px-4 py-3.5">
                    <p className="text-sm font-bold text-neutral-900">
                      {displayName}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {user?.email || "Guest"}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <User size={16} className="text-neutral-400" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/orders");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <ShoppingCart size={16} className="text-neutral-400" />
                      My Orders
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl text-neutral-600 transition hover:bg-neutral-50 md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden">
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-neutral-100 pt-3">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-6 py-8 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-100">
                <LogOut size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Sign out of your account?
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                You&apos;ll need to sign in again to access your orders,
                favourites, and profile.
              </p>
            </div>
            <div className="flex border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 border-l border-neutral-100 px-4 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
