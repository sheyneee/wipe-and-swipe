type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Booking = {
  status: BookingStatus;
};

export default function BookingsStats({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Bookings"
        value={total}
        border="border-brand-primary"
        icon={
          <svg className="w-12 h-12 text-brand-primary/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      />
      <StatCard
        title="Pending"
        value={pending}
        border="border-yellow-500"
        icon={
          <svg className="w-12 h-12 text-yellow-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        title="Confirmed"
        value={confirmed}
        border="border-green-500"
        icon={
          <svg className="w-12 h-12 text-green-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
        }
      />
      <StatCard
        title="Completed"
        value={completed}
        border="border-blue-500"
        icon={
          <svg className="w-12 h-12 text-blue-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  border,
  icon,
}: {
  title: string;
  value: number;
  border: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}