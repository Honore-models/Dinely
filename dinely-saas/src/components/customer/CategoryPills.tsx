"use client";

import { useState } from "react";

const categories = [
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "salads", label: "Salads", emoji: "🥗" },
  { id: "sushi", label: "Sushi", emoji: "🍱" },
  { id: "drinks", label: "Drinks", emoji: "🍊" },
  { id: "chicken", label: "Chicken", emoji: "🍗" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
];

interface CategoryPillsProps {
  selected?: string;
  onSelect?: (id: string) => void;
}

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  const [active, setActive] = useState(selected ?? "burgers");

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#22c51f] bg-white text-[#22c51f] ring-1 ring-[#22c51f]"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
      >
        More •••
      </button>
    </div>
  );
}
