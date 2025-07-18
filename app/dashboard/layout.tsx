import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Ambil unreadInbox dari API, context, atau state
  // Contoh hardcode sementara:
  const unreadInbox = 2; // atau fetch jumlah unread inbox

  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar unreadInbox={unreadInbox} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
