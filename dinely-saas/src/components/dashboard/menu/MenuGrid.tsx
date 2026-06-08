"use client";

import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/dashboard/mockData";

interface MenuGridProps {
  items: MenuItem[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function MenuGrid({ items, page, pageSize, total, onPageChange }: MenuGridProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/menu/${item.id}`}
            className="group overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-green-200/60 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 280px"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-neutral-800">{item.name}</h3>
              <p className="mt-0.5 text-sm font-semibold text-[#22c51f]">{item.category}</p>
              <p className="mt-1 text-base font-bold text-amber-600">${item.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <p className="text-sm font-semibold text-neutral-500">
          {from}–{to} out of {total}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`grid h-9 min-w-9 place-items-center rounded-lg text-sm font-bold transition ${
                p === page
                  ? "bg-[#22c51f] text-white"
                  : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
