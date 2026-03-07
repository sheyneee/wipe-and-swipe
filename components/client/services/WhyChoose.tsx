type Reason = { title: string; desc: string };

export default function WhyChoose({
  heading = "Why Choose Wipe & Swipe",
  reasons,
}: {
  heading?: string;
  reasons: Reason[];
}) {
  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">{heading}</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {reasons.map((r) => (
          <div key={r.title} className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{ background: "linear-gradient(135deg, #296276 0%, #266075 100%)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{r.title}</h3>
            <p className="text-gray-600 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}