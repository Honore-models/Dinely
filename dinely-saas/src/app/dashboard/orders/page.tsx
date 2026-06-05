import { DashboardPageHeader } from "../../../components/dashboard/DashboardPageHeader";
import { DashboardSection } from "../../../components/dashboard/DashboardSection";
import MetricsCard from "../../../components/dashboard/OrderMetricsCard";
import OrdersTable from "../../../components/dashboard/OrdersTable";

export default function OrdersPage() {
  const orderMetrics = {
    total: { value: "75", label: "Total Orders", icon: "📋" },
    active: { value: "102", label: "Active Orders", icon: "🔵" },
    completed: { value: "43", label: "Completed Orders", icon: "✅" },
    cancelled: { value: "6", label: "Cancelled Orders", icon: "❌" },
  };

  return (
    <>
      <DashboardPageHeader
        title="Orders"
        description="Track and fulfill incoming orders in real time."
      />

      <DashboardSection className="mb-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <MetricsCard
            title={orderMetrics.total.label}
            value={orderMetrics.total.value}
            variant="warning"
          />
          <MetricsCard
            title={orderMetrics.active.label}
            value={orderMetrics.active.value}
            variant="info"
          />
          <MetricsCard
            title={orderMetrics.completed.label}
            value={orderMetrics.completed.value}
            variant="success"
          />
          <MetricsCard
            title={orderMetrics.cancelled.label}
            value={orderMetrics.cancelled.value}
            variant="danger"
          />
        </div>
      </DashboardSection>

      <DashboardSection>
        <OrdersTable />
      </DashboardSection>
    </>
  );
}
