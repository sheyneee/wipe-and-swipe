export default function AdminFooter() {
  return (
    <footer
      className="mt-20 py-6 border-t border-white/10"
      style={{ backgroundColor: "#283955" }}
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-300">
            © 2026 Wipe & Swipe Cleaning Services Ltd
          </p>

          <p className="text-xs sm:text-sm font-medium text-gray-300">
            Admin Portal
          </p>
        </div>
      </div>
    </footer>
  );
}