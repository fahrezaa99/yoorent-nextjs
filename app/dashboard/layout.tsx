"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { RoleContext } from "@/components/common/RoleContext";
import NavbarDashboard from "@/components/common/NavbarDashboard";
import { useAuth } from "@/lib/useAuth"; // Import custom hook useAuth

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"penyewa" | "pemilik">("penyewa");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadInbox = 2;
  const unreadReview = 1;

  // === Ambil user dari custom hook useAuth ===
  const { user } = useAuth();

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {/* === NAVBAR DASHBOARD USER === */}
      <NavbarDashboard
        user={{
          name: user?.name || "",
          email: user?.email || "",
          avatar: user?.avatar || "", // Path foto user dari data login/auth
        }}
        unreadNotif={unreadInbox + unreadReview}
        cartCount={0} // boleh diubah sesuai kebutuhanmu
      />
      {/* PARENT FLEX hanya di desktop */}
      <div className="min-h-screen bg-blue-50 relative md:flex md:flex-row">
        {/* === TOMBOL BURGER (Mobile/Tablet Only) === */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 text-blue-800 bg-white rounded-full shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka Sidebar"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* === SIDEBAR === */}
        <DashboardSidebar
          unreadInbox={unreadInbox}
          unreadReview={unreadReview}
          role={role}
          setRole={setRole}
          user={{
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.avatar || "",
          }}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* === MAIN CONTENT === */}
        <main className="w-full flex-1 p-4 transition-all duration-300">{children}</main>
      </div>
    </RoleContext.Provider>
  );
}
