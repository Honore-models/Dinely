import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const regions = [
  { label: "Active customers", color: "#22c51f", mapFill: "#22c51f" },
  { label: "Dormant customers", color: "#c4a035", mapFill: "#c4a035" },
  { label: "Inactive customers", color: "#d4736a", mapFill: "#d4736a" },
] as const;

export function GeoSummary() {
  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Geographic Summary" subtitle="Customer activity by region" />

      <div className="relative overflow-hidden rounded-lg bg-[#f8fafb]">
        <svg viewBox="0 0 400 200" className="h-[200px] w-full" aria-hidden>
          {/* Simplified world landmass */}
          <path
            d="M30 130 C50 90 90 75 130 85 C170 70 210 80 250 75 C290 68 330 85 370 95 L370 175 L30 175 Z"
            fill="#eef2f5"
            stroke="#dde4ea"
            strokeWidth={1}
          />
          {/* Regional activity blobs */}
          <ellipse cx={100} cy={115} rx={38} ry={24} fill={regions[0].mapFill} opacity={0.55} />
          <ellipse cx={195} cy={100} rx={28} ry={18} fill={regions[1].mapFill} opacity={0.5} />
          <ellipse cx={280} cy={108} rx={42} ry={26} fill={regions[0].mapFill} opacity={0.6} />
          <ellipse cx={330} cy={118} rx={18} ry={14} fill={regions[2].mapFill} opacity={0.55} />
          <ellipse cx={155} cy={125} rx={22} ry={14} fill={regions[1].mapFill} opacity={0.45} />
          <ellipse cx={235} cy={120} rx={30} ry={18} fill={regions[0].mapFill} opacity={0.5} />
        </svg>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-neutral-100 pt-5">
        {regions.map((r) => (
          <span
            key={r.label}
            className="flex items-center gap-2.5 text-sm font-bold text-neutral-800"
          >
            <span
              className="h-3 w-9 shrink-0 rounded-full"
              style={{ backgroundColor: r.color }}
              aria-hidden
            />
            {r.label}
          </span>
        ))}
      </div>
    </DashboardCard>
  );
}
