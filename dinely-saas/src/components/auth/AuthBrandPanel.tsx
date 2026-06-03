import Image from "next/image";
import { Check } from "lucide-react";

const highlights = [
  "Manage orders in real time",
  "Update menus in seconds",
  "Track performance by shift",
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0f3d12] via-[#1a7a20] to-[#2ecc28] lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-black/10 blur-xl" />

      <Image
        src="/logo.svg"
        alt="Dinely"
        width={128}
        height={46}
        className="relative brightness-0 invert"
        priority
      />

      <div className="relative max-w-sm">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
          Run your restaurant with confidence
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/80 xl:text-base">
          Everything you need to manage orders, menus, and staff — in one place.
        </p>
        <ul className="mt-8 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-white/90">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Check size={14} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Dinely. All rights reserved.</p>
    </aside>
  );
}
