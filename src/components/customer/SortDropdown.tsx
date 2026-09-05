"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SortDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function SortDropdown({ value, options, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 focus:border-[#22c555] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:focus:border-green-600 dark:focus:ring-green-900"
      >
        <span>{value}</span>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg shadow-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-800/50">
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  value === opt
                    ? "bg-green-50 text-[#22c555] dark:bg-green-950/50 dark:text-green-400"
                    : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="flex-1">{opt}</span>
                {value === opt && <Check size={14} className="text-[#22c555]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
