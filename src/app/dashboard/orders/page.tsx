"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import MetricsCard from "@/components/dashboard/OrderMetricsCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { ordersApi } from "@/lib/api";

interface Counts { total: number; active: number; completed: number; cancelled: number; }

export default function OrdersPage() {
  const [counts, setCounts] = useState<Counts>({ total: 0, active: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [all, active, completed, cancelled] = await Promise.all([
          ordersApi.list({ limit: 1 }),
          ordersApi.list({ status: "Active", limit: 1 }),
          ordersApi.list({ status: "Completed", limit: 1 }),
          ordersApi.list({ status: "Cancelled", limit: 1 }),
        ]);
        setCounts({
          total: all.total,
          active: active.total,
          completed: completed.total,
          cancelled: cancelled.total,
        });
      } catch { /* ignore */ }
    };
    fetchCounts();
  }, []);

  return (
    <>
      <DashboardPageHeader
        title="Orders"
        description="Track and fulfill incoming orders in real time."
      />

      <DashboardSection className="mb-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <MetricsCard title="Total Orders"     value={String(counts.total)}     variant="warning" />
          <MetricsCard title="Active Orders"    value={String(counts.active)}    variant="info" />
          <MetricsCard title="Completed Orders" value={String(counts.completed)} variant="success" />
          <MetricsCard title="Cancelled Orders" value={String(counts.cancelled)} variant="danger" />
        </div>
      </DashboardSection>

      <DashboardSection>
        <OrdersTable />
      </DashboardSection>
    </>
  );
}
