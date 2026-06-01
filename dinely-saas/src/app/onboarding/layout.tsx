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
    <main className="grid min-h-screen bg-white lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr]">
      <div className="hidden lg:block">
        <StepperProgress currentStep={currentStep} />
      </div>
      <section className="px-5 py-5 lg:px-7">
        <div className="mx-auto max-w-[920px]">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-md border-2 border-[#22c51f] px-4 py-1.5 text-sm font-bold text-[#22c51f]"
          >
            <ChevronLeft size={20} /> {currentStep === 4 ? "Go back to plans" : "Back"}
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
