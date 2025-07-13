"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User, Book, ShoppingCart, FileText, LogOut, Star, CheckCircle2, Calendar, ShieldCheck, Layers } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulasi statistik (next step: fetch dari database)
  const stats = [
    { label: "Transaksi Berhasil", value: 12, icon: <CheckCircle2 className="text-green-400 w-6 h-6" /> },
    { label: "Barang Disewakan", value: 4, icon: <Layers className="text-blue-400 w-6 h-6" /> },
    { label: "Riwayat Sewa", value: 7, icon: <Book className="text-purple-400 w-6 h-6" /> },
    { label: "Akun Terverifikasi", value: user?.user_metadata?.verified ? "Ya" : "Belum", icon: <ShieldCheck className="text-emerald-400 w-6 h-6" /> }
  ];

  useEffect(() => {
    const checkUser = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold text-blue-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 shadow-xl flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-green-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Y</span>
          </div>
          <span className="font-extrabold text-lg text-blue-600">YooRent</span>
        </div>
        <nav className="mt-4 flex-1 flex flex-col gap-2 px-2">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300">
            <User size={18} />
            Dashboard User
          </a>
          <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
            <User size={18} />
            Profil Saya
          </a>
          <a href="/dashboard/sewa" className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
            <Book size={18} />
            Riwayat Sewa
          </a>
          <a href="/dashboard/barang" className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
            <ShoppingCart size={18} />
            Barang Saya
          </a>
          <a href="/dashboard/dokumen" className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-800 transition">
            <FileText size={18} />
            Dokumen & KYC
          </a>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900 mt-6 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
        <div className="mt-auto mb-4 text-xs text-center text-gray-400 px-2">
          &copy; {new Date().getFullYear()} YooRent. All rights reserved.
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 py-6 px-4 md:px-10 flex flex-col items-center bg-transparent">
        {/* Header user */}
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center gap-6 mb-8 mt-2">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-3xl text-white font-bold uppercase shadow-md">
              {user?.user_metadata?.full_name
                ? user.user_metadata.full_name[0]
                : user?.email?.[0]}
            </div>
            <div>
              <div className="text-2xl font-extrabold text-blue-600 mb-1">
                {user?.user_metadata?.full_name ?? user?.email}
              </div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mb-1">
                {user?.email}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Akun dibuat: {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
          {/* Status Akun */}
          <div className="flex-1 flex items-center justify-end gap-3 mt-2 sm:mt-0">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Member Aktif
            </span>
            {user?.user_metadata?.verified ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Akun Terverifikasi
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Belum Verifikasi
              </span>
            )}
          </div>
        </div>

        {/* Statistik Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl mb-8">
          {stats.map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow flex items-center gap-4 p-5">
              <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-3">{item.icon}</div>
              <div>
                <div className="font-bold text-lg">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Shortcut */}
        <div className="w-full max-w-3xl flex flex-wrap gap-4 justify-center mt-3">
          <a href="/dashboard/profile" className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-base transition shadow">
            Edit Profil
          </a>
          <a href="/dashboard/sewa" className="px-6 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-semibold text-base transition shadow">
            Riwayat Sewa
          </a>
          <a href="/dashboard/barang" className="px-6 py-3 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold text-base transition shadow">
            Barang Saya
          </a>
          <a href="/dashboard/dokumen" className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-base transition shadow">
            Dokumen KYC
          </a>
        </div>

        {/* Detail User */}
        <div className="w-full max-w-3xl mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow p-7">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Detail Akun</h2>
          <div className="mb-2"><span className="font-semibold">Email:</span> {user?.email}</div>
          {user?.user_metadata?.full_name && (
            <div className="mb-2"><span className="font-semibold">Nama:</span> {user?.user_metadata?.full_name}</div>
          )}
          <div className="mb-2"><span className="font-semibold">ID User:</span> {user?.id}</div>
          <div className="mb-2"><span className="font-semibold">Akun Dibuat:</span> {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}</div>
        </div>
      </main>
    </div>
  );
}
