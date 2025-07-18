"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome, FaBox, FaEnvelope, FaFileAlt, FaUser, FaArrowLeft
} from "react-icons/fa";

export default function DashboardSidebar({
  unreadInbox = 0,
}: {
  unreadInbox?: number;
}) {
  const pathname = usePathname();

  // Menu data
  const menu = [
    {
      label: "Kembali ke Beranda",
      href: "/",
      icon: <FaArrowLeft />,
      bold: true,
      extra: "text-blue-600 font-bold",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <FaHome />,
    },
    {
      label: "Barang Saya",
      href: "/dashboard/barang",
      icon: <FaBox />,
    },
    {
      label: "Inbox",
      href: "/dashboard/inbox",
      icon: <FaEnvelope />,
      badge: unreadInbox,
    },
    {
      label: "Profil Saya",
      href: "/dashboard/profil",
      icon: <FaUser />,
    },
    {
      label: "Dokumen & KYC",
      href: "/dashboard/kyc",
      icon: <FaFileAlt />,
    },
  ];

  return (
    <aside className="h-screen w-full max-w-[220px] min-w-[120px] bg-white border-r px-2 sm:px-3 py-6 flex flex-col justify-between sticky top-0 z-40 shadow-sm">
      <nav>
        <div className="mb-8 text-xl font-bold text-blue-700 tracking-tight px-2 hidden sm:block">
          Dashboard
        </div>
        <ul className="flex flex-col gap-1">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-2 py-2 sm:px-3 rounded-lg transition 
                  ${item.extra ? item.extra : ""}
                  ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-50"
                  }
                `}
              >
                {item.icon}
                <span className={`flex-1 ${item.bold ? "font-bold" : ""}`}>{item.label}</span>
                {/* Badge Notifikasi */}
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mb-2 mt-6 px-2">
        <Link
          href="/logout"
          className="block w-full text-center py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
        >
          Logout
        </Link>
      </div>
    </aside>
  );
}
