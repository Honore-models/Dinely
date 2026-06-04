import { TrendingUp } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  variant?: "primary" | "default";
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  variant = "default",
}: MetricCardProps) {
  const isPrimary = variant === "primary";

  if (isPrimary) {
    return (
      <article className="flex h-full flex-col justify-between rounded-xl bg-gradient-to-br from-[#22c51f] to-[#189816] p-6 text-white shadow-[0_4px_14px_rgba(34,197,31,0.25)]">
        <p className="text-sm font-semibold text-green-50/90">{title}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight lg:text-[2rem]">{value}</p>
        <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-green-50">
          <TrendingUp size={15} />
          <span>↑ {change}%</span>
          <span className="text-green-100/80">{changeLabel}</span>
        </p>
      </article>
    );
  }

  return (
    <DashboardCard className="flex h-full flex-col justify-between" padding="lg">
      <p className="text-sm font-semibold text-neutral-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 lg:text-[2rem]">
        {value}
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#22c51f]">
        <TrendingUp size={15} />
        <span>↑ {change}%</span>
        <span className="font-medium text-neutral-400">{changeLabel}</span>
      </p>
    </DashboardCard>
  );
}
