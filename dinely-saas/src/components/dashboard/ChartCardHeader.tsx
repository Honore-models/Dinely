interface ChartCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function ChartCardHeader({ title, subtitle, action }: ChartCardHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
      <div>
        <h2 className="text-[15px] font-bold text-neutral-900">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs font-medium text-neutral-400">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
