import Link from "next/link";

export default function ServicesCta({
  title,
  subtitle,
  primaryHref = "/book-now",
  primaryLabel = "Book For A Free Quote",
  secondaryHref = "/contact",
  secondaryLabel = "Get in Touch",
}: {
  title: string;
  subtitle: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section
      className="rounded-3xl p-8 md:p-12 text-white text-center"
      style={{ background: "linear-gradient(90deg, #296276 0%, #266075 50%, #283955 100%)" }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-xl opacity-90 mb-8">{subtitle}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href={primaryHref}
          className="px-8 py-4 bg-white text-[color:var(--brand-primary,#296276)] font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          {primaryLabel}
        </Link>

        <Link
          href={secondaryHref}
          className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}