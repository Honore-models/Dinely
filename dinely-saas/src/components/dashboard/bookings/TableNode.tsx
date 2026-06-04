import type { FloorTable } from "../../../lib/dashboard/mockData";
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
  return status === "available" ? "orange" : "green";
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
    const radius = 92;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + (radius / 2.1) * Math.cos(rad);
      const y = 50 + (radius / 2.1) * Math.sin(rad);
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
      { top: "0%", left: "50%", transform: "translate(-50%, -100%)", rotation: 0 },
      { top: "50%", right: "0%", transform: "translate(100%, -50%)", rotation: 90 },
      { bottom: "0%", left: "50%", transform: "translate(-50%, 100%)", rotation: 180 },
      { top: "50%", left: "0%", transform: "translate(-100%, -50%)", rotation: 270 },
    ];
  }

  return [
    { top: "0%", left: "15%", transform: "translate(-50%, -100%)", rotation: 0 },
    { top: "0%", left: "50%", transform: "translate(-50%, -100%)", rotation: 0 },
    { top: "0%", left: "85%", transform: "translate(-50%, -100%)", rotation: 0 },
    { bottom: "0%", left: "15%", transform: "translate(-50%, 100%)", rotation: 180 },
    { bottom: "0%", left: "50%", transform: "translate(-50%, 100%)", rotation: 180 },
    { bottom: "0%", left: "85%", transform: "translate(-50%, 100%)", rotation: 180 },
  ];
}

const containerSize = {
  "rect-large": "min-h-[160px] min-w-[280px]",
  circle: "min-h-[200px] min-w-[200px]",
  square: "min-h-[150px] min-w-[150px]",
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
    <div className="flex items-center justify-center py-4">
      <div
        className={`relative flex items-center justify-center ${containerSize[table.shape]}`}
      >
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

        <div
          className={`relative z-10 grid place-items-center ${surfaceSize[table.shape]}`}
          style={{
            backgroundColor: colors.surface,
            border: `2px solid ${colors.border}`,
          }}
        >
          <span className="text-sm font-bold tracking-tight text-[#5c5348]">{table.label}</span>
        </div>
      </div>
    </div>
  );
}
