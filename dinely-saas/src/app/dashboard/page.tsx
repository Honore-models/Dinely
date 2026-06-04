import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader";
import { DashboardSection } from "../../components/dashboard/DashboardSection";
import { GeoSummary } from "../../components/dashboard/GeoSummary";
import { KitchenStatus } from "../../components/dashboard/KitchenStatus";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { PopularMenu } from "../../components/dashboard/PopularMenu";
import { RatingReviews } from "../../components/dashboard/RatingReviews";
import { SalesChart } from "../../components/dashboard/SalesChart";
import { dashboardMetrics } from "../../lib/dashboard/mockData";

export default function DashboardPage() {
  return (
    <>
      <DashboardPageHeader
        title="Dashboard"
        description="Monitor sales, bookings, and restaurant performance at a glance."
      />

      <DashboardSection title="Overview" className="mb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <MetricCard
            title="Total Sales"
            value={dashboardMetrics.totalSales.value}
            change={dashboardMetrics.totalSales.change}
            changeLabel={dashboardMetrics.totalSales.label}
            variant="primary"
          />
          <MetricCard
            title="Total Orders"
            value={dashboardMetrics.totalOrders.value}
            change={dashboardMetrics.totalOrders.change}
            changeLabel={dashboardMetrics.totalOrders.label}
          />
          <MetricCard
            title="Bookings"
            value={dashboardMetrics.bookings.value}
            change={dashboardMetrics.bookings.change}
            changeLabel={dashboardMetrics.bookings.label}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Analytics" className="mb-8">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <KitchenStatus />
        </div>
      </DashboardSection>

      <DashboardSection title="Insights">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          <RatingReviews />
          <PopularMenu />
          <GeoSummary />
        </div>
      </DashboardSection>
    </>
  );
}
