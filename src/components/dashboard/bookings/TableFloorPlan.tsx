"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { DashboardCard } from "../DashboardCard";
import { tablesApi } from "@/lib/api";
import { TableChair } from "./TableChair";

interface Table {
  id: string;
  number: number;
  capacity: number;
  location?: string;
  status: "available" | "occupied" | "reserved" | "inactive";
}

type TableStatus = "available" | "occupied" | "reserved" | "inactive";

const tableColors: Record<TableStatus, { surface: string; border: string }> = {
  available: { surface: "#c8e8c0", border: "#a8d49e" },
  occupied: { surface: "#f5dcc8", border: "#e8c4a8" },
  reserved: { surface: "#d4e0f5", border: "#a8b8d4" },
  inactive: { surface: "#e5e5e5", border: "#c0c0c0" },
};

function chairColorForTable(status: TableStatus): "green" | "orange" {
  return status === "available" ? "green" : "orange";
}

interface ChairPlacement {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  transform?: string;
  rotation: number;
}

function getChairPlacements(seats: number, shape: string): ChairPlacement[] {
  if (shape === "circle") {
    const radius = 52.5;
    return Array.from({ length: seats }, (_, i) => {
      const angle = (i / seats) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + radius * Math.cos(rad);
      const y = 50 + radius * Math.sin(rad);
      return {
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        rotation: angle + 90,
      };
    });
  }

  if (shape === "square") {
    return [
      { top: "-14px", left: "50%", transform: "translateX(-50%)", rotation: 0 },
      { top: "50%", right: "-14px", transform: "translateY(-50%)", rotation: 90 },
      { bottom: "-14px", left: "50%", transform: "translateX(-50%)", rotation: 180 },
      { top: "50%", left: "-14px", transform: "translateY(-50%)", rotation: 270 },
    ].slice(0, seats);
  }

  // Rectangle
  const topChairs = Math.ceil(seats / 2);
  const bottomChairs = Math.floor(seats / 2);
  const placements: ChairPlacement[] = [];

  for (let i = 0; i < topChairs; i++) {
    const pct = topChairs === 1 ? 50 : 18 + (i * 64) / (topChairs - 1);
    placements.push({
      top: "-14px",
      left: `${pct}%`,
      transform: "translateX(-50%)",
      rotation: 0,
    });
  }
  for (let i = 0; i < bottomChairs; i++) {
    const pct = bottomChairs === 1 ? 50 : 18 + (i * 64) / (bottomChairs - 1);
    placements.push({
      bottom: "-14px",
      left: `${pct}%`,
      transform: "translateX(-50%)",
      rotation: 180,
    });
  }

  return placements;
}

function getShape(capacity: number): "rect-large" | "circle" | "square" {
  if (capacity <= 2) return "square";
  if (capacity >= 8) return "circle";
  return "rect-large";
}

const containerSize: Record<string, string> = {
  "rect-large": "h-[120px] w-[240px]",
  circle: "h-[150px] w-[150px]",
  square: "h-[120px] w-[120px]",
};

const surfaceSize: Record<string, string> = {
  "rect-large": "h-[80px] w-[200px] rounded-[18px]",
  circle: "h-[120px] w-[120px] rounded-full",
  square: "h-[80px] w-[80px] rounded-[18px]",
};

export function TableFloorPlan() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tablesApi.list();
      setTables((res.data as unknown as Table[]).sort((a, b) => a.number - b.number));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const availableCount = tables.filter((t) => t.status === "available").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;

  return (
    <DashboardCard className="min-w-0 flex-1" padding="lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div>
          <h2 className="text-[15px] font-bold text-neutral-900 dark:text-white">Floor Plan</h2>
          <p className="mt-0.5 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            {tables.length} tables · {availableCount} available
          </p>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-[#a8d49e] bg-[#c8e8c0]" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-[#e8c4a8] bg-[#f5dcc8]" />
            Occupied
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-[#a8b8d4] bg-[#d4e0f5]" />
            Reserved
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-neutral-300" />
        </div>
      ) : tables.length === 0 ? (
        <div className="py-12 text-center text-sm text-neutral-400">
          No tables configured yet
        </div>
      ) : (
        <div
          className="mt-8 px-4 py-8 sm:px-8 rounded-2xl border border-neutral-100 bg-neutral-50/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] overflow-hidden dark:border-neutral-800 dark:bg-neutral-800/50"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-2 md:grid-cols-3">
            {tables.map((table) => {
              const shape = getShape(table.capacity);
              const colors = tableColors[table.status] || tableColors.available;
              const chairColor = chairColorForTable(table.status);
              const placements = getChairPlacements(Math.min(table.capacity, 10), shape);

              return (
                <div key={table.id} className="flex items-center justify-center py-2">
                  <div
                    className={`relative flex items-center justify-center ${containerSize[shape]}`}
                  >
                    <div className={`relative ${surfaceSize[shape]}`}>
                      {/* Chairs */}
                      {placements.map((pos, i) => (
                        <div
                          key={i}
                          className="absolute z-20"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            right: pos.right,
                            bottom: pos.bottom,
                            transform: pos.transform,
                          }}
                        >
                          <TableChair color={chairColor} rotation={pos.rotation} />
                        </div>
                      ))}

                      {/* Table Surface */}
                      <div
                        className="absolute inset-0 z-10 grid place-items-center"
                        style={{
                          backgroundColor: colors.surface,
                          border: `2px solid ${colors.border}`,
                          borderRadius: "inherit",
                        }}
                      >
                        <div className="text-center">
                          <span className="text-sm font-bold tracking-tight text-[#5c5348]">
                            #{table.number}
                          </span>
                          <p className="text-[9px] font-medium text-[#8a7e72]">
                            {table.capacity} seats
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
