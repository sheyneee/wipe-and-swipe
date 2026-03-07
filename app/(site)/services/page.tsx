import { SERVICES } from "@/lib/data/services";
import ServicesHero from "@/components/client/services/ServicesHero";
import ServicesGrid from "@/components/client/services/ServicesGrid";
import WhyChoose from "@/components/client/services/WhyChoose";
import ServicesCta from "@/components/client/services/ServicesCta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Cleaning Services",
  description:
    "Explore professional residential and commercial cleaning services from Wipe & Swipe Cleaning Services Ltd. Reliable, eco-friendly, and affordable solutions for every space.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="pt-24 pb-16 px-6 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto">
        <ServicesHero
          title="Professional Cleaning Services"
          subtitle="Complete solutions for every space. From residential homes to commercial offices, we deliver consistent excellence."
          stats={[
            { value: "9", label: "Services Available" },
            { value: "500+", label: "Happy Clients" },
            { value: "5★", label: "Client Ratings" },
            { value: "24/7", label: "Booking Support" },
          ]}
        />

        <ServicesGrid services={SERVICES} />

        <WhyChoose
          reasons={[
            {
              title: "Professional Excellence",
              desc: "Trained, experienced team delivering consistent high-quality cleaning across every service and every visit.",
            },
            {
              title: "100% Reliability",
              desc: "We show up on time, communicate clearly, and deliver exactly what we promise, every single time.",
            },
            {
              title: "Competitive Pricing",
              desc: "Transparent, affordable pricing with no hidden fees. You get strong value for every dollar spent.",
            },
            {
              title: "Eco-Friendly Solutions",
              desc: "We use safe, environmentally conscious products that protect your family and our environment.",
            },
            { title: "Local and Personal", desc: "Family-owned service. You deal with real people who care about your satisfaction." },
            { title: "24/7 Booking Support", desc: "Flexible booking options and responsive help when you need it. Your convenience matters." },
          ]}
        />

        <ServicesCta
          title="Ready to Experience Professional Cleaning?"
          subtitle="Book your service today and transform your space. We’re here 24/7 to support you."
        />
      </div>
    </main>
  );
}