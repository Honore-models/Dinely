import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const SIZE = 168;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function KitchenStatus() {
  const capacity = 77;
  const congested = 23;
  const fluent = 100 - congested;

  const fluentLength = (fluent / 100) * CIRCUMFERENCE;
  const congestedLength = (congested / 100) * CIRCUMFERENCE;

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader title="Kitchen Status" subtitle="Real-time capacity" />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="-rotate-90"
            aria-hidden
          >
            {/* Full track */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#f0f0f0"
              strokeWidth={STROKE}
            />
            {/* Fluent — full green arc (77%) */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#22c51f"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${fluentLength} ${CIRCUMFERENCE}`}
            />
            {/* Congested — orange arc (23%), continues after green */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${congestedLength} ${CIRCUMFERENCE}`}
              strokeDashoffset={-fluentLength}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-neutral-800">{capacity}%</span>
            <span className="mt-0.5 text-xs font-semibold text-neutral-400">Capacity</span>
          </div>
        </div>

        <ul className="w-full min-w-[180px] space-y-4 sm:w-auto">
          <li>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2 text-neutral-600">
                <span className="h-3 w-3 rounded-full bg-[#22c51f]" />
                Fluent
              </span>
              <span className="text-[#22c51f]">{fluent}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-[#22c51f]" style={{ width: `${fluent}%` }} />
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2 text-neutral-600">
                <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                Congested
              </span>
              <span className="text-amber-600">{congested}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${congested}%` }} />
            </div>
          </li>
          <li className="rounded-lg bg-neutral-50 px-3 py-2.5 text-xs font-medium text-neutral-500">
            <span className="font-bold text-neutral-700">12</span> orders in queue ·{" "}
            <span className="font-bold text-neutral-700">~8 min</span> avg. wait
          </li>
        </ul>
      </div>
    </DashboardCard>
  );
}
