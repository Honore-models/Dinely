"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

interface MarketingNavBarProps {
  /** The current page path to highlight as active */
  activePage?: string;
}

export function MarketingNavBar({ activePage }: MarketingNavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 lg:px-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 transition hover:text-[#22c51f]"
        >
          ← Back to Home
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition ${
                activePage === link.href
                  ? "text-[#22c51f]"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-neutral-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white px-6 py-3 md:hidden dark:border-neutral-800 dark:bg-neutral-900">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activePage === link.href
                    ? "bg-green-50 text-[#22c51f]"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
}
