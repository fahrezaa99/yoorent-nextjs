"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Pastikan field ini sesuai dengan hasil join ke public.profiles
type Profile = {
  id: string;
  nama?: string | null;
  foto?: string | null;
};

type ChatThread = {
  id: string;
  product_id: string;
  sender_id: string;
  receiver_id: string;
  barang?: { id: string; nama: string } | null; // BUKAN ARRAY!
  sender?: Profile | null;
  receiver?: Profile | null;
};

type LastMessage = {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  file_url: string | null;
  created_at: string;
  is_read?: boolean;
};

export default function InboxPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [lastMessages, setLastMessages] = useState<Map<string, LastMessage>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUserId(res.data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchInbox = async () => {
      setLoading(true);

      // Ambil semua chat channel (thread) + relasi
      const { data: chatThreads, error: errChats } = await supabase
        .from("chats")
        .select(`
          *,
          barang(id, nama),
          sender:sender_id (
            id,
            nama,
            foto
          ),
          receiver:receiver_id (
            id,
            nama,
            foto
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      const safeThreads: ChatThread[] = Array.isArray(chatThreads) ? chatThreads : [];

      if (safeThreads.length === 0 || errChats) {
        setThreads([]);
        setLastMessages(new Map());
        setLoading(false);
        return;
      }

      setThreads(safeThreads);

      // Ambil pesan terakhir per thread
      const threadIds = safeThreads.map((t) => t.id);
      if (threadIds.length === 0) {
        setLastMessages(new Map());
        setLoading(false);
        return;
      }

      const { data: msgs, error: errMsgs } = await supabase
        .from("messages")
        .select("*, chat_id")
        .in("chat_id", threadIds)
        .order("created_at", { ascending: false });

      const lastMsgMap = new Map<string, LastMessage>();
      if (msgs && !errMsgs) {
        for (const msg of msgs as LastMessage[]) {
          if (!lastMsgMap.has(msg.chat_id)) {
            lastMsgMap.set(msg.chat_id, msg);
          }
        }
      }
      setLastMessages(lastMsgMap);
      setLoading(false);
    };

    fetchInbox();

    // Realtime update: listen INSERT di messages
    const channel = supabase
      .channel("messages-inbox")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as LastMessage;
          setLastMessages((prev) => {
            const existing = prev.get(msg.chat_id);
            if (!existing || new Date(msg.created_at) > new Date(existing.created_at)) {
              const newMap = new Map(prev);
              newMap.set(msg.chat_id, msg);
              return newMap;
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!userId)
    return <div className="py-10 text-center">Harap login dulu</div>;

  // Hitung unread
  const unreadCount = Array.from(lastMessages.values()).filter(
    (msg) => msg && msg.is_read === false && msg.receiver_id === userId
  ).length;

  // Grouping: hanya 1 thread per barang+lawabicara, ambil thread terbaru
  const threadMap = new Map<string, ChatThread>();
  threads
    .sort((a, b) => {
      const msgA = lastMessages.get(a.id);
      const msgB = lastMessages.get(b.id);
      return msgB && msgA
        ? new Date(msgB.created_at).getTime() - new Date(msgA.created_at).getTime()
        : 0;
    })
    .forEach(thread => {
      const msg = lastMessages.get(thread.id);
      const lawanBicara = thread.sender_id === userId ? thread.receiver_id : thread.sender_id;
      const key = `${thread.product_id}_${lawanBicara}`;
      if (msg && !threadMap.has(key)) {
        threadMap.set(key, thread);
      }
    });
  const groupedThreads = Array.from(threadMap.values());

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-2 sm:px-3">
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-700">Inbox Penyewa</h1>
        {unreadCount > 0 && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-sm font-bold animate-pulse">
            {unreadCount} Unread
          </span>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : groupedThreads.length === 0 ? (
        <div className="text-gray-500 text-center">
          Belum ada pesan masuk dari penyewa.
        </div>
      ) : (
        <div className="space-y-3">
          {groupedThreads.map((thread) => {
            const msg = lastMessages.get(thread.id);

            // Pilih lawan bicara (bukan user login)
            const isSender = userId === thread.sender_id;
            const other = isSender ? thread.receiver : thread.sender;
            const otherName = other?.nama || "-";
            const otherFoto = other?.foto || "";
            // Fallback initial
            const initials =
              otherName && otherName.trim() !== "" ? otherName[0].toUpperCase() : "U";

            return (
              <Link
                href={`/dashboard/inbox/${thread.id}`}
                key={thread.id}
                className="block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition p-4 relative"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Lawan Bicara */}
                  <div className="flex-shrink-0">
                    {otherFoto ? (
                      <img
                        src={otherFoto}
                        alt={otherName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold border border-gray-200">
                        {initials}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                      <span className="block text-blue-800 font-bold truncate">
                        {thread.barang?.nama || "Barang"}
                      </span>
                      <span className="text-xs text-gray-400 font-medium sm:ml-2">
                        {msg
                          ? new Date(msg.created_at).toLocaleString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-800 font-semibold truncate">
                        {otherName}
                      </span>
                      {msg && msg.is_read === false && msg.receiver_id === userId && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                          Unread
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700 text-[15px] mt-0.5 truncate max-w-[96vw] sm:max-w-full">
                      {msg ? (
                        msg.message ? (
                          <>{msg.message.slice(0, 70)}</>
                        ) : msg.file_url ? (
                          <span className="italic text-blue-500">[File/Gambar]</span>
                        ) : (
                          ""
                        )
                      ) : (
                        <span className="text-gray-400">Belum ada pesan.</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
