import Image from "next/image";
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
    <section className="flex flex-1 flex-col bg-neutral-50 lg:min-h-screen">
      <header className="flex items-center justify-center border-b border-neutral-200/80 bg-white px-6 py-5 lg:hidden">
        <Image src="/logo.svg" alt="Dinely" width={120} height={44} priority />
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
        <div className={`w-full ${wide ? "max-w-xl" : "max-w-[420px]"}`}>
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-sm sm:p-8">
            <div className="mb-8 hidden lg:block">
              <Image src="/logo.svg" alt="Dinely" width={112} height={42} priority />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-[1.75rem]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 sm:text-base">{subtitle}</p>
            {children}
          </div>
          <div className="mt-6">{footer}</div>
        </div>
      </div>
    </section>
  );
}
