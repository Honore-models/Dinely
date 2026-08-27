"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  UtensilsCrossed,
  MapPin,
  Star,
  ArrowRight,
  Command,
  FileText,
  Home,
  ShoppingCart,
  Heart,
  User,
  LayoutDashboard,
} from "lucide-react";
import { restaurantsApi } from "@/lib/api";

interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  rating?: number;
}

interface QuickLink {
  label: string;
  href: string;
  icon: typeof Home;
  description: string;
}

const quickLinks: QuickLink[] = [
  { label: "Home", href: "/home", icon: Home, description: "Go to homepage" },
  { label: "Explore", href: "/explore", icon: UtensilsCrossed, description: "Browse restaurants" },
  { label: "Cart", href: "/cart", icon: ShoppingCart, description: "View your cart" },
  { label: "Favourites", href: "/favourites", icon: Heart, description: "Your saved restaurants" },
  { label: "Profile", href: "/profile", icon: User, description: "Manage your account" },
  { label: "My Orders", href: "/orders", icon: FileText, description: "Order history" },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Restaurant dashboard" },
];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter quick links based on query
  const filteredLinks = quickLinks.filter(
    (link) =>
      !query ||
      link.label.toLowerCase().includes(query.toLowerCase()) ||
      link.description.toLowerCase().includes(query.toLowerCase()),
  );

  // Total results count for keyboard nav
  const totalResults = filteredLinks.length + restaurants.length;

  // Fetch restaurants on search
  const searchRestaurants = useCallback(async (q: string) => {
    if (!q.trim()) {
      setRestaurants([]);
      return;
    }
    setLoading(true);
    try {
      const res = await restaurantsApi.list({ search: q });
      setRestaurants((res.data as unknown as Restaurant[]).slice(0, 5));
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setRestaurants([]);
      return;
    }
    const timer = setTimeout(() => searchRestaurants(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchRestaurants]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setRestaurants([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [totalResults]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          // Parent should handle opening
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Handle keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(totalResults, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + totalResults) % Math.max(totalResults, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex < filteredLinks.length) {
        const link = filteredLinks[selectedIndex];
        router.push(link.href);
        onClose();
      } else {
        const restaurantIdx = selectedIndex - filteredLinks.length;
        if (restaurants[restaurantIdx]) {
          router.push(`/restaurants/${restaurants[restaurantIdx].id}`);
          onClose();
        }
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-sm">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <Search size={20} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search restaurants, pages, or type a command..."
            className="flex-1 bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500"
          />
          <kbd className="hidden shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-500 sm:flex dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {/* Quick links */}
          {filteredLinks.length > 0 && (
            <div>
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Quick Links
              </p>
              {filteredLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => {
                      router.push(link.href);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      selectedIndex === idx
                        ? "bg-green-50 dark:bg-green-950/50"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <Icon size={16} className="text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {link.label}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Restaurant results */}
          {restaurants.length > 0 && (
            <div>
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Restaurants
              </p>
              {restaurants.map((r, idx) => {
                const globalIdx = filteredLinks.length + idx;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      router.push(`/restaurants/${r.id}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      selectedIndex === globalIdx
                        ? "bg-green-50 dark:bg-green-950/50"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-green-100 dark:bg-green-900">
                      <UtensilsCrossed size={16} className="text-[#22c51f] dark:text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {r.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{r.type}</span>
                        {r.rating != null && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              {r.rating.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#22c51f]" />
            </div>
          )}

          {/* No results */}
          {query && !loading && restaurants.length === 0 && filteredLinks.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                No results found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {/* Empty state */}
          {!query && !loading && (
            <div className="py-4 text-center">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Type to search restaurants, pages, and more
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
          <div className="flex items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium dark:border-neutral-700 dark:bg-neutral-800">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium dark:border-neutral-700 dark:bg-neutral-800">↵</kbd>
              Open
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            <Command size={10} />K to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
