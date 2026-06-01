import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-semibold text-black">{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        ) : null}
        <input
          className={`h-[52px] w-full rounded-lg border border-neutral-200 bg-white px-4 text-base font-medium outline-none transition placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-4 focus:ring-green-100 ${
            icon ? "pl-12" : ""
          } ${className}`}
          {...props}
        />
      </span>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
