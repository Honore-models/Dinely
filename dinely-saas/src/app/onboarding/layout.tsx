"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { StepperProgress } from "../../components/onboarding/StepperProgress";

function getCurrentStep(pathname: string) {
  const match = pathname.match(/step-(\d)/);
  return match ? Number(match[1]) : 1;
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = getCurrentStep(pathname);
  const backHref = currentStep <= 1 ? "/" : `/onboarding/step-${currentStep - 1}`;

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[392px_1fr]">
      <div className="hidden lg:block">
        <StepperProgress currentStep={currentStep} />
      </div>
      <section className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-md border-2 border-[#22c51f] px-4 py-2 text-base font-bold text-[#22c51f]"
          >
            <ChevronLeft size={20} /> {currentStep === 4 ? "Go back to plans" : "Back"}
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
