"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "../ui/Button";
import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";
import { reviewsApi } from "@/lib/api";
import { useRestaurant } from "@/hooks/useRestaurant";

interface ReviewData {
  total: number;
  avgRating: number;
  starBreakdown: { stars: number; count: number; pct: number }[];
}

export function RatingReviews() {
  const { restaurant } = useRestaurant();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurant?._id) return;
    reviewsApi.list(restaurant._id, { limit: 50 }).then((res) => {
      const reviews = res.data as unknown as { rating: number }[];
      const total = res.total;
      const avg = res.avgRating;
      const breakdown = [5, 4, 3, 2, 1].map((s) => {
        const count = reviews.filter((r) => r.rating === s).length;
        return { stars: s, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
      });
      setData({ total, avgRating: avg, starBreakdown: breakdown });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [restaurant?._id]);

  const avg = data?.avgRating ?? 0;
  const positiveReviews = data?.starBreakdown.filter((s) => s.stars >= 4).reduce((sum, s) => sum + s.count, 0) ?? 0;
  const positivePct = data && data.total > 0 ? Math.round((positiveReviews / data.total) * 100) : 0;

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Rating & Reviews" subtitle={data ? `Based on ${data.total} reviews` : "Loading…"} />

      {loading ? (
        <div className="mt-4 h-32 animate-pulse rounded-xl bg-neutral-100" />
      ) : (
        <>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-neutral-900">{avg > 0 ? avg.toFixed(1) : "—"}</p>
              <div className="mt-1 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className={i <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-neutral-200"} />
                ))}
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              {(data?.starBreakdown ?? []).map((row) => (
                <div key={row.stars} className="flex items-center gap-2">
                  <span className="w-3 text-xs font-bold text-neutral-500">{row.stars}</span>
                  <Star size={10} className="shrink-0 fill-amber-400 text-amber-400" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-neutral-400">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {data && data.total > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-center">
                <p className="text-lg font-bold text-[#22c51f]">{positivePct}%</p>
                <p className="text-xs font-semibold text-neutral-500">Positive</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-center">
                <p className="text-lg font-bold text-red-500">{100 - positivePct}%</p>
                <p className="text-xs font-semibold text-neutral-500">Negative</p>
              </div>
            </div>
          )}

          {data?.total === 0 && (
            <p className="mt-4 text-center text-sm text-neutral-400">No reviews yet</p>
          )}
        </>
      )}

      <Button href="/dashboard/clients" variant="outline" className="mt-5 h-10 w-full text-sm">
        View All Reviews
      </Button>
    </DashboardCard>
  );
}
