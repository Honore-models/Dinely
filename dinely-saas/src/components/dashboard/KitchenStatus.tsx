import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const SIZE = 168;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface KitchenStatusProps {
  ordersByStatus: { status: string; count: number }[];
  loading?: boolean;
}

export function KitchenStatus({ ordersByStatus, loading }: KitchenStatusProps) {
  const total = ordersByStatus.reduce((s, o) => s + o.count, 0) || 1;
  const active = ordersByStatus.find((o) => o.status === "Active")?.count ?? 0;
  const pending = ordersByStatus.find((o) => o.status === "Pending")?.count ?? 0;
  const inProgress = active + pending;
  const completedCount = ordersByStatus.find((o) => o.status === "Completed")?.count ?? 0;

  const capacityPct = Math.round((inProgress / total) * 100);
  const fluentPct = Math.round((completedCount / total) * 100);
  const congested = 100 - fluentPct;

  const fluentLength = (Math.min(fluentPct, 100) / 100) * CIRCUMFERENCE;
  const congestedLength = (Math.min(congested, 100) / 100) * CIRCUMFERENCE;

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Kitchen Status" subtitle="Real-time order load" />

      {loading ? (
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-neutral-100" />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative mx-auto shrink-0" style={{ width: SIZE, height: SIZE }}>
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="-rotate-90"
              aria-hidden
            >
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth={STROKE} />
              <circle
                cx={CENTER} cy={CENTER} r={RADIUS}
                fill="none" stroke="#22c55e" strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${fluentLength} ${CIRCUMFERENCE}`}
              />
              <circle
                cx={CENTER} cy={CENTER} r={RADIUS}
                fill="none" stroke="#f59e0b" strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${congestedLength} ${CIRCUMFERENCE}`}
                strokeDashoffset={-fluentLength}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-semibold tracking-tight text-neutral-900">
                {capacityPct}%
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                Active
              </span>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-neutral-100 bg-neutral-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Order Status
            </p>
            <div className="mt-3 space-y-3">
              {ordersByStatus.length === 0 ? (
                <p className="text-xs text-neutral-400">No orders yet</p>
              ) : (
                ordersByStatus.map((o) => {
                  const pct = Math.round((o.count / total) * 100);
                  const color =
                    o.status === "Completed" ? "bg-emerald-500" :
                    o.status === "Active" ? "bg-blue-500" :
                    o.status === "Pending" ? "bg-amber-500" : "bg-red-400";
                  const textColor =
                    o.status === "Completed" ? "text-emerald-600" :
                    o.status === "Active" ? "text-blue-600" :
                    o.status === "Pending" ? "text-amber-600" : "text-red-500";
                  return (
                    <div key={o.status}>
                      <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                        <span className="flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full ${color}`} />
                          {o.status}
                        </span>
                        <span className={textColor}>
                          {o.count} ({pct}%)
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white shadow-inner">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
