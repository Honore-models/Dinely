interface DashboardSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ title, children, className = "" }: DashboardSectionProps) {
  return (
    <section className={className}>
      {title ? (
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
