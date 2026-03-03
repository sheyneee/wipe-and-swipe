export default function AdminFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Wipe and Swipe. Admin Panel.
      </div>
    </footer>
  );
}