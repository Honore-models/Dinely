"use client";

export default function OnboardingTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-[fadeSlideUp_0.5s_ease-out_forwards]">
      {children}
    </div>
  );
}
