interface TableChairProps {
  color: "green" | "orange";
  rotation?: number;
  className?: string;
}

const strokeColors = {
  green: "#6aad5c",
  orange: "#d4956a",
};

/** Top-down chair icon — rounded seat with backrest line */
export function TableChair({ color, rotation = 0, className = "" }: TableChairProps) {
  const stroke = strokeColors[color];

  return (
    <svg
      width={22}
      height={18}
      viewBox="0 0 22 18"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden
    >
      <rect
        x={2}
        y={4}
        width={18}
        height={12}
        rx={4}
        stroke={stroke}
        strokeWidth={2}
        fill="white"
      />
      <line x1={5} y1={4} x2={17} y2={4} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
