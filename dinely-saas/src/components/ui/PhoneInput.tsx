import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { RwandaFlagIcon } from "./Icons";

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  size?: "default" | "compact";
}

export function PhoneInput({ label = "Phone number", error, size = "default", className = "", ...props }: PhoneInputProps) {
  const compact = size === "compact";
  return (
    <label className="block">
      <span className={`block font-medium text-neutral-700 ${compact ? "mb-1 text-xs" : "mb-1.5 text-sm"}`}>
        {label}
      </span>
      <div
        className={`flex overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/50 transition focus-within:border-[#22c51f] focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100/80 ${compact ? "h-10" : "h-12"} ${className}`}
      >
        <button
          type="button"
          aria-label="Select country"
          className={`flex shrink-0 items-center justify-center gap-1.5 border-r border-neutral-200 ${compact ? "w-[4.5rem]" : "w-24"}`}
        >
          <RwandaFlagIcon className={`w-auto rounded-[4px] shadow-sm ${compact ? "h-5" : "h-6"}`} />
          <ChevronDown size={compact ? 16 : 18} />
        </button>
        <input
          className={`min-w-0 flex-1 px-3 outline-none placeholder:text-neutral-400 ${compact ? "text-sm" : "text-base font-medium"}`}
          {...props}
        />
      </div>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
