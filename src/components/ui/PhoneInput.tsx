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
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  onCountryChange?: (country: Country) => void;
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

    const filtered = searchCountries(searchQuery);

    const selectCountry = useCallback(
      (country: Country) => {
        setSelectedCountry(country);
        setDropdownOpen(false);
        setSearchQuery("");
        onCountryChange?.(country);
      },
      [onCountryChange],
    );

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

    // Handle phone input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Strip any leading dial code that the user might type
      const cleaned = raw.replace(/[^0-9+\-\s()]/g, "");
      onChange?.({ target: { value: cleaned, name } });
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
            value={value}
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
