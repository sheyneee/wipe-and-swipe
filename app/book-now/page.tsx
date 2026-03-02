import Link from "next/link";
import BookingForm from "@/components/booking/BookingForm";

export default function BookNowPage() {
  return (
    <section className="pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-4">Book Your Cleaning Service</h1>
          <p className="text-gray-600 text-lg">
            Fill out the form below to schedule your cleaning appointment. We’ll confirm your booking within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}