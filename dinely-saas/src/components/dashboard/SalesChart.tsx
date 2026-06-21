"use client";

import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const WIDTH = 520;
const HEIGHT = 248;
const PAD = { top: 48, right: 16, bottom: 32, left: 44 };
const chartW = WIDTH - PAD.left - PAD.right;
const chartH = HEIGHT - PAD.top - PAD.bottom;

function formatVal(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
}

interface SalesChartProps {
  revenueChart: { date: string; revenue: number; orders: number }[];
  loading?: boolean;
}

export function SalesChart({ revenueChart, loading }: SalesChartProps) {
  const raw =
    revenueChart.length > 0
      ? revenueChart.slice(-7).map((d) => ({
          day: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
          value: d.revenue,
          sales: d.revenue,
        }))
      : [
          { day: "Sun", value: 0, sales: 0 },
          { day: "Mon", value: 0, sales: 0 },
          { day: "Tue", value: 0, sales: 0 },
          { day: "Wed", value: 0, sales: 0 },
          { day: "Thu", value: 0, sales: 0 },
          { day: "Fri", value: 0, sales: 0 },
          { day: "Sat", value: 0, sales: 0 },
        ];

  const max = Math.max(...raw.map((d) => d.value), 1);
  const peakIndex = raw.findIndex((d) => d.value === max);
  const yTicks = [0, 25, 50, 75, 100];

  const points = raw.map((d, i) => {
    const x = PAD.left + (i / Math.max(raw.length - 1, 1)) * chartW;
    const y = PAD.top + chartH - (d.value / max) * chartH;
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + chartH} L ${points[0].x} ${PAD.top + chartH} Z`;

  const peak = points[Math.max(peakIndex, 0)];
  const tooltipH = 24;
  const tooltipW = 88;
  const showTooltipBelow = peak.y < PAD.top + tooltipH + 8;
  const tooltipY = showTooltipBelow ? peak.y + 12 : peak.y - 12;
  const tooltipRectY = showTooltipBelow ? tooltipY : tooltipY - tooltipH;
  const totalSales = raw.reduce((s, d) => s + d.sales, 0);
  const avgDaily = Math.round(totalSales / Math.max(raw.length, 1));

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader
        title="Revenue Overview"
        subtitle="Daily revenue performance"
        action={
          <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-[#22c51f]">
            Last 7 days
          </span>
        }
      />

      {loading ? (
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-neutral-100" />
      ) : (
        <div className="overflow-x-auto overflow-y-visible">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full min-w-[320px] overflow-visible"
            role="img"
            aria-label="Revenue line chart"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="salesArea2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c51f" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22c51f" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="salesLine2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7cc243" />
                <stop offset="100%" stopColor="#22c51f" />
              </linearGradient>
            </defs>

            {yTicks.map((tick) => {
              const y = PAD.top + chartH - (tick / 100) * chartH;
              return (
                <g key={tick}>
                  <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="#f0f0f0" strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "4 4"} />
                  <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-neutral-400 text-[10px] font-semibold">{tick}%</text>
                </g>
              );
            })}

            <path d={areaPath} fill="url(#salesArea2)" />
            <path d={linePath} fill="none" stroke="url(#salesLine2)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {points.map((p, i) => (
              <g key={p.day}>
                <circle cx={p.x} cy={p.y} r={i === peakIndex ? 6 : 4} fill="white" stroke={i === peakIndex ? "#22c51f" : "#a8d49e"} strokeWidth={2} />
                <text x={p.x} y={HEIGHT - 10} textAnchor="middle" className="fill-neutral-500 text-[11px] font-semibold">{p.day}</text>
              </g>
            ))}

            {peak.value > 0 && (
              <g transform={`translate(${peak.x}, 0)`}>
                <rect x={-tooltipW / 2} y={tooltipRectY} width={tooltipW} height={tooltipH} rx={6} fill="#1f2937" />
                <text x={0} y={tooltipRectY + 16} textAnchor="middle" className="fill-white text-[10px] font-bold">
                  {formatVal(peak.sales)}
                </text>
              </g>
            )}
          </svg>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-4 border-t border-neutral-100 pt-4">
        <div className="text-xs font-semibold text-neutral-500">
          <span className="text-neutral-400">Peak day </span>
          <span className="text-neutral-800">{raw[Math.max(peakIndex, 0)]?.day ?? "—"}</span>
        </div>
        <div className="text-xs font-semibold text-neutral-500">
          <span className="text-neutral-400">Total </span>
          <span className="text-[#22c51f]">{formatVal(totalSales)}</span>
        </div>
        <div className="text-xs font-semibold text-neutral-500">
          <span className="text-neutral-400">Avg. daily </span>
          <span className="text-neutral-800">{formatVal(avgDaily)}</span>
        </div>
      </div>
    </DashboardCard>
  );
}
