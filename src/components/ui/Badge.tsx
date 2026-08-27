import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-[#22c51f] ${className}`}
    >
      {children}
    </span>
  );
}
