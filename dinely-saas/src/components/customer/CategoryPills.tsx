"use client";

import { useState } from "react";

const categories = [
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "salads", label: "Salads", emoji: "🥗" },
  { id: "sushi", label: "Sushi", emoji: "🍱" },
  { id: "drinks", label: "Drinks", emoji: "🥤" },
  { id: "chicken", label: "Chicken", emoji: "🍗" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
  { id: "seafood", label: "Seafood", emoji: "🦐" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
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
            <span className="text-base">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
