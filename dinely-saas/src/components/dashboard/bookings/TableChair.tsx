interface TableChairProps {
  color: "green" | "orange";
  rotation?: number;
  className?: string;
}

const strokeColors = {
  green: "#6aad5c",
  orange: "#d4956a",
};

const fillColors = {
  green: "#f2faf0",
  orange: "#fdf8f4",
};

/** Top-down chair icon — modern rounded seat with curved backrest */
export function TableChair({ color, rotation = 0, className = "" }: TableChairProps) {
  const stroke = strokeColors[color];
  const fill = fillColors[color];

  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden
    >
      {/* Rounded Chair Seat */}
      <rect
        x={3}
        y={7}
        width={16}
        height={12}
        rx={4}
        stroke={stroke}
        strokeWidth={1.5}
        fill={fill}
      />
      {/* Modern Curved Backrest */}
      <path
        d="M 3 8 Q 11 3 19 8"
        stroke={stroke}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
