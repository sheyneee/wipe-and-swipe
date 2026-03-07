import Link from "next/link";

type Service = {
  value: string;
  title: string;
  emoji: string;
  price: string;
  description: string;
  bullets: string[];
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full">
      
      {/* Top Content */}
      <div>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg text-3xl"
          style={{
            background: "linear-gradient(135deg, #296276 0%, #266075 100%)",
            boxShadow: "0 10px 20px rgba(41, 98, 118, 0.3)",
          }}
        >
          <span aria-hidden="true">{service.emoji}</span>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {service.emoji} {service.title}
        </h3>

        <p className="text-[color:var(--brand-primary,#296276)] font-semibold text-lg mb-4">
          {service.price}
        </p>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {service.description}
        </p>

        <ul className="space-y-2 text-gray-600 text-sm mb-7">
          {service.bullets.slice(0, 4).map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="font-bold text-[color:var(--brand-primary,#296276)]">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button pushed to bottom */}
      <Link
        href={`/services/${service.value}`}
        className="mt-auto block w-full text-center py-3 bg-[color:rgba(41,98,118,0.10)] text-[color:var(--brand-primary,#296276)] font-semibold rounded-lg transition-all duration-300 hover:bg-[color:var(--brand-primary,#296276)] hover:text-white"
      >
        View Details
      </Link>
    </article>
  );
}