"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

const RWANDA_DIAL_CODE = "+250";
const RWANDA_FLAG = "🇷🇼";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  label?: string;
  error?: string;
  size?: "default" | "compact";
  /** Full phone number including dial code, e.g. "+250784955081" */
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

function stripDialCode(full: string): string {
  const digits = full.replace(/[^0-9]/g, "");
  if (digits.startsWith("250")) {
    return digits.slice(3);
  }
  return full.replace(/[^0-9]/g, "");
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label = "Phone number",
      error,
      size = "default",
      className = "",
      value = "",
      onChange,
      name,
      ...props
    },
    ref,
  ) => {
    const compact = size === "compact";
    const localNumber = stripDialCode(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/[^0-9]/g, "");
      if (!digits) {
        onChange?.({ target: { value: "", name } });
        return;
      }
      onChange?.({ target: { value: RWANDA_DIAL_CODE + digits, name } });
    };

    return (
      <label className="block">
        <span
          className={`block font-medium text-neutral-700 dark:text-neutral-300 ${
            compact ? "mb-1 text-xs" : "mb-1.5 text-sm"
          }`}
        >
          {label}
        </span>
        <div
          className={`flex overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/50 transition focus-within:border-[#22c51f] focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100/80 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:border-[#22c555] dark:focus-within:bg-neutral-900 dark:focus-within:ring-green-900 ${
            compact ? "h-10" : "h-12"
          } ${error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100 dark:border-red-700" : ""} ${className}`}
        >
          {/* Fixed Rwanda prefix */}
          <div
            className={`flex items-center gap-1.5 border-r border-neutral-200 px-2 dark:border-neutral-600 ${
              compact ? "min-w-[4.5rem]" : "min-w-24"
            }`}
          >
            <span className="text-base">{RWANDA_FLAG}</span>
            <span
              className={`font-medium text-neutral-700 dark:text-neutral-300 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {RWANDA_DIAL_CODE}
            </span>
          </div>

          {/* Phone number input */}
          <input
            ref={ref}
            type="tel"
            value={localNumber}
            onChange={handleInputChange}
            className={`min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500 ${
              compact ? "text-sm" : "text-base font-medium"
            }`}
            {...props}
          />
        </div>
        {error ? (
          <span className="mt-1 block text-xs text-red-500 dark:text-red-400">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
