"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Paperclip, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useAuth } from "@/components/common/AuthProvider"; // Ambil user dari context!

interface Message {
  id?: string;
  chat_id: string;
  barang_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  file_url?: string | null;
}

interface BarangInfo {
  id?: string;
  nama?: string;
  foto?: string[];
  harga?: number;
  kategori?: string;
  lokasi?: string;
  // ...tambahkan kalau ada field lain
}

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  barangId: string;
  userId?: string; // <-- Boleh dari props atau context
  receiverId: string;
  receiverName?: string;
  barang?: BarangInfo;
  ownerName?: string;
  ownerFoto?: string;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatModal({
  open,
  onClose,
  barangId,
  userId: userIdProp,
  receiverId,
  receiverName,
  barang,
  ownerName,
  ownerFoto,
}: ChatModalProps) {
  // Ambil user dari context jika props userId tidak dikirim
  const { user, loading: authLoading } = useAuth();
  const userId = userIdProp ?? user?.id ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingFile, setSendingFile] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }
    if (showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  useEffect(() => {
    if (!open || !barangId || !userId || !receiverId) return;
    const fetchChatId = async () => {
      const { data } = await supabase
        .from("chat")
        .select("chat_id")
        .eq("barang_id", barangId)
        .or(`(sender_id.eq.${userId},receiver_id.eq.${receiverId})`)
        .or(`(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
        .order("created_at", { ascending: true })
        .limit(1);

      let threadId = data?.[0]?.chat_id;
      if (!threadId) threadId = uuidv4();
      setChatId(threadId);
    };
    fetchChatId();
  }, [open, barangId, userId, receiverId]);

  useEffect(() => {
    if (!open || !chatId) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      setMessages((data as Message[]) ?? []);
      if (data && data.length > 0) {
        const lastMsg = [...data].reverse().find((m) => m.sender_id === receiverId);
        setLastSeen(lastMsg ? lastMsg.created_at : null);
      }
    };
    fetchMessages();

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message]);
            if ((payload.new as Message).sender_id === receiverId) {
              setLastSeen((payload.new as Message).created_at);
            }
            if ((payload.new as Message).sender_id !== userId) {
              toast("Pesan baru masuk", { icon: "💬" });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, chatId, userId, receiverId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;
    setLoading(true);
    const { error } = await supabase.from("chat").insert([
      {
        chat_id: chatId,
        barang_id: barangId,
        sender_id: userId,
        receiver_id: receiverId,
        message: input,
        file_url: null,
      },
    ]);
    if (error) toast.error("Gagal mengirim pesan");
    setInput("");
    setLoading(false);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;
    setSendingFile(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${barangId}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("chat-files")
      .upload(fileName, file, { upsert: true });

    if (!error && data?.path) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chat-files/${fileName}`;
      await supabase.from("chat").insert([
        {
          chat_id: chatId,
          barang_id: barangId,
          sender_id: userId,
          receiver_id: receiverId,
          message: "",
          file_url: url,
        },
      ]);
    } else {
      toast.error("Gagal upload file/gambar");
    }

    setSendingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Tahan render sampai context siap
  if (authLoading) return null;

  // Tombol "buka di halaman chat" tetap muncul bahkan kalau userId==receiverId
  if (userId === receiverId) {
    return (
      open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-[95vw] max-w-xs mx-auto">
            <h3 className="font-bold text-lg mb-3">Chat Barang</h3>
            <p className="text-gray-500 text-sm mb-5">Kamu tidak bisa chat ke diri sendiri.</p>
            <a
              href={`/chat?to=${receiverId}&barang=${barangId}`}
              className="block w-full text-center py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition mb-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka di Halaman Chat
            </a>
            <button onClick={onClose} className="w-full py-2 bg-blue-600 text-white rounded-lg mt-3">
              Tutup
            </button>
          </div>
        </div>
      )
    );
  }

  // === MODAL UTAMA ===
  return (
    open && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2 animate-fadeIn">
        <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md mx-auto flex flex-col min-h-[460px] max-h-[90vh] shadow-lg">

          {/* === HEADER MODERN === */}
          <div className="flex items-center gap-3 p-4 border-b">
            {/* Foto Barang */}
            <img
              src={barang?.foto?.[0] || "/placeholder.png"}
              alt={barang?.nama || "Barang"}
              className="w-12 h-12 rounded-lg object-cover border"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base truncate">{barang?.nama || "Barang Sewa"}</div>
              <div className="text-xs text-gray-400 truncate">
                {barang?.kategori} &bull; {barang?.lokasi}
              </div>
              <div className="text-sm font-semibold text-blue-600">
                {barang?.harga ? `Rp ${barang.harga.toLocaleString("id-ID")}` : ""}
              </div>
            </div>
            {/* Tombol tutup modal */}
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-red-500 transition p-2 rounded-full"
              aria-label="Tutup"
            >
              <span aria-hidden>X</span>
            </button>
          </div>
          {/* === INFO OWNER & TOMBOL SEWA === */}
          <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50">
            <img
              src={ownerFoto || "/default-avatar.png"}
              alt={ownerName || receiverName || "Owner"}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div className="flex flex-col min-w-0">
              <div className="font-medium text-sm truncate">{ownerName || receiverName || "Pemilik Barang"}</div>
              <span className="text-xs text-green-600 font-semibold">Online</span>
            </div>
            {/* Tombol Sewa Barang */}
            {barang?.id && (
              <a
                href={`/sewa/${barang.id}`}
                className="ml-auto bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg text-xs transition"
                style={{ whiteSpace: "nowrap" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Sewa Barang Ini
              </a>
            )}
          </div>

          {/* === BODY CHAT === */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center pt-10">Belum ada chat.</div>
            )}
            {messages.map((msg, idx) => {
              const isMine = msg.sender_id === userId;
              return (
                <div key={msg.id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[74%]`}>
                    <div
                      className={`px-3 py-2 rounded-2xl break-words shadow ${
                        isMine
                          ? "bg-blue-600 text-white rounded-tr-md"
                          : "bg-white border rounded-tl-md"
                      }`}
                    >
                      {msg.file_url && msg.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={msg.file_url}
                            alt="Gambar"
                            width={160}
                            height={120}
                            className="w-40 h-32 rounded-lg object-cover mb-1"
                          />
                        </a>
                      ) : msg.file_url ? (
                        <a
                          href={msg.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline flex items-center gap-1"
                        >
                          <Paperclip size={16} /> File
                        </a>
                      ) : null}
                      {msg.message && <div className="text-sm">{msg.message}</div>}
                      <div className="text-[11px] opacity-60 mt-1 text-right">
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>

          {/* === INPUT CHAT === */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t flex gap-2 bg-white relative"
          >
            <button type="button" title="Emoji" className="text-yellow-500 px-1" onClick={() => setShowEmoji((s) => !s)} tabIndex={-1}>😃</button>
            {showEmoji && (
              <div className="absolute bottom-14 left-0 z-50" ref={pickerRef}>
                <EmojiPicker
                  onEmojiClick={(emojiObj) => {
                    setInput((input) => input + emojiObj.emoji);
                    setShowEmoji(false);
                  }}
                  width={300}
                  height={350}
                  theme={"light" as Theme}
                />
              </div>
            )}
            <button
              type="button"
              title="Kirim gambar/file"
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
              className="flex-1 border rounded-lg px-3 py-2 bg-gray-100 outline-none text-[15px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan…"
              disabled={loading || sendingFile}
              maxLength={500}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    )
  );
}
