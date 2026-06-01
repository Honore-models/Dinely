import { Check } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Owner Info",
    description: "Set up your account to manage your restaurant. This information is used to access your dashboard.",
  },
  {
    number: 2,
    title: "Restaurant Info",
    description: "Tell us about your restaurant so we can set up your workspace and customize your experience.",
  },
  {
    number: 3,
    title: "Plan Selection",
    description: "Select a plan that fits your business needs. You can upgrade or change it anytime.",
  },
  {
    number: 4,
    title: "Payment / Confirmation",
    description: "Secure your plan to unlock all features and start managing your restaurant.",
  },
];

interface StepperProgressProps {
  currentStep: number;
}

export function StepperProgress({ currentStep }: StepperProgressProps) {
  return (
    <aside className="flex h-full flex-col justify-center rounded-r-2xl bg-green-50/40 px-10 py-10 shadow-md shadow-neutral-200">
      <div className="space-y-7">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="relative flex gap-4">
              {index < steps.length - 1 ? (
                <div className="absolute left-[14px] top-10 h-[86px] w-px bg-green-200" />
              ) : null}
              <div
                className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${
                  isCompleted || isActive
                    ? "border-[#22c51f] bg-[#22c51f] text-white"
                    : "border-[#22c51f] bg-white text-[#22c51f]"
                }`}
              >
                {isCompleted ? <Check size={16} /> : step.number}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isActive ? "text-black" : "text-neutral-950"}`}>{step.title}</h2>
                <p className="mt-2 max-w-xs text-sm font-medium leading-snug text-neutral-600">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
