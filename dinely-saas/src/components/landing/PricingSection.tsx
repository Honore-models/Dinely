import { Check } from "lucide-react";
import { Button } from "../ui/Button";

const features = ["Live bookings", "Menu control", "Customer insights"];

export function PricingSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-xl border border-green-100 bg-green-50/40 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#22c51f]">Restaurant owners</p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-950">Start managing smarter today.</h2>
          <div className="mt-5 flex flex-wrap gap-4">
            {features.map((feature) => (
              <span key={feature} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Check size={17} className="text-[#22c51f]" />
                {feature}
              </span>
            ))}
          </div>
        </div>
        <Button href="/onboarding/step-1" className="shrink-0">
          Get Started as a Restaurant
        </Button>
      </div>
    </section>
  );
}
