"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DashboardPageHeader } from "../DashboardPageHeader";
import { menuItems } from "@/lib/dashboard/mockData";
import { MenuFilters } from "./MenuFilters";
import { MenuGrid } from "./MenuGrid";

const PAGE_SIZE = 9;

export function MenuPageClient() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMealTimes, setSelectedMealTimes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesMeal =
        selectedMealTimes.length === 0 ||
        item.mealTimes.some((t) => selectedMealTimes.includes(t));
      const matchesPrice =
        selectedPriceRanges.length === 0 || selectedPriceRanges.includes(item.priceRange);
      return matchesQuery && matchesCategory && matchesMeal && matchesPrice;
    });
  }, [query, selectedCategories, selectedMealTimes, selectedPriceRanges]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    setPage(1);
  };

  return (
    <>
      <DashboardPageHeader
        title="Menu"
        description="Browse, filter, and manage your restaurant menu items."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <MenuFilters
          selectedCategories={selectedCategories}
          selectedMealTimes={selectedMealTimes}
          selectedPriceRanges={selectedPriceRanges}
          onCategoryChange={(c) => toggle(selectedCategories, c, setSelectedCategories)}
          onMealTimeChange={(t) => toggle(selectedMealTimes, t, setSelectedMealTimes)}
          onPriceRangeChange={(r) => toggle(selectedPriceRanges, r, setSelectedPriceRanges)}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Search menu items..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="h-11 w-full rounded-lg border border-neutral-200/80 bg-white pl-11 pr-4 text-sm font-medium outline-none shadow-sm placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-2 focus:ring-green-100/80"
              />
            </div>
            <button
              type="button"
              className="h-11 shrink-0 rounded-lg bg-[#22c51f] px-8 text-sm font-bold text-white shadow-sm transition hover:bg-[#1bad1a]"
            >
              Search
            </button>
          </div>

          <MenuGrid
            items={paginated}
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
