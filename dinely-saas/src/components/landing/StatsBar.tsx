const stats = [
  { value: "1.8M+", label: "Monthly diners" },
  { value: "12K+", label: "Restaurant partners" },
  { value: "98%", label: "Booking uptime" },
  { value: "4.8/5", label: "Average rating" },
];

export function StatsBar() {
  return (
    <section className="border-y border-neutral-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-[#22c51f]">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
