import ServicesStats from "./ServicesStats";

type Stat = {
  value: string;
  label: string;
};

type Props = {
  badgeText?: string;
  title: string;
  subtitle: string;
  stats: Stat[];
};

export default function ServicesHero({ badgeText = "Comprehensive Cleaning Solutions", title, subtitle, stats }: Props) {
  return (
    <section className="text-center mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-6">
        <span className="w-2 h-2 bg-[color:var(--brand-primary,#296276)] rounded-full animate-pulse" />
        <span className="text-[color:var(--brand-primary,#296276)] font-semibold text-sm">{badgeText}</span>
      </div>

      <h1 className="font-[var(--font-playfair)] text-5xl md:text-6xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{subtitle}</p>

      <ServicesStats stats={stats} />
    </section>
  );
}