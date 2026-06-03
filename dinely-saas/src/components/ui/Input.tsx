import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        ) : null}
        <input
          className={`h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_#ffffff] autofill:[-webkit-text-fill-color:#171717] focus:border-[#22c51f] focus:ring-4 focus:ring-green-100/80 ${
            icon ? "pl-11" : ""
          } ${className}`}
          {...props}
        />
      </span>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
