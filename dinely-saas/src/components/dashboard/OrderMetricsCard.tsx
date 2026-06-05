import React from "react";

interface OrderMetricsCardProps {
  title: string;
  value: string;
  variant?: "warning" | "info" | "success" | "danger" | "default";
}

export default function OrderMetricsCard({
  title,
  value,
  variant = "default",
}: OrderMetricsCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      case "success":
        return "bg-emerald-500 text-white";
      case "danger":
        return "bg-red-500 text-white";
      default:
        return "bg-white text-neutral-900 border border-neutral-200";
    }
  };

  const titleClass =
    variant === "default" ? "text-neutral-500" : "text-white/80";

  return (
    <div className={`rounded-xl p-6 shadow-sm ${getVariantClasses()}`}>
      <p className={`text-sm font-medium ${titleClass}`}>{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
