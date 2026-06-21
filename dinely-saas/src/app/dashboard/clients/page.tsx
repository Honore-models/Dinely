"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import ClientsTable from "@/components/dashboard/ClientsTable";
import { clientsApi } from "@/lib/api";

interface ClientMetrics { total: number; active: number; newClients: number; totalRevenue: number; }

export default function ClientsPage() {
  const [metrics, setMetrics] = useState<ClientMetrics>({ total: 0, active: 0, newClients: 0, totalRevenue: 0 });

  useEffect(() => {
    clientsApi.list().then((res) => {
      const data = res.data as unknown as { status: string; totalSpent: number }[];
      setMetrics({
        total: data.length,
        active: data.filter((c) => c.status === "active").length,
        newClients: data.filter((c) => c.status === "new").length,
        totalRevenue: data.reduce((s, c) => s + (c.totalSpent ?? 0), 0),
      });
    }).catch(() => {});
  }, []);

  return (
    <>
      <DashboardPageHeader title="Clients" description="View and manage your restaurant customers." />

      <DashboardSection className="mb-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <MetricCard title="Total Clients"         value={String(metrics.total)}           change={0} changeLabel="all time"          variant="primary" />
          <MetricCard title="Active Clients"        value={String(metrics.active)}          change={0} changeLabel="repeat customers" />
          <MetricCard title="Revenue From Clients"  value={`$${metrics.totalRevenue.toFixed(0)}`} change={0} changeLabel="all time" />
        </div>
      </DashboardSection>

      <DashboardSection>
        <ClientsTable />
      </DashboardSection>
    </>
  );
}
