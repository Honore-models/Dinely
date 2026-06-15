"use client";

import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

interface TopItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  image?: string;
}

interface PopularMenuProps {
  topItems: TopItem[];
  loading?: boolean;
}

// Fallback images for items without uploaded images
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1573080496219-998f39ebbd5a?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=120&h=120&fit=crop",
];

export function PopularMenu({ topItems, loading }: PopularMenuProps) {
  const maxRevenue = Math.max(...topItems.map((i) => i.revenue), 1);

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Popular Menu" subtitle="Top sellers this period" />

      {loading ? (
        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
      ) : topItems.length === 0 ? (
        <div className="mt-6 text-center text-sm text-neutral-400">
          No order data yet. Orders will appear here once placed.
        </div>
      ) : (
        <ul className="mt-2 space-y-5">
          {topItems.slice(0, 5).map((item, index) => {
            const barWidth = (item.revenue / maxRevenue) * 100;
            const image = item.image && item.image.startsWith("http")
              ? item.image
              : FOOD_IMAGES[index % FOOD_IMAGES.length];

            return (
              <li key={item.id}>
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-green-50 text-xs font-bold text-[#22c51f]">
                    {index + 1}
                  </span>
                  <Image
                    src={image}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-lg object-cover ring-2 ring-white"
                    unoptimized={!image.includes("unsplash")}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-neutral-800">{item.name}</p>
                      <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-[#22c51f]">
                        <TrendingUp size={12} />
                        {item.quantity}x
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-500">
                      ${item.revenue.toFixed(2)}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7cc243] to-[#22c51f]"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
