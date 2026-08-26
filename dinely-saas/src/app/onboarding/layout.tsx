"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { StepperProgress } from "@/components/onboarding/StepperProgress";

function getCurrentStep(pathname: string) {
  const match = pathname.match(/step-(\d)/);
  return match ? Number(match[1]) : 1;
}

const stepLabels = ["Owner Info", "Restaurant", "Plan", "Payment"];

function MobileStepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-1.5 px-1 pb-4 lg:hidden">
      {stepLabels.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        return (
          <div key={label} className="flex flex-1 items-center gap-1.5">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                isCompleted
                  ? "bg-[#22c51f] text-white"
                  : isActive
                    ? "bg-[#22c51f] text-white ring-2 ring-green-200"
                    : "border-2 border-green-200 text-green-600"
              }`}
            >
              {isCompleted ? "✓" : stepNum}
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className={`h-0.5 flex-1 rounded-full transition-colors ${
                  stepNum < currentStep ? "bg-[#22c51f]" : "bg-green-100"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
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
      <section className="overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto flex min-h-full w-full max-w-[960px] flex-col justify-center">
          <MobileStepIndicator currentStep={currentStep} />
          <Link
            href={backHref}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-md border-2 border-[#22c51f] px-4 py-1.5 text-sm font-bold text-[#22c51f] transition-colors hover:bg-green-50"
          >
            <ChevronLeft size={20} /> {currentStep === 4 ? "Go back to plans" : "Back"}
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
