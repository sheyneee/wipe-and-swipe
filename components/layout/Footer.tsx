import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/wipe-and-swipe-icon.png"
                  alt="Wipe & Swipe Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">Wipe &amp; Swipe</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Professional cleaning services that transform your space. Eco-friendly, reliable,
              and always sparkling clean.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-teal-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/services/residential" className="hover:text-teal-400 transition-colors">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="/services/commercial" className="hover:text-teal-400 transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/services/deep-cleaning" className="hover:text-teal-400 transition-colors">
                  Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="/book-now" className="hover:text-teal-400 transition-colors">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 Wipe &amp; Swipe. All rights reserved.</p>

          <div className="flex gap-4">
            {/* X */}
            <a
              href="#"
              aria-label="X"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2H21l-6.52 7.455L22 22h-6.828l-5.35-6.976L3.75 22H1l7.02-8.03L2 2h6.999l4.83 6.273L18.244 2Zm-1.197 18h1.88L7.905 3.91H5.89L17.047 20Z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/wipeandswipecs/"
              aria-label="Instagram"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947C23.804 2.618 21.383.192 17.021 0 15.74-.059 15.331-.073 12-.073zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61560368339621"
              aria-label="Facebook"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675v-21.35C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}