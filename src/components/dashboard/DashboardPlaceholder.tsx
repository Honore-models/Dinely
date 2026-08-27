import { DashboardCard } from "./DashboardCard";
import { DashboardPageHeader } from "./DashboardPageHeader";

interface DashboardPlaceholderProps {
  title: string;
  description?: string;
}

export function DashboardPlaceholder({ title, description }: DashboardPlaceholderProps) {
  return (
    <>
      <DashboardPageHeader title={title} description={description} />
      <DashboardCard className="flex min-h-[320px] flex-col items-center justify-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-green-50 text-[#22c51f]">
          <span className="text-2xl">◇</span>
        </div>
        <p className="mt-4 text-base font-bold text-neutral-800">Coming soon</p>
        <p className="mt-2 max-w-sm text-sm font-medium text-neutral-500">
          This section is in your navigation and will be available in a future update.
        </p>
      </DashboardCard>
    </>
  );
}
