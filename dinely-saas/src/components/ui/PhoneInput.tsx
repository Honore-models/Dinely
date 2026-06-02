import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { RwandaFlagIcon } from "./Icons";

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PhoneInput({ label = "Phone Number", error, className = "", ...props }: PhoneInputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-base font-semibold text-black">{label}</span>
      <div
        className={`flex h-11 overflow-hidden rounded-lg border border-neutral-200 bg-white transition focus-within:border-[#22c51f] focus-within:ring-4 focus-within:ring-green-100 ${className}`}
      >
        <button
          type="button"
          aria-label="Select country"
          className="flex w-24 shrink-0 items-center justify-center gap-2 border-r border-neutral-200"
        >
          <RwandaFlagIcon className="h-6 w-auto rounded-[4px] shadow-sm" />
          <ChevronDown size={18} />
        </button>
        <input
          className="min-w-0 flex-1 px-4 text-base font-medium outline-none placeholder:text-neutral-400"
          {...props}
        />
      </div>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
