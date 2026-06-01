import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PhoneInput({ label = "Phone Number", error, className = "", ...props }: PhoneInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-semibold text-black">{label}</span>
      <div
        className={`flex h-[52px] overflow-hidden rounded-lg border border-neutral-200 bg-white transition focus-within:border-[#22c51f] focus-within:ring-4 focus-within:ring-green-100 ${className}`}
      >
        <button
          type="button"
          aria-label="Select country"
          className="flex w-24 shrink-0 items-center justify-center gap-2 border-r border-neutral-200"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#72c652] text-sm">RW</span>
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
