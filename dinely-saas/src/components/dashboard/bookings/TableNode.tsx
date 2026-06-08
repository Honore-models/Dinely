import type { FloorTable } from "@/lib/dashboard/mockData";
import { TableChair } from "./TableChair";

const tableColors = {
  available: {
    surface: "#c8e8c0",
    border: "#a8d49e",
  },
  "on-dine": {
    surface: "#f5dcc8",
    border: "#e8c4a8",
  },
};

function chairColorForTable(status: FloorTable["status"]): "green" | "orange" {
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

function getChairPlacements(table: FloorTable): ChairPlacement[] {
  const count = table.shape === "circle" ? 10 : table.seats;

  if (table.shape === "circle") {
    const radius = 52.5; // percent radius of the table surface to give a clean tucked-in look (8px overlap)
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360 - 90;
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

  if (table.shape === "square") {
    return [
      { top: "-14px", left: "50%", transform: "translateX(-50%)", rotation: 0 },
      { top: "50%", right: "-14px", transform: "translateY(-50%)", rotation: 90 },
      { bottom: "-14px", left: "50%", transform: "translateX(-50%)", rotation: 180 },
      { top: "50%", left: "-14px", transform: "translateY(-50%)", rotation: 270 },
    ];
  }

  return [
    { top: "-14px", left: "18%", transform: "translateX(-50%)", rotation: 0 },
    { top: "-14px", left: "50%", transform: "translateX(-50%)", rotation: 0 },
    { top: "-14px", left: "82%", transform: "translateX(-50%)", rotation: 0 },
    { bottom: "-14px", left: "18%", transform: "translateX(-50%)", rotation: 180 },
    { bottom: "-14px", left: "50%", transform: "translateX(-50%)", rotation: 180 },
    { bottom: "-14px", left: "82%", transform: "translateX(-50%)", rotation: 180 },
  ];
}

const containerSize = {
  "rect-large": "h-[120px] w-[240px]",
  circle: "h-[150px] w-[150px]",
  square: "h-[120px] w-[120px]",
};

const surfaceSize = {
  "rect-large": "h-[80px] w-[200px] rounded-[18px]",
  circle: "h-[120px] w-[120px] rounded-full",
  square: "h-[80px] w-[80px] rounded-[18px]",
};

interface TableNodeProps {
  table: FloorTable;
}

export function TableNode({ table }: TableNodeProps) {
  const colors = tableColors[table.status];
  const chairColor = chairColorForTable(table.status);
  const placements = getChairPlacements(table);

  return (
    <div className="flex items-center justify-center py-2">
      <div
        className={`relative flex items-center justify-center ${containerSize[table.shape]}`}
      >
        {/* Surface-relative wrapper */}
        <div className={`relative ${surfaceSize[table.shape]}`}>
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
            <span className="text-sm font-bold tracking-tight text-[#5c5348]">{table.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
