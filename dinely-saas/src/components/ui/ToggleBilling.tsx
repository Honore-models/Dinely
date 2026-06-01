"use client";

interface ToggleBillingProps {
  value: "yearly" | "monthly";
  onChange: (value: "yearly" | "monthly") => void;
}

export function ToggleBilling({ value, onChange }: ToggleBillingProps) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-100 bg-white p-1 shadow-sm">
      {(["yearly", "monthly"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition ${
            value === option ? "bg-[#78d96d] text-white" : "text-neutral-900 hover:bg-neutral-50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
