import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthFormPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  wide?: boolean;
}

export function AuthFormPanel({ title, subtitle, children, footer, wide }: AuthFormPanelProps) {
  return (
    <main className="relative flex min-h-screen flex-col bg-neutral-50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-green-50/80 to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-14">
        <div className={`w-full ${wide ? "max-w-lg" : "max-w-[400px]"}`}>
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-sm sm:p-9">
            <Link href="/" className="mb-8 inline-block">
              <Image src="/logo.svg" alt="Dinely" width={120} height={44} priority />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">{subtitle}</p>
            {children}
          </div>
          <div className="mt-6">{footer}</div>
        </div>
      </div>
    </main>
  );
}
