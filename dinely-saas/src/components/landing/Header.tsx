"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { DinelyLogo } from "../brand/DinelyLogo";
import { Button } from "../ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/explore" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "#" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <DinelyLogo width={110} height={40} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-neutral-700 transition hover:text-[#22c51f]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-neutral-600 transition hover:bg-neutral-50"
          >
            <Search size={18} />
          </button>
          <Link
            href="/cart"
            className="grid h-9 w-9 place-items-center rounded-lg text-neutral-600 transition hover:bg-neutral-50"
          >
            <ShoppingCart size={18} />
          </Link>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button href="/register" className="text-sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-neutral-700 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-neutral-100 pt-3">
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg bg-[#22c51f] py-3 text-center text-sm font-bold text-white transition hover:bg-[#1bad1a]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
