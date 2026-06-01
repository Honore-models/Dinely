"use client";

import { Award, Check } from "lucide-react";
import type { PlanName } from "../../store/onboardingStore";

interface PlanCardProps {
  name: PlanName;
  price: number;
  description: string;
  features: string[];
  isRecommended?: boolean;
  isSelected: boolean;
  onClick: (plan: PlanName) => void;
}

export function PlanCard({
  name,
  price,
  description,
  features,
  isRecommended = false,
  isSelected,
  onClick,
}: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      className={`flex min-h-[340px] w-full flex-col rounded-xl border bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
        isSelected ? "border-2 border-[#22c51f] shadow-md shadow-green-100" : "border-green-200"
      }`}
    >
      <div className="rounded-xl border border-green-100 bg-green-50/20 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#22c51f]">{name} Plan</h3>
            <p className="mt-1 text-xs font-semibold text-neutral-500">{description}</p>
          </div>
          {isRecommended ? <Award className="shrink-0 fill-yellow-300 text-yellow-400" size={22} /> : null}
        </div>
        <p className="mt-4 text-sm font-semibold text-neutral-700">
          <span className="text-2xl font-bold text-orange-400">${price}</span> Per Month
        </p>
        <span className="mx-auto mt-5 block w-fit rounded bg-[#22c51f] px-3 py-1 text-[11px] font-bold text-white">
          Select {name}
        </span>
      </div>
      <ul className="mt-7 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-4 text-sm font-bold text-black">
            <Check size={20} className="shrink-0 text-[#22c51f]" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
}
