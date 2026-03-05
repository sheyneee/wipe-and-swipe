import { cookies } from "next/headers";

export default async function AdminFooter() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) return null;

  return (
    <footer
      className="mt-20 py-6"
      style={{ backgroundColor: "#283955" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-300">
        <p>
          © {new Date().getFullYear()} Wipe & Swipe Cleaning Services Ltd
        </p>

        <p style={{ color: "#296276" }}>
          Admin Portal
        </p>
      </div>
    </footer>
  );
}