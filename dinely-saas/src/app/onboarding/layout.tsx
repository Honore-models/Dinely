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
    <main className="grid h-screen overflow-hidden bg-white lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr]">
      <div className="hidden lg:block">
        <StepperProgress currentStep={currentStep} />
      </div>
      <section className="overflow-y-auto px-4 py-8 lg:px-8">
        <div className="mx-auto flex min-h-full w-full max-w-[960px] flex-col justify-center">
          <Link
            href={backHref}
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-md border-2 border-[#22c51f] px-4 py-1.5 text-sm font-bold text-[#22c51f] transition-colors hover:bg-green-50"
          >
            <ChevronLeft size={20} /> {currentStep === 4 ? "Go back to plans" : "Back"}
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
