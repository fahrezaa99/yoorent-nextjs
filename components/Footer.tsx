"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kiri: Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 via-green-400 to-purple-500">
                <span className="text-white font-bold text-base">Y</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">YooRent</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Platform sewa menyewa P2P terpercaya di Indonesia. Mulai sewakan barangmu dan raup cuan sekarang!
            </p>
          </div>

          {/* Tengah: Link */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Link Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#tentang"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#kebijakan"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Kebijakan
                </Link>
              </li>
              <li>
                <Link
                  href="#bantuan"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Bantuan
                </Link>
              </li>
              <li>
                <Link
                  href="#kontak"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kanan: Sosmed */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Ikuti Kami
            </h4>
            <div className="flex space-x-4">
              <SocialIcon name="Instagram" />
              <SocialIcon name="TikTok" />
              <SocialIcon name="LinkedIn" />
              <SocialIcon name="Facebook" />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} YooRent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons = {
    Instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-1a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ),
    TikTok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2c.552 0 1 .448 1 1v1.362c0 1.638 1.33 2.975 2.962 2.995h.038A3 3 0 0020 4V3c0-.552.448-1 1-1s1 .448 1 1v1a5 5 0 01-5 5h-.053A4.988 4.988 0 0114 6.362V20a4 4 0 11-2-3.465V3c0-.552.448-1 1-1z" />
      </svg>
    ),
    LinkedIn: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5C4.98 2.12 6.1 1 7.48 1c1.37 0 2.5 1.12 2.5 2.5S8.85 6 7.48 6C6.1 6 4.98 4.88 4.98 3.5zM4 8h6v12H4zM14 8h5.337l-.337.337V8H20v12h-6V8z" />
      </svg>
    ),
    Facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11 9.949V15.5h-2v-3h2v-2.3c0-2 1.18-3.2 3-3.2.87 0 1.8.157 1.8.157v2h-1.2c-1.2 0-1.5.743-1.5 1.5v1.8h2.5l-.4 3h-2.1v6.45A10 10 0 0022 12z" />
      </svg>
    ),
  };

  return (
    <a
      href="#"
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-600 dark:text-gray-300 hover:text-white transition-colors"
      aria-label={name}
    >
      {icons[name as keyof typeof icons]}
    </a>
  );
}
