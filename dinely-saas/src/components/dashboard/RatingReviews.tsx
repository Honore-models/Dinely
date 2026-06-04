import { Star } from "lucide-react";
import { Button } from "../ui/Button";
import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const starBreakdown = [
  { stars: 5, pct: 42 },
  { stars: 4, pct: 28 },
  { stars: 3, pct: 15 },
  { stars: 2, pct: 8 },
  { stars: 1, pct: 7 },
];

export function RatingReviews() {
  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Rating & Reviews" subtitle="Based on 480 reviews" />

      <div className="mt-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-neutral-900">3.5</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={14}
                className={
                  i <= 3
                    ? "fill-amber-400 text-amber-400"
                    : i === 4
                      ? "fill-amber-200 text-amber-400"
                      : "text-neutral-200"
                }
              />
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {starBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2">
              <span className="w-3 text-xs font-bold text-neutral-500">{row.stars}</span>
              <Star size={10} className="shrink-0 fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-neutral-400">
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <p className="text-lg font-bold text-[#22c51f]">97%</p>
          <p className="text-xs font-semibold text-neutral-500">Positive</p>
        </div>
        <div className="rounded-xl bg-red-50 p-3 text-center">
          <p className="text-lg font-bold text-red-500">3%</p>
          <p className="text-xs font-semibold text-neutral-500">Negative</p>
        </div>
      </div>

      <Button href="/dashboard/clients" variant="outline" className="mt-5 h-10 w-full text-sm">
        Detail Reviews
      </Button>
    </DashboardCard>
  );
}
