import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { popularMenuItems } from "../../lib/dashboard/mockData";
import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const maxRevenue = 12450;

export function PopularMenu() {
  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Popular Menu" subtitle="Top sellers this week" />

      <ul className="space-y-5">
        {popularMenuItems.map((item, index) => {
          const revenueNum = parseInt(item.revenue.replace(/[$,]/g, ""), 10);
          const barWidth = (revenueNum / maxRevenue) * 100;

          return (
            <li key={item.id}>
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-green-50 text-xs font-bold text-[#22c51f]">
                  {index + 1}
                </span>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-lg object-cover ring-2 ring-white"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-neutral-800">{item.name}</p>
                    <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-[#22c51f]">
                      <TrendingUp size={12} />
                      {item.change}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-500">{item.revenue}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7cc243] to-[#22c51f]"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
