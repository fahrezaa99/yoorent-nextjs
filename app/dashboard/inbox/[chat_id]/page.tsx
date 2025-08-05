"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Paperclip, Loader2, Check, CheckCheck } from "lucide-react";
import Image from "next/image";

type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  file_url: string | null;
  created_at: string;
  product_id?: string;
  is_read?: boolean;
  avatar_url?: string;
};

export default function ChatDetailPage() {
  const { chat_id } = useParams() as { chat_id: string };
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const [sendingFile, setSendingFile] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // simpan detail chat
  const [chatDetail, setChatDetail] = useState<null | {
    sender_id: string;
    receiver_id: string;
    product_id: string;
  }>(null);

  // Log semua variabel penting
  useEffect(() => {
    const getUser = async () => {
      const res = await supabase.auth.getUser();
      setUserId(res.data.user?.id ?? null);
    };
    getUser();
  }, []);

  // Ambil chat detail dari tabel chats
  useEffect(() => {
    if (!chat_id) return;
    supabase
      .from("chats")
      .select("sender_id, receiver_id, product_id")
      .eq("id", chat_id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Fetch chatDetail error:", error.message);
          return;
        }
        setChatDetail(data);
      });
  }, [chat_id]);

  // Ambil pesan dan setup real-time
  // Ambil pesan dan setup real-time
useEffect(() => {
  // Hanya jalan jika chat_id dan userId sudah ready
  if (!chat_id || !userId) return;

  // 1. Ambil semua pesan sekali saja waktu buka halaman
  const fetchMsgs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: true });

    setMessages((data as Message[]) || []);
    setLoading(false);

    // Tandai pesan sebagai dibaca (opsional)
    if (
      data &&
      userId &&
      data.some((msg: Message) => msg.receiver_id === userId && !msg.is_read)
    ) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("chat_id", chat_id)
        .eq("receiver_id", userId)
        .eq("is_read", false);
    }
  };

  fetchMsgs();

  // 2. Subscribe ke channel Realtime Supabase (hanya 1x, tidak duplikat)
  const channel = supabase
    .channel("messages-detail-" + chat_id)
    .on(
      "postgres_changes",
      {
        event: "*", // Semua event: INSERT, UPDATE, DELETE
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chat_id}`,
      },
      (payload) => {
        setMessages((prev) => {
          // Cegah duplikat INSERT (misal optimistic update)
          if (
            payload.eventType === "INSERT" &&
            prev.find((msg) => msg.id === payload.new.id)
          ) {
            return prev;
          }
          // INSERT: Tambahkan pesan baru
          if (payload.eventType === "INSERT") {
            return [...prev, payload.new as Message];
          }
          // UPDATE: Update is_read dan isi message (misal pesan diubah)
          if (payload.eventType === "UPDATE") {
            return prev.map((msg) =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            );
          }
          // DELETE: Optional, kalau perlu hapus pesan
          if (payload.eventType === "DELETE") {
            return prev.filter((msg) => msg.id !== payload.old.id);
          }
          return prev;
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [chat_id, userId]);


  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        showEmoji &&
        target.closest &&
        !target.closest(".emoji-picker-react") &&
        !target.closest("#emoji-trigger")
      ) {
        setShowEmoji(false);
      }
    }
    if (showEmoji) window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showEmoji]);

  // UUID checker
  const isValidUUID = (uuid: string | null | undefined) =>
    typeof uuid === "string" && /^[0-9a-fA-F\-]{36}$/.test(uuid);

  // MODIFIKASI: Pesan langsung muncul tanpa reload (optimistic update)
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userId || !newMsg.trim() || !chatDetail) {
      return;
    }

    const receiverId =
      chatDetail.sender_id === userId
        ? chatDetail.receiver_id
        : chatDetail.sender_id;
    const barangId = chatDetail.product_id;

    if (
      !isValidUUID(receiverId) ||
      !isValidUUID(barangId)
    ) {
      alert("receiver_id/product_id tidak valid!");
      return;
    }

    // Insert lalu langsung tampilkan di UI
    const { data, error } = await supabase
      .from("messages")
      .insert([{
        chat_id: chat_id,
        sender_id: userId,
        receiver_id: receiverId,
        product_id: barangId,
        message: newMsg,
        is_read: false,
      }])
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
      setNewMsg("");
    } else if (!error) {
      setNewMsg("");
    } else {
      alert("Gagal kirim pesan: " + error.message);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !chatDetail) {
      return;
    }
    setSendingFile(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 9999)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("messages-files")
      .upload(fileName, file, { upsert: true });

    if (!error && data?.path) {
      const receiverId =
        chatDetail.sender_id === userId
          ? chatDetail.receiver_id
          : chatDetail.sender_id;
      const barangId = chatDetail.product_id;

      if (
        !isValidUUID(receiverId) ||
        !isValidUUID(barangId)
      ) {
        alert("receiver_id/product_id tidak valid!");
        setSendingFile(false);
        return;
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/messages-files/${fileName}`;
      await supabase.from("messages").insert([{
        chat_id: chat_id,
        sender_id: userId,
        receiver_id: receiverId,
        product_id: barangId,
        message: "",
        file_url: publicUrl,
      }]);
    }
    setSendingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!userId) {
    return (
      <div className="py-10 text-center">Harap login dulu</div>
    );
  }

  if (!chatDetail) {
    return (
      <div className="py-10 text-center">Mengambil detail chat...</div>
    );
  }

  // Avatar generator fallback
  const getAvatar = (msg: Message) =>
    msg.avatar_url
      ? msg.avatar_url
      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${msg.sender_id.slice(-8)}`;

  return (
    <div className="w-full flex flex-col items-center min-h-[90vh] bg-[#f1f7ff] px-2 py-6">
      <div className="w-full max-w-2xl">
        <div className="font-bold text-2xl mb-5 text-blue-700 text-center">Chat Detail</div>
        <div className="bg-white rounded-2xl shadow-xl p-4 max-h-[65vh] min-h-[320px] overflow-y-auto mb-4 flex flex-col gap-2 border">
          {loading ? (
            <div className="flex items-center justify-center h-44 text-gray-400">
              <Loader2 className="animate-spin mr-2" /> Loading...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-20">Belum ada pesan.</div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === userId;
              return (
                <div
                  key={msg.id}
                  className={`flex w-full items-end ${isMine ? "justify-end" : "justify-start"} mb-1`}
                >
                  {!isMine && (
                    <Image
                      src={getAvatar(msg)}
                      alt="avatar"
                      className="w-8 h-8 rounded-full mr-2 border bg-white object-cover"
                      width={32}
                      height={32}
                      unoptimized
                    />
                  )}
                  <div
                    className={`max-w-[78vw] md:max-w-md px-4 py-2 rounded-2xl break-words shadow flex flex-col ${
                      isMine
                        ? "bg-blue-600 text-white rounded-tr-md"
                        : "bg-gray-100 text-gray-900 border rounded-tl-md"
                    }`}
                  >
                    {/* Pesan gambar/file */}
                    {msg.file_url && msg.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={msg.file_url}
                          alt="Gambar"
                          className="w-44 h-36 rounded-lg object-cover mb-1"
                          width={176}
                          height={144}
                          unoptimized
                        />
                      </a>
                    ) : msg.file_url ? (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-200 underline flex items-center gap-1"
                      >
                        <Paperclip size={16} /> File
                      </a>
                    ) : null}
                    {/* Pesan teks */}
                    {msg.message && <div className="text-[15px]">{msg.message}</div>}
                    <div className={`flex items-center gap-1 text-[11px] mt-1 ${
                      isMine ? "justify-end text-blue-100" : "justify-start text-gray-400"
                    }`}>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMine && (
                        msg.is_read
                          ? <CheckCheck className="w-4 h-4 ml-1 text-blue-400" />
                          : <Check className="w-4 h-4 ml-1 text-blue-200" />
                      )}
                    </div>
                  </div>
                  {isMine && (
                    <Image
                      src={getAvatar(msg)}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ml-2 border bg-white object-cover"
                      width={32}
                      height={32}
                      unoptimized
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Form input chat */}
        <form onSubmit={handleSend} className="flex gap-2 w-full sticky bottom-0 z-10 bg-transparent">
          <button
            type="button"
            id="emoji-trigger"
            className="text-yellow-500 px-1"
            onClick={() => setShowEmoji((s) => !s)}
            tabIndex={-1}
          >
            😃
          </button>
          {showEmoji && (
            <div className="absolute bottom-16 left-2 z-50">
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => {
                  setNewMsg((msg) => msg + (emojiData.emoji || ""));
                  setShowEmoji(false);
                }}
                width={300}
                height={350}
                theme={Theme.LIGHT}
              />
            </div>
          )}
          <button
            type="button"
            className="text-blue-500 px-1"
            disabled={sendingFile}
            onClick={() => fileInputRef.current?.click()}
          >
            {sendingFile ? <Loader2 className="animate-spin" /> : <Paperclip />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,application/msword,application/vnd.ms-excel,application/zip"
            hidden
            onChange={handleFile}
            disabled={sendingFile}
          />
          <input
            type="text"
            className="flex-1 border rounded-2xl px-4 py-2 shadow-sm outline-none focus:ring focus:border-blue-400 transition text-base"
            placeholder="Ketik pesan..."
            value={newMsg}
            autoComplete="off"
            onChange={(e) => setNewMsg(e.target.value)}
            disabled={sendingFile}
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
            disabled={!newMsg.trim() || sendingFile}
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
