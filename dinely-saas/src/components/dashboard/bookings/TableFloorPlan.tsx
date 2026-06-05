import { floorTables } from "../../../lib/dashboard/mockData";
import { DashboardCard } from "../DashboardCard";
import { TableNode } from "./TableNode";

export function TableFloorPlan() {
  return (
    <DashboardCard className="min-w-0 flex-1" padding="lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-[15px] font-bold text-neutral-900">Floor plan</h2>
          <p className="mt-0.5 text-xs font-medium text-neutral-400">Table availability overview</p>
        </div>
        <div className="flex gap-5 text-xs font-semibold text-neutral-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-[#a8d49e] bg-[#c8e8c0]" />
            Available
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-[#e8c4a8] bg-[#f5dcc8]" />
            On dine
          </span>
        </div>
      </div>

      <div
        className="mt-8 px-4 py-8 sm:px-8 rounded-2xl border border-neutral-100 bg-neutral-50/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto grid max-w-[600px] grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0">
          {floorTables.map((table) => (
            <TableNode key={table.id} table={table} />
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
