import Link from "next/link";
import type { ReactNode } from "react";
import { DinelyLogo } from "../brand/DinelyLogo";
import { AuthBrandPanel } from "./AuthBrandPanel";

interface AuthFormPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  wide?: boolean;
}

export function AuthFormPanel({ title, subtitle, children, footer, wide }: AuthFormPanelProps) {
  return (
    <main className="fixed inset-0 grid overflow-hidden bg-white lg:grid-cols-[minmax(300px,38%)_1fr]">
      <AuthBrandPanel />

      <section className="flex min-h-0 flex-col overflow-hidden">
        <header className="shrink-0 px-5 pt-4 sm:px-8 lg:hidden">
          <Link href="/">
            <DinelyLogo width={108} height={40} priority />
          </Link>
        </header>

        <div className="flex min-h-0 flex-1 flex-col justify-center px-5 py-2 sm:px-8 lg:px-12 lg:py-0 xl:px-16">
          <div className={`mx-auto w-full ${wide ? "max-w-xl" : "max-w-[380px]"}`}>
            <div className="mb-4 sm:mb-5">
              <h1 className="text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">{title}</h1>
              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{subtitle}</p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-[#22c51f]" />
            </div>

            {children}
          </div>
        </div>

        <footer className="shrink-0 px-5 pb-4 pt-1 max-[700px]:pb-3 sm:px-8 lg:px-12 xl:px-16">{footer}</footer>
      </section>
    </main>
  );
}
