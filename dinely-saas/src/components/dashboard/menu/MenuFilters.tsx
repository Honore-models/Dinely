"use client";

import { DashboardCard } from "../DashboardCard";
import { menuCategories, mealTimes, priceRanges, promos } from "../../../lib/dashboard/mockData";

interface MenuFiltersProps {
  selectedCategories: string[];
  selectedMealTimes: string[];
  selectedPriceRanges: string[];
  onCategoryChange: (category: string) => void;
  onMealTimeChange: (time: string) => void;
  onPriceRangeChange: (range: string) => void;
}

function FilterGroup({
  title,
  items,
  selected,
  onToggle,
  promoStyle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  promoStyle?: boolean;
}) {
  return (
    <div className="border-b border-neutral-100 py-4 last:border-0 last:pb-0 first:pt-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-600">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => onToggle(item)}
                className="h-4 w-4 rounded border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
              />
              <span className={promoStyle && item.includes("off") ? "font-semibold text-amber-600" : ""}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MenuFilters({
  selectedCategories,
  selectedMealTimes,
  selectedPriceRanges,
  onCategoryChange,
  onMealTimeChange,
  onPriceRangeChange,
}: MenuFiltersProps) {
  return (
    <DashboardCard className="w-full shrink-0 lg:w-[220px]" padding="md">
      <p className="mb-1 text-sm font-bold text-neutral-900">Filters</p>
      <p className="mb-2 text-xs font-medium text-neutral-400">Refine your menu view</p>
      <FilterGroup
        title="Category"
        items={menuCategories}
        selected={selectedCategories}
        onToggle={onCategoryChange}
      />
      <FilterGroup
        title="Meal times"
        items={mealTimes}
        selected={selectedMealTimes}
        onToggle={onMealTimeChange}
      />
      <FilterGroup
        title="Price"
        items={priceRanges}
        selected={selectedPriceRanges}
        onToggle={onPriceRangeChange}
      />
      <FilterGroup title="Promotions" items={promos} selected={[]} onToggle={() => {}} promoStyle />
    </DashboardCard>
  );
}
