"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type ChatItem = {
  id: string;
  chat_id: string | null;
  barang_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  file_url: string | null;
  created_at: string;
  is_read?: boolean;
  barang?: { nama: string };
};

export default function InboxPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Ambil userId saat komponen mount
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUserId(res.data.user?.id ?? null);
    });
  }, []);

  // Fetch chat messages dari Supabase
  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      setLoading(true);
      // lanjut logic fetch di sini...
    };

    fetchChats();

    // Realtime update chat
    const channel = supabase
      .channel("chat-inbox")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          setChats((prev) => [payload.new as ChatItem, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!userId)
    return <div className="py-10 text-center">Harap login dulu</div>;

  // ----------- GROUPING PER THREAD (PER CHAT_ID) -----------
  const filteredChats = chats.filter(
    (chat) => !!chat.chat_id && chat.chat_id !== "null"
  );

  const threadMap = new Map<string, ChatItem>();
  for (const chat of filteredChats) {
    if (
      !threadMap.has(chat.chat_id!) ||
      new Date(chat.created_at) >
        new Date(threadMap.get(chat.chat_id!)!.created_at)
    ) {
      threadMap.set(chat.chat_id!, chat);
    }
  }
  const threads = Array.from(threadMap.values());

  const unreadCount = threads.filter((c) => c.is_read === false).length;

  return (
    <div className="max-w-2xl mx-auto py-10 px-3">
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-2xl font-bold text-blue-700">Inbox Penyewa</h1>
        {unreadCount > 0 && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-sm font-bold animate-pulse">
            {unreadCount} Unread
          </span>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : threads.length === 0 ? (
        <div className="text-gray-500 text-center">
          Belum ada pesan masuk dari penyewa.
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((item, idx) => (
            <Link
              href={`/dashboard/inbox/${item.chat_id}`}
              key={item.id + idx}
              className="block rounded-lg border bg-white shadow-sm hover:shadow transition p-4 relative"
            >
              <div className="flex justify-between items-center gap-2">
                <div className="text-sm text-blue-800 font-bold">
                  {item.barang?.nama || "Barang"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {item.is_read === false && (
                    <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                      Unread
                    </span>
                  )}
                </div>
              </div>
              <div className="text-gray-700 text-[15px] mt-1">
                {item.message ? (
                  <>{item.message.slice(0, 70)}</>
                ) : (
                  item.file_url && (
                    <span className="italic text-blue-500">
                      [File/Gambar]
                    </span>
                  )
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
