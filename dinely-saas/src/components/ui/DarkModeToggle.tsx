"use client";

import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function DarkModeToggle({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    { value: "light" as const, icon: Sun, label: "Light", description: "Light appearance" },
    { value: "dark" as const, icon: Moon, label: "Dark", description: "Dark appearance" },
    { value: "system" as const, icon: Monitor, label: "System", description: "Match device setting" },
  ];

  const current = options.find((o) => o.value === theme) || options[2];
  const CurrentIcon = current.icon;

  if (variant === "compact") {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          title={`Theme: ${current.label}`}
          className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-all hover:bg-neutral-50 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <CurrentIcon size={15} />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Theme
              </p>
            </div>
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    isActive
                      ? "bg-green-50 text-[#22c51f] dark:bg-green-950 dark:text-green-400"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <Icon size={16} />
                  <div className="flex-1">
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{opt.description}</p>
                  </div>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-[#22c51f]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        <CurrentIcon size={17} />
        <span>{current.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
          <div className="px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Theme
            </p>
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                  isActive
                    ? "bg-green-50 text-[#22c51f] dark:bg-green-950 dark:text-green-400"
                    : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Icon size={16} />
                <div className="flex-1">
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{opt.description}</p>
                </div>
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-[#22c51f]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
