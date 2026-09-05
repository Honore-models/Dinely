"use client";

import { useState } from "react";
import {
  Flame,
  Pizza,
  Salad,
  Fish,
  Coffee,
  Cake,
  Beef,
  IceCream,
  Wine,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: "burgers", label: "Burgers", icon: Flame },
  { id: "pizza", label: "Pizza", icon: Pizza },
  { id: "salads", label: "Salads", icon: Salad },
  { id: "sushi", label: "Sushi", icon: Fish },
  { id: "drinks", label: "Drinks", icon: Wine },
  { id: "chicken", label: "Chicken", icon: Utensils },
  { id: "desserts", label: "Desserts", icon: Cake },
  { id: "pasta", label: "Pasta", icon: Utensils },
  { id: "seafood", label: "Seafood", icon: Fish },
  { id: "coffee", label: "Coffee", icon: Coffee },
];

interface CategoryPillsProps {
  selected?: string;
  onSelect?: (id: string) => void;
}

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  const [active, setActive] = useState(selected ?? "");

  const handleSelect = (id: string) => {
    const next = active === id ? "" : id;
    setActive(next);
    onSelect?.(next);
  };

  return (
    <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? "border-[#22c555] bg-gradient-to-r from-[#22c555] to-[#1bad1a] text-white shadow-md shadow-green-200 dark:shadow-green-900"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white"
            }`}
          >
            <cat.icon size={16} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
