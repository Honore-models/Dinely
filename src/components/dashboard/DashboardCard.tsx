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
      className={`overflow-visible rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${paddingMap[padding]} ${className}`}
    >
      {children}
    </article>
  );
}
