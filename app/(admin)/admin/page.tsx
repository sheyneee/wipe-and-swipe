import BookingsContainer from "@/components/admin/dashboard/booking-list/BookingsContainer";
import { requireAdminSession } from "@/lib/auth/admin-session";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          View booking activity and manage customer requests.
        </p>
      </div>

      <BookingsContainer />
    </main>
  );
}