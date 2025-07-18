import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Ambil unreadInbox dari API, context, atau state (misal nanti pakai context, fetch dsb)
  // Sementara hardcode:
  const unreadInbox: number = 2; // Ganti dengan fetch jumlah unread sebenarnya jika perlu

  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar unreadInbox={unreadInbox} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
