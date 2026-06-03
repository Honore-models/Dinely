import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  size?: "default" | "compact";
}

const inputSizes = {
  default: { label: "mb-1.5 text-sm", field: "h-12 text-sm" },
  compact: { label: "mb-1 text-xs", field: "h-10 text-sm" },
};

export function Input({ label, error, icon, size = "default", className = "", ...props }: InputProps) {
  const s = inputSizes[size];
  return (
    <label className="block">
      <span className={`block font-medium text-neutral-700 ${s.label}`}>{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        ) : null}
        <input
          className={`w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 text-neutral-900 outline-none transition placeholder:text-neutral-400 autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_#ffffff] autofill:[-webkit-text-fill-color:#171717] focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80 ${s.field} ${
            icon ? "pl-10" : ""
          } ${className}`}
          {...props}
        />
      </span>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
