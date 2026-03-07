import ServiceCard from "./ServiceCard";

type Service = {
  value: string;
  title: string;
  emoji: string;
  price: string;
  description: string;
  bullets: string[];
};

export default function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section className="mb-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.value} service={service} />
        ))}
      </div>
    </section>
  );
}