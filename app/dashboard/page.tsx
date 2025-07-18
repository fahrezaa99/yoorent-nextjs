"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Book, ShoppingCart, FileText,
  Star, CheckCircle2, Calendar, ShieldCheck, Layers,
  Bell, Edit2, UserCircle2
} from "lucide-react";

// Tipe UserData
interface UserMetadata {
  full_name?: string;
  verified?: boolean;
}
interface UserType {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: UserMetadata;
}

// Badge komponen
function Badge({ color, icon, children }: { color: string; icon: ReactNode; children: ReactNode }) {
  const bg = {
    navy: "bg-blue-950 text-white border-blue-800",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-300"
  }[color] || "bg-blue-100 text-blue-700 border-blue-300";
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs border ${bg}`}>
      {icon}
      {children}
    </span>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string>("");
  const router = useRouter();

  // Statistik Card Style (navy variant)
  const stats = [
    {
      label: "Transaksi Berhasil",
      value: 12,
      icon: <CheckCircle2 className="text-green-400 w-7 h-7" />,
      bg: "bg-blue-950 text-white border-blue-800"
    },
    {
      label: "Barang Disewakan",
      value: 4,
      icon: <Layers className="text-cyan-400 w-7 h-7" />,
      bg: "bg-slate-800 text-white border-blue-900"
    },
    {
      label: "Riwayat Sewa",
      value: 7,
      icon: <Book className="text-blue-400 w-7 h-7" />,
      bg: "bg-blue-900 text-white border-blue-800"
    },
    {
      label: "Akun Terverifikasi",
      value: user?.user_metadata?.verified ? "Ya" : "Belum",
      icon: <ShieldCheck className="text-emerald-400 w-7 h-7" />,
      bg: "bg-blue-800 text-white border-blue-700"
    }
  ];

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
      } else {
        setUser({
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
          user_metadata: data.user.user_metadata
        });
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 2300);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-pulse space-y-6 w-full max-w-2xl px-4">
          <div className="h-16 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-slate-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-900 text-white px-6 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Topbar */}
      <header className="h-16 flex items-center justify-between bg-white/90 shadow px-2 sm:px-4 md:px-10 sticky top-0 z-30 rounded-b-2xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-bold text-xl">Y</span>
          </div>
          <span className="font-extrabold text-lg sm:text-2xl text-blue-900 tracking-tight">YooRent</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="relative">
            <Bell className="w-6 h-6 text-blue-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
            <span className="sr-only">Notifikasi</span>
          </button>
          <span className="font-semibold text-blue-900 text-sm sm:text-base hidden md:inline">
            {user?.user_metadata?.full_name ?? user?.email}
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-900 rounded-full flex items-center justify-center">
            <UserCircle2 className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center w-full px-1 sm:px-2 pb-8 pt-6 sm:pt-7">
        {/* Profile Card */}
        <div className="w-full max-w-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 shadow-2xl rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-7 mb-6 sm:mb-8 border-2 border-blue-900">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-3xl sm:text-5xl text-white font-bold uppercase shadow">
            {user?.user_metadata?.full_name
              ? user.user_metadata.full_name[0]
              : user?.email?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-black text-white mb-1 truncate drop-shadow">{user?.user_metadata?.full_name ?? user?.email}</div>
            <div className="text-blue-200 text-xs sm:text-sm mb-1 truncate">{user?.email}</div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-blue-300">
                Akun dibuat: {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}
              </span>
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

        {/* Statistik */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl mb-7 sm:mb-8">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl shadow-xl border-2 ${item.bg} flex flex-col items-center justify-center gap-1 py-6 sm:py-7 px-2 min-w-[130px] sm:min-w-[150px] active:scale-[0.97] hover:scale-[1.03] transition-transform`}
            >
              <div className="mb-1 sm:mb-2">{item.icon}</div>
              <div className="font-extrabold text-2xl sm:text-3xl tracking-wide">{item.value}</div>
              <div className="text-sm sm:text-base font-medium opacity-90 text-center">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Shortcut */}
        <div className="w-full max-w-3xl flex flex-wrap gap-3 sm:gap-4 justify-center mb-8">
          <ShortcutBtn
            icon={<Edit2 size={18} />}
            label="Edit Profil"
            color="navy"
            onClick={() => router.push("/dashboard/profile")}
          />
          <ShortcutBtn
            icon={<Book size={18} />}
            label="Riwayat Sewa"
            color="navy"
            onClick={() => router.push("/dashboard/sewa")}
          />
          <ShortcutBtn
            icon={<ShoppingCart size={18} />}
            label="Barang Saya"
            color="navy"
            onClick={() => router.push("/dashboard/barang")}
          />
          <ShortcutBtn
            icon={<FileText size={18} />}
            label="Dokumen KYC"
            color="navy"
            onClick={() => router.push("/dashboard/dokumen")}
          />
        </div>

        {/* Akun Details */}
        <h2 className="w-full max-w-3xl text-lg sm:text-xl font-black text-blue-950 mb-2 mt-3">Detail Akun</h2>
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-4 sm:p-7 border-2 border-blue-100">
          <div className="mb-1 sm:mb-2"><span className="font-semibold text-blue-900">Email:</span> {user?.email}</div>
          {user?.user_metadata?.full_name && (
            <div className="mb-1 sm:mb-2"><span className="font-semibold text-blue-900">Nama:</span> {user?.user_metadata?.full_name}</div>
          )}
          <div className="mb-1 sm:mb-2"><span className="font-semibold text-blue-900">ID User:</span> {user?.id}</div>
          <div className=""><span className="font-semibold text-blue-900">Akun Dibuat:</span> {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}</div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-3xl text-xs text-blue-900/40 text-center mt-8 sm:mt-10 mb-2 tracking-wider">
          &copy; {new Date().getFullYear()} YooRent. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

// Shortcut button komponen
interface ShortcutBtnProps {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}
function ShortcutBtn({ icon, label, color, onClick }: ShortcutBtnProps) {
  const colorMap: Record<string, string> = {
    navy: "bg-blue-950 text-white border-2 border-blue-900 hover:bg-blue-900 hover:scale-[1.03]",
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    green: "bg-green-100 text-green-700 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  return (
    <button
      onClick={onClick}
      className={`px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-bold text-base transition shadow-lg flex items-center gap-2 ${colorMap[color] || ""} active:scale-95 duration-150`}
      style={{ minWidth: 120, maxWidth: 200 }}
    >
      {icon} {label}
    </button>
  );
}
