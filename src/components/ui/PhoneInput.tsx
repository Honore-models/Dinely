"use client";

import { forwardRef, useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import {
  countries,
  DEFAULT_COUNTRY,
  searchCountries,
  type Country,
} from "@/lib/countries";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  label?: string;
  error?: string;
  size?: "default" | "compact";
  /** Full phone number including dial code, e.g. "+250784955081" */
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  onCountryChange?: (country: Country) => void;
}

/**
 * Try to match a raw phone string against known dial codes.
 * Returns the longest matching country, or undefined.
 */
function detectCountryFromNumber(raw: string): Country | undefined {
  const stripped = raw.replace(/[^0-9+]/g, "");
  if (!stripped.startsWith("+")) return undefined;
  const digits = stripped.slice(1); // strip leading +
  // Sort countries by dial code length descending so we match longest first
  const sorted = [...countries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length,
  );
  return sorted.find((c) => digits.startsWith(c.dialCode.slice(1))); // dialCode includes +
}

/**
 * Given a full phone number value and the current dial code,
 * return just the local number part (without the dial code and without +).
 */
function stripDialCode(full: string, dialCode: string): string {
  const stripped = full.replace(/[^0-9]/g, "");
  const dialDigits = dialCode.replace(/[^0-9]/g, "");
  if (stripped.startsWith(dialDigits)) {
    return stripped.slice(dialDigits.length);
  }
  return full.replace(/[^0-9\s\-()]/g, "");
}

/**
 * Format a local number string with spaces for readability.
 * e.g. "784955081" -> "784 955 081"
 */
function formatLocalNumber(num: string): string {
  const digits = num.replace(/[^0-9]/g, "");
  if (digits.length <= 3) return digits;
  // Group in chunks of 3 from the right
  const parts: string[] = [];
  let remaining = digits;
  while (remaining.length > 3) {
    parts.unshift(remaining.slice(-3));
    remaining = remaining.slice(0, -3);
  }
  if (remaining) parts.unshift(remaining);
  return parts.join(" ");
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
      onCountryChange,
      name,
      ...props
    },
    ref,
  ) => {
    const compact = size === "compact";
    const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Derive the local number (display value) from the full value
    const localNumber = stripDialCode(value, selectedCountry.dialCode);

    const filtered = searchCountries(searchQuery);

    const selectCountry = useCallback(
      (country: Country) => {
        // Preserve the local number and rebuild the full value with the new dial code
        const local = stripDialCode(value, selectedCountry.dialCode);
        const digits = local.replace(/[^0-9]/g, "");
        const fullNumber = digits ? country.dialCode + digits : "";
        setSelectedCountry(country);
        setDropdownOpen(false);
        setSearchQuery("");
        onCountryChange?.(country);
        // Emit the new full value
        onChange?.({ target: { value: fullNumber, name } });
      },
      [onCountryChange, value, selectedCountry.dialCode, name, onChange],
    );

    // Auto-detect country from the value when it starts with +
    useEffect(() => {
      if (!value) return;
      const detected = detectCountryFromNumber(value);
      if (detected && (detected.code !== selectedCountry.code || detected.dialCode !== selectedCountry.dialCode)) {
        setSelectedCountry(detected);
      }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close dropdown on outside click
    useEffect(() => {
      if (!dropdownOpen) return;
      const handler = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setDropdownOpen(false);
          setSearchQuery("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [dropdownOpen]);

    // Focus search when dropdown opens
    useEffect(() => {
      if (dropdownOpen) {
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    }, [dropdownOpen]);

    // Handle phone input change: prepend the dial code to whatever the user types
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/[^0-9]/g, "");
      if (!digits) {
        onChange?.({ target: { value: "", name } });
        return;
      }
      const fullNumber = selectedCountry.dialCode + digits;
      onChange?.({ target: { value: fullNumber, name } });
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
          {/* Country selector button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className={`flex h-full items-center gap-1.5 border-r border-neutral-200 px-2 transition hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700 ${
                compact ? "min-w-[4.5rem]" : "min-w-24"
              }`}
            >
              <span className="text-base">{selectedCountry.flag}</span>
              <span className={`font-medium text-neutral-700 dark:text-neutral-300 ${compact ? "text-xs" : "text-sm"}`}>
                {selectedCountry.dialCode}
              </span>
              <ChevronDown
                size={compact ? 12 : 14}
                className={`shrink-0 text-neutral-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                {/* Search */}
                <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
                  <Search size={14} className="shrink-0 text-neutral-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country..."
                    className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="shrink-0 text-neutral-400 hover:text-neutral-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Country list */}
                <div className="max-h-64 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="py-4 text-center text-sm text-neutral-500">
                      No countries found
                    </div>
                  ) : (
                    filtered.map((country) => (
                      <button
                        key={country.code + country.dialCode}
                        type="button"
                        onClick={() => selectCountry(country)}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-green-50 dark:hover:bg-green-950/50 ${
                          selectedCountry.code === country.code && selectedCountry.dialCode === country.dialCode
                            ? "bg-green-50 dark:bg-green-950/50"
                            : ""
                        }`}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-white">
                          {country.name}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {country.dialCode}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
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
          <span className="mt-1 block text-xs text-red-500 dark:text-red-400">{error}</span>
        ) : null}
      </label>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
