import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import ClientsTable from "@/components/dashboard/ClientsTable";

export default function ClientsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Clients"
        description="View and manage your restaurant customers."
      />

      <DashboardSection className="mb-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <MetricCard
            title="Active Clients"
            value="75"
            change={4}
            changeLabel="since last month"
            variant="primary"
          />
          <MetricCard
            title="New Clients"
            value="12"
            change={8}
            changeLabel="this week"
          />
          <MetricCard
            title="Revenue From Clients"
            value="$25,400"
            change={12}
            changeLabel="this month"
          />
        </div>
      </DashboardSection>

      <DashboardSection>
        <ClientsTable />
      </DashboardSection>
    </>
  );
}
