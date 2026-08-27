import { ReservationList } from "../../../../components/dashboard/bookings/ReservationList";
import { TableFloorPlan } from "../../../../components/dashboard/bookings/TableFloorPlan";
import { DashboardPageHeader } from "../../../../components/dashboard/DashboardPageHeader";

export default function TableBookingsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Manage Tables"
        description="View reservations and your dining floor layout in real time."
      />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
        <ReservationList />
        <TableFloorPlan />
      </div>
    </>
  );
}
