import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full min-h-full"
      style={{
        background: "linear-gradient(180deg, #f5f9fb 0%, #ffffff 50%, #f5f9fb 100%)",
      }}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}