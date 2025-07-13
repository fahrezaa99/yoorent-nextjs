"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  User, Book, ShoppingCart, FileText, LogOut,
  Star, CheckCircle2, Calendar, ShieldCheck, Layers,
  Bell, Edit2, UserCircle2, LogOutIcon
} from "lucide-react";

function Badge({ color, icon, children }: any) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-${color}-50 text-${color}-700 font-semibold text-xs border border-${color}-200`}>
      {icon}
      {children}
    </span>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const router = useRouter();

  // Simulasi statistik
  const stats = [
    { label: "Transaksi Berhasil", value: 12, icon: <CheckCircle2 className="text-green-400 w-6 h-6" /> },
    { label: "Barang Disewakan", value: 4, icon: <Layers className="text-blue-400 w-6 h-6" /> },
    { label: "Riwayat Sewa", value: 7, icon: <Book className="text-purple-400 w-6 h-6" /> },
    { label: "Akun Terverifikasi", value: user?.user_metadata?.verified ? "Ya" : "Belum", icon: <ShieldCheck className="text-emerald-400 w-6 h-6" /> }
  ];

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  // Notifikasi / Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 2300);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        <div className="animate-pulse w-full h-16 bg-gray-100" />
        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="w-full md:w-64 bg-gray-100" />
          <main className="flex-1 p-6 space-y-4">
            <div className="w-full max-w-3xl h-28 bg-gray-200 rounded-2xl mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-24 rounded-2xl" />
              ))}
            </div>
            <div className="w-full max-w-3xl h-12 bg-gray-200 rounded-lg mb-2" />
            <div className="w-full max-w-3xl h-40 bg-gray-200 rounded-2xl" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99] bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg animate-fadein">
          {toast}
        </div>
      )}

      {/* Topbar */}
      <div className="h-16 flex items-center justify-between bg-white shadow-sm px-6 md:px-12 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-green-400 to-purple-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="font-extrabold text-xl text-blue-600 tracking-tight">YooRent</span>
          <span className="ml-4 text-gray-400 hidden sm:inline">|</span>
          <div className="ml-2 flex gap-3 text-sm text-gray-700 hidden sm:flex">
            <button onClick={() => router.push("/dashboard")} className="hover:text-blue-600 font-semibold">Dashboard</button>
            <button onClick={() => router.push("/dashboard/profile")} className="hover:text-blue-600">Profil</button>
            <button onClick={() => router.push("/dashboard/sewa")} className="hover:text-blue-600">Riwayat</button>
            <button onClick={() => router.push("/dashboard/barang")} className="hover:text-blue-600">Barang</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative group">
            <Bell className="w-6 h-6 text-blue-400" />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-green-400 rounded-full ring-2 ring-white" />
            <span className="sr-only">Notifikasi</span>
          </button>
          <span className="font-semibold text-gray-700 text-sm hidden sm:inline">
            {user?.user_metadata?.full_name ?? user?.email}
          </span>
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <UserCircle2 className="text-white w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Layout utama */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-100 shadow-xl flex-shrink-0 flex flex-col">
          <nav className="mt-6 flex-1 flex flex-col gap-2 px-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-blue-700 bg-blue-50"
            >
              <User size={18} />
              Dashboard User
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-blue-50 transition"
            >
              <Edit2 size={18} />
              Profil Saya
            </button>
            <button
              onClick={() => router.push("/dashboard/sewa")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-blue-50 transition"
            >
              <Book size={18} />
              Riwayat Sewa
            </button>
            <button
              onClick={() => router.push("/dashboard/barang")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-blue-50 transition"
            >
              <ShoppingCart size={18} />
              Barang Saya
            </button>
            <button
              onClick={() => router.push("/dashboard/dokumen")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-blue-50 transition"
            >
              <FileText size={18} />
              Dokumen & KYC
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setToast("Logout berhasil");
                setTimeout(() => router.push("/"), 1500);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 mt-8 transition"
            >
              <LogOutIcon size={18} />
              Logout
            </button>
          </nav>
          <div className="mt-auto mb-4 text-xs text-center text-gray-400 px-2">
            &copy; {new Date().getFullYear()} YooRent. All rights reserved.
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-3 md:px-10 flex flex-col items-center bg-transparent">
          {/* Profile Card */}
          <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-7 border border-blue-50">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl text-white font-bold uppercase shadow">
              {user?.user_metadata?.full_name
                ? user.user_metadata.full_name[0]
                : user?.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl font-extrabold text-blue-600 mb-1 truncate">{user?.user_metadata?.full_name ?? user?.email}</div>
              <div className="text-gray-500 text-sm mb-1 truncate">{user?.email}</div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Akun dibuat: {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge color="emerald" icon={<Star size={14} />}>Member Aktif</Badge>
                {user?.user_metadata?.verified ? (
                  <Badge color="blue" icon={<CheckCircle2 size={14} />}>Akun Terverifikasi</Badge>
                ) : (
                  <Badge color="yellow" icon={<ShieldCheck size={14} />}>Belum Verifikasi</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-3xl border-b border-gray-200 mb-6"></div>

          {/* Statistik Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl mb-8">
            {stats.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4 p-5 border border-gray-50">
                <div className="bg-blue-50 rounded-xl p-3">{item.icon}</div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Shortcut Menu */}
          <div className="w-full max-w-3xl flex flex-wrap gap-4 justify-center mt-3 mb-8">
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-base transition shadow flex items-center gap-2"
            >
              <Edit2 size={17} /> Edit Profil
            </button>
            <button
              onClick={() => router.push("/dashboard/sewa")}
              className="px-6 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-semibold text-base transition shadow flex items-center gap-2"
            >
              <Book size={17} /> Riwayat Sewa
            </button>
            <button
              onClick={() => router.push("/dashboard/barang")}
              className="px-6 py-3 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold text-base transition shadow flex items-center gap-2"
            >
              <ShoppingCart size={17} /> Barang Saya
            </button>
            <button
              onClick={() => router.push("/dashboard/dokumen")}
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-base transition shadow flex items-center gap-2"
            >
              <FileText size={17} /> Dokumen KYC
            </button>
          </div>

          {/* Section Divider */}
          <h2 className="w-full max-w-3xl text-xl font-bold text-blue-700 mb-2 mt-3">Detail Akun</h2>
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-7 border border-blue-50">
            <div className="mb-2"><span className="font-semibold">Email:</span> {user?.email}</div>
            {user?.user_metadata?.full_name && (
              <div className="mb-2"><span className="font-semibold">Nama:</span> {user?.user_metadata?.full_name}</div>
            )}
            <div className="mb-2"><span className="font-semibold">ID User:</span> {user?.id}</div>
            <div className="mb-2"><span className="font-semibold">Akun Dibuat:</span> {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}</div>
          </div>

          {/* Footer Kecil */}
          <footer className="w-full max-w-3xl text-xs text-gray-400 text-center mt-8 mb-3">
            &copy; {new Date().getFullYear()} YooRent. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
