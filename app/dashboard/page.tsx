"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Book, ShoppingCart, FileText,
  Star, CheckCircle2, Calendar, ShieldCheck, Layers,
  Bell, Edit2, UserCircle2
} from "lucide-react";
import PageSlideTransition from "@/components/PageSlideTransition";

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

function Badge({ color, icon, children }: { color: string; icon: ReactNode; children: ReactNode }) {
  const bg = {
    navy: "bg-blue-900/80 text-white border-blue-700",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
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

  const stats = [
    {
      label: "Transaksi Berhasil",
      value: 12,
      icon: <CheckCircle2 className="text-emerald-500 w-7 h-7" />,
      bg: "bg-white/90 border border-blue-100 text-blue-900"
    },
    {
      label: "Barang Disewakan",
      value: 4,
      icon: <Layers className="text-cyan-500 w-7 h-7" />,
      bg: "bg-white/90 border border-blue-100 text-blue-900"
    },
    {
      label: "Riwayat Sewa",
      value: 7,
      icon: <Book className="text-blue-600 w-7 h-7" />,
      bg: "bg-white/90 border border-blue-100 text-blue-900"
    },
    {
      label: "Akun Terverifikasi",
      value: user?.user_metadata?.verified ? "Ya" : "Belum",
      icon: <ShieldCheck className="text-blue-500 w-7 h-7" />,
      bg: "bg-white/90 border border-blue-100 text-blue-900"
    }
  ];

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const userData = data.user;
      if (!userData) {
        router.push("/");
      } else {
        setUser({
          id: userData.id ?? "",
          email: userData.email ?? "",
          created_at: userData.created_at ?? "",
          user_metadata: userData.user_metadata ?? {}
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
    <PageSlideTransition direction="right">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-900 text-white px-6 py-3 rounded-xl shadow-lg">
            {toast}
          </div>
        )}

        {/* Topbar */}
        <header className="h-16 flex items-center justify-between bg-white/90 shadow px-2 sm:px-6 md:px-12 sticky top-0 z-30 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="font-extrabold text-2xl text-blue-900 tracking-tight">YooRent</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-6 h-6 text-blue-700" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
              <span className="sr-only">Notifikasi</span>
            </button>
            <span className="font-semibold text-blue-900 text-base hidden md:inline">
              {user?.user_metadata?.full_name ?? user?.email}
            </span>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-900 rounded-full flex items-center justify-center">
              <UserCircle2 className="text-white w-7 h-7" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col items-center w-full px-1 sm:px-4 pb-10 pt-7">
          {/* Profile Card */}
          <div className="w-full max-w-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 shadow-xl rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-8 border-2 border-blue-950">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-4xl text-white font-bold uppercase shadow">
              {user?.user_metadata?.full_name?.[0] ?? user?.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-3xl font-black text-white mb-1 truncate drop-shadow">{user?.user_metadata?.full_name ?? user?.email}</div>
              <div className="text-blue-200 text-sm mb-1 truncate">{user?.email}</div>
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
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-8">
            {stats.map((item, i) => (
              <div
                key={i}
                className={`${item.bg} rounded-2xl shadow-md flex flex-col items-center justify-center gap-2 py-6 px-2 hover:shadow-xl active:scale-95 transition-transform duration-150`}
              >
                <div className="mb-1">{item.icon}</div>
                <div className="font-extrabold text-2xl tracking-wide">{item.value}</div>
                <div className="text-sm font-medium opacity-90 text-center">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Shortcut */}
          <div className="w-full max-w-3xl flex flex-wrap gap-3 justify-center mb-8">
            <ShortcutBtn icon={<Edit2 size={18} />} label="Edit Profil" color="navy" onClick={() => router.push("/dashboard/profile")} />
            <ShortcutBtn icon={<Book size={18} />} label="Riwayat Sewa" color="navy" onClick={() => router.push("/dashboard/sewa")} />
            <ShortcutBtn icon={<ShoppingCart size={18} />} label="Barang Saya" color="navy" onClick={() => router.push("/dashboard/barang")} />
            <ShortcutBtn icon={<FileText size={18} />} label="Dokumen KYC" color="navy" onClick={() => router.push("/dashboard/dokumen")} />
          </div>

          {/* Akun Details */}
          <h2 className="w-full max-w-3xl text-xl font-black text-blue-950 mb-3 mt-2">Detail Akun</h2>
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-5 border border-blue-100">
            <div className="mb-2"><span className="font-semibold text-blue-900">Email:</span> {user?.email}</div>
            {user?.user_metadata?.full_name && (
              <div className="mb-2"><span className="font-semibold text-blue-900">Nama:</span> {user.user_metadata.full_name}</div>
            )}
            <div className="mb-2"><span className="font-semibold text-blue-900">ID User:</span> {user?.id}</div>
            <div><span className="font-semibold text-blue-900">Akun Dibuat:</span> {user?.created_at && new Date(user.created_at).toLocaleString("id-ID")}</div>
          </div>

          <footer className="w-full max-w-3xl text-xs text-blue-900/50 text-center mt-8 mb-2 tracking-wider">
            &copy; {new Date().getFullYear()} YooRent. All rights reserved.
          </footer>
        </div>
      </div>
    </PageSlideTransition>
  );
}

interface ShortcutBtnProps {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}
function ShortcutBtn({ icon, label, color, onClick }: ShortcutBtnProps) {
  const colorMap: Record<string, string> = {
    navy: "bg-blue-950 text-white border border-blue-900 hover:bg-blue-900",
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    green: "bg-green-100 text-green-700 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-2xl font-semibold text-base shadow flex items-center gap-2 ${colorMap[color] || ""} active:scale-95 transition-all duration-150`}
      style={{ minWidth: 120, maxWidth: 200 }}
    >
      {icon} {label}
    </button>
  );
}
