"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RatingReviews } from "@/components/dashboard/RatingReviews";
import { PopularMenu } from "@/components/dashboard/PopularMenu";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { analyticsApi } from "@/lib/api";

interface AnalyticsData {
  revenue: { current: number; previous: number; change: number };
  orders: { current: number; previous: number; change: number };
  customers: { current: number; previous: number; change: number };
  avgOrderValue: { current: number; previous: number; change: number };
  revenueChart: { date: string; revenue: number; orders: number }[];
  ordersByType: { type: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  topItems: { id: string; name: string; quantity: number; revenue: number }[];
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyticsApi
      .get(period)
      .then((data) => setAnalytics(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(2)}`;

  return (
    <>
      <DashboardPageHeader
        title="Dashboard"
        description="Monitor sales, bookings, and restaurant performance at a glance."
        action={
          <div className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  period === p
                    ? "bg-[#22c51f] text-white"
                    : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
              </button>
            ))}
          </div>
        }
      />

      {/* ── Metric Cards ──────────────────────────────────────────────── */}
      <DashboardSection title="Overview" className="mb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))
          ) : (
            <>
              <MetricCard
                title="Total Revenue"
                value={analytics ? fmt(analytics.revenue.current) : "$0"}
                change={analytics?.revenue.change ?? 0}
                changeLabel="vs previous period"
                variant="primary"
              />
              <MetricCard
                title="Total Orders"
                value={analytics ? String(analytics.orders.current) : "0"}
                change={analytics?.orders.change ?? 0}
                changeLabel="vs previous period"
              />
              <MetricCard
                title="Customers"
                value={analytics ? String(analytics.customers.current) : "0"}
                change={analytics?.customers.change ?? 0}
                changeLabel="vs previous period"
              />
              <MetricCard
                title="Avg Order Value"
                value={analytics ? fmt(analytics.avgOrderValue.current) : "$0"}
                change={analytics?.avgOrderValue.change ?? 0}
                changeLabel="vs previous period"
              />
            </>
          )}
        </div>
      </DashboardSection>

      {/* ── Chart + Reviews ─────────────────────────────────────────────── */}
      <DashboardSection title="Analytics" className="mb-8">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <SalesChart
              revenueChart={analytics?.revenueChart ?? []}
              loading={loading}
            />
          </div>
          <RatingReviews />
        </div>
      </DashboardSection>

      {/* ── Recent Orders + Quick Actions ─────────────────────────────── */}
      <DashboardSection title="Activity" className="mb-8">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </DashboardSection>

      {/* ── Popular Menu ────────────────────────────────────────────────── */}
      <DashboardSection title="Insights">
        <PopularMenu
          topItems={analytics?.topItems ?? []}
          loading={loading}
        />
      </DashboardSection>
    </>
  );
}
