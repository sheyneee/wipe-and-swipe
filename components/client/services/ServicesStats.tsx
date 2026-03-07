type Stat = {
  value: string;
  label: string;
};

export default function ServicesStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="text-3xl font-bold text-[color:var(--brand-primary,#296276)] mb-2">{s.value}</div>
          <p className="text-gray-600 font-medium text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}