"use client";

import { salesChartData } from "../../lib/dashboard/mockData";
import { ChartCardHeader } from "./ChartCardHeader";
import { DashboardCard } from "./DashboardCard";

const WIDTH = 520;
const HEIGHT = 248;
const PAD = { top: 48, right: 16, bottom: 32, left: 44 };
const chartW = WIDTH - PAD.left - PAD.right;
const chartH = HEIGHT - PAD.top - PAD.bottom;

function formatSales(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

export function SalesChart() {
  const max = Math.max(...salesChartData.map((d) => d.value));
  const peakIndex = salesChartData.findIndex((d) => d.value === max);
  const yTicks = [0, 25, 50, 75, 100];

  const points = salesChartData.map((d, i) => {
    const x = PAD.left + (i / (salesChartData.length - 1)) * chartW;
    const y = PAD.top + chartH - (d.value / max) * chartH;
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + chartH} L ${points[0].x} ${PAD.top + chartH} Z`;

  const peak = points[peakIndex];
  const tooltipH = 24;
  const tooltipW = 80;
  const showTooltipBelow = peak.y < PAD.top + tooltipH + 8;
  const tooltipY = showTooltipBelow ? peak.y + 12 : peak.y - 12;
  const tooltipRectY = showTooltipBelow ? tooltipY : tooltipY - tooltipH;

  return (
    <DashboardCard className="h-full">
      <ChartCardHeader
        title="Sales Overview"
        subtitle="Weekly revenue performance"
        action={
          <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-[#22c51f]">
            This week
          </span>
        }
      />

      <div className="overflow-x-auto overflow-y-visible">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full min-w-[320px] overflow-visible"
          role="img"
          aria-label="Weekly sales line chart"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c51f" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22c51f" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="salesLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7cc243" />
              <stop offset="100%" stopColor="#22c51f" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = PAD.top + chartH - (tick / 100) * chartH;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={PAD.left + chartW}
                  y2={y}
                  stroke="#f0f0f0"
                  strokeWidth={1}
                  strokeDasharray={tick === 0 ? undefined : "4 4"}
                />
                <text
                  x={PAD.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-neutral-400 text-[10px] font-semibold"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#salesArea)" />
          <path
            d={linePath}
            fill="none"
            stroke="url(#salesLine)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={p.day}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === peakIndex ? 6 : 4}
                fill="white"
                stroke={i === peakIndex ? "#22c51f" : "#a8d49e"}
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={HEIGHT - 10}
                textAnchor="middle"
                className="fill-neutral-500 text-[11px] font-semibold"
              >
                {p.day}
              </text>
            </g>
          ))}

          <g transform={`translate(${peak.x}, 0)`}>
            <rect
              x={-tooltipW / 2}
              y={tooltipRectY}
              width={tooltipW}
              height={tooltipH}
              rx={6}
              fill="#1f2937"
            />
            <text
              x={0}
              y={tooltipRectY + 16}
              textAnchor="middle"
              className="fill-white text-[10px] font-bold"
            >
              {peak.value}% · {formatSales(peak.sales)}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 border-t border-neutral-100 pt-4">
        <div className="text-xs font-semibold text-neutral-500">
          <span className="text-neutral-400">Peak day</span>{" "}
          <span className="text-neutral-800">{salesChartData[peakIndex].day}</span>
        </div>
        <div className="text-xs font-semibold text-neutral-500">
          <span className="text-neutral-400">Total</span>{" "}
          <span className="text-[#22c51f]">
            {formatSales(salesChartData.reduce((s, d) => s + d.sales, 0))}
          </span>
        </div>
        <div className="text-xs font-semibold text-neutral-500">
          <span className="text-neutral-400">Avg. daily</span>{" "}
          <span className="text-neutral-800">
            {formatSales(
              Math.round(salesChartData.reduce((s, d) => s + d.sales, 0) / salesChartData.length),
            )}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
