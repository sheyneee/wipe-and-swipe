import Link from "next/link";
import BookingForm from "@/components/client/booking/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Free Cleaning Quote",
  description:
    "Request a free quote for residential or commercial cleaning services from Wipe & Swipe Cleaning Services Ltd.",
  alternates: {
    canonical: "/book-now",
  },
};

type BookNowPageProps = {
  searchParams: Promise<{
    service?: string;
  }>;
};

export default async function BookNowPage({ searchParams }: BookNowPageProps) {
  const params = await searchParams;
  const initialService = params.service ?? "";

  return (
    <section className="pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors"
        >
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            Request Free a Cleaning Quote
          </h1>
          <p className="text-gray-600 text-lg">
            Fill out the form below to request a free quote. 
            We’ll review your details and contact you to confirm the service.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
          <BookingForm initialService={initialService} />
        </div>
      </div>
    </section>
  );
}