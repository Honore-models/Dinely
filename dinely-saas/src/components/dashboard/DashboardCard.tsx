interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function DashboardCard({
  children,
  className = "",
  padding = "lg",
}: DashboardCardProps) {
  return (
    <article
      className={`overflow-visible rounded-xl border border-neutral-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${paddingMap[padding]} ${className}`}
    >
      {children}
    </article>
  );
}
