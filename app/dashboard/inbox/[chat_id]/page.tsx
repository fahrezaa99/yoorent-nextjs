"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"; // ✅ DIUBAH DI SINI
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
  barang_id?: string;
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMsg((msg) => msg + (emojiData.emoji || ""));
    setShowEmoji(false);
  };

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

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getUser = async () => {
      const res = await supabase.auth.getUser();
      setUserId(res.data.user?.id ?? null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!chat_id) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchMsgs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chat")
        .select("*")
        .eq("chat_id", chat_id)
        .order("created_at", { ascending: true });
      setMessages((data as Message[]) || []);
      setLoading(false);

      if (
        data &&
        userId &&
        data.some((msg: Message) => msg.receiver_id === userId && !msg.is_read)
      ) {
        await supabase
          .from("chat")
          .update({ is_read: true })
          .eq("chat_id", chat_id)
          .eq("receiver_id", userId)
          .eq("is_read", false);
      }
    };

    fetchMsgs();

    channel = supabase
      .channel("chat-detail")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat", filter: `chat_id=eq.${chat_id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
          if (
            payload.eventType === "INSERT" &&
            (payload.new as Message).receiver_id === userId
          ) {
            supabase
              .from("chat")
              .update({ is_read: true })
              .eq("id", (payload.new as Message).id);
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [chat_id, userId]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userId || !newMsg.trim()) return;

    let receiverId: string | null = null;
    let barangId: string | null = null;
    for (const msg of messages) {
      if (msg.sender_id !== userId) receiverId = msg.sender_id;
      if (msg.receiver_id !== userId) receiverId = msg.receiver_id;
      if (msg.barang_id) barangId = msg.barang_id;
      if (receiverId && barangId) break;
    }
    if (!receiverId || !barangId) {
      alert("receiver_id/barang_id tidak ditemukan!");
      return;
    }

    const { error } = await supabase.from("chat").insert([{
      chat_id,
      sender_id: userId,
      receiver_id: receiverId,
      barang_id: barangId,
      message: newMsg,
      is_read: false,
    }]);

    if (!error) setNewMsg("");
    else alert("Gagal kirim pesan: " + error.message);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setSendingFile(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 9999)}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("chat-files")
      .upload(fileName, file, { upsert: true });

    if (!error && data?.path) {
      let receiverId: string | null = null;
      let barangId: string | null = null;
      for (const msg of messages) {
        if (msg.sender_id !== userId) receiverId = msg.sender_id;
        if (msg.receiver_id !== userId) receiverId = msg.receiver_id;
        if (msg.barang_id) barangId = msg.barang_id;
        if (receiverId && barangId) break;
      }
      if (!receiverId || !barangId) {
        alert("receiver_id/barang_id tidak ditemukan!");
        setSendingFile(false);
        return;
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chat-files/${fileName}`;
      await supabase.from("chat").insert([{
        chat_id,
        sender_id: userId,
        receiver_id: receiverId,
        barang_id: barangId,
        message: "",
        file_url: publicUrl,
        is_read: false,
      }]);
    }

    setSendingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!userId)
    return (
      <div className="py-10 text-center">Harap login dulu</div>
    );

  const getAvatar = (msg: Message) =>
    msg.avatar_url
      ? msg.avatar_url
      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${msg.sender_id.slice(-8)}`;

  return (
    <div className="w-full flex flex-col items-center min-h-[90vh] bg-[#f1f7ff] px-2 py-6">
      <div className="w-full max-w-2xl">
        <h2 className="font-bold text-2xl mb-5 text-blue-700 text-center">Chat Detail</h2>
        <div className="bg-white rounded-xl shadow p-4 max-h-[65vh] min-h-[320px] overflow-y-auto mb-4 flex flex-col gap-2">
          {loading ? (
            <div>Loading...</div>
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
                    {msg.message && <div className="text-[15px]">{msg.message}</div>}
                    <div className={`flex items-center gap-1 text-[11px] mt-1 ${
                      isMine ? "justify-end text-blue-200" : "justify-start text-gray-400"
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

        {/* Form balas */}
        <form onSubmit={handleSend} className="flex gap-2 w-full sticky bottom-0">
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
                onEmojiClick={handleEmojiClick}
                width={300}
                height={350}
                theme={Theme.LIGHT} // ✅ UBAH DI SINI
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
