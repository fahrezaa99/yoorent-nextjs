"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/components/common/AuthProvider";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

type Owner = {
  name: string;
  avatar: string;
  online: boolean;
  verified?: boolean;
};
type Item = {
  name: string;
  price: string;
  location?: string;
};

type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  product_id?: string;
  message: string;
  created_at: string;
};
type ChatRoomProps = {
  userId?: string;
  receiverId: string;
  owner: Owner;
  barang: Item;
  productId: string;
  chatId?: string; // <-- tambahkan
};

export default function ChatRoom({
  userId: userIdProp,
  receiverId,
  owner,
  barang,
  productId,
  chatId: chatIdProp // <-- tambahkan
}: ChatRoomProps) {
  const { user, loading } = useAuth();
  const userId = userIdProp ?? user?.id ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // PATCH: ref untuk auto focus input
  const inputRef = useRef<HTMLInputElement>(null);

  // PATCH: auto focus setelah kirim pesan
  const [shouldFocus, setShouldFocus] = useState(false);

  // === PATCH EMOJI PICKER ===
  const [showEmoji, setShowEmoji] = useState(false);

  const quickReplies = [
    "Halo, apakah barang masih tersedia?",
    "Bisa antar ke lokasi saya?",
    "Ada diskon untuk sewa lebih lama?",
  ];

  if (loading) return null;

  // Ambil chat history (sekali di mount)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !receiverId || !productId) return;
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${receiverId},product_id.eq.${productId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId},product_id.eq.${productId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Fetch messages error:", error);
        return;
      }
      setMessages(data || []);
    };
    fetchMessages();
    // eslint-disable-next-line
  }, [userId, receiverId, productId]);

  // Realtime subscribe
  useEffect(() => {
    if (!userId || !receiverId || !productId) return;

    const channel = supabase
      .channel("messages-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${userId},receiver_id.eq.${receiverId},product_id.eq.${productId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId},product_id.eq.${productId}))`,
        },
        (payload) => {
          setMessages((msgs) => {
            if (msgs.some((m) => m.id === payload.new.id)) return msgs;
            return [...msgs, payload.new as Message];
          });

          if (
            payload.new.receiver_id === userId &&
            payload.new.sender_id !== userId
          ) {
            toast("Pesan baru masuk!", {
              description: payload.new.message?.slice(0, 80) ?? "Ada pesan baru.",
              duration: 4000,
              icon: "💬",
            });
            try {
              const audio = new Audio("/notif.mp3");
              audio.play();
            } catch {}
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId, productId]);

  // PATCH: auto scroll ke bawah tiap ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // PATCH: auto focus input saat buka chat
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [input, productId]);

  // PATCH: auto focus input setelah kirim pesan
  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  // Kirim pesan (optimistic update, TIDAK fetch ulang)
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId || !receiverId || !productId) return;
    setSending(true);

    let chatId = null;
    // Cari/insert chat channel
    const { data: existing } = await supabase
      .from("chats")
      .select("id")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${receiverId},product_id.eq.${productId}),
        and(sender_id.eq.${receiverId},receiver_id.eq.${userId},product_id.eq.${productId})`
      )
      .maybeSingle();

    if (existing && existing.id) {
      chatId = existing.id;
    } else {
      const { data: newChat, error: insertChatError } = await supabase
        .from("chats")
        .insert([{ sender_id: userId, receiver_id: receiverId, product_id: productId }])
        .select()
        .single();

      if (insertChatError) {
        toast.error("Gagal membuat chat baru: " + (insertChatError.message || JSON.stringify(insertChatError)));
        setSending(false);
        return;
      }
      if (!newChat || !newChat.id) {
        toast.error("Gagal mendapatkan ID chat baru");
        setSending(false);
        return;
      }
      chatId = newChat.id;
    }

    if (!chatId) {
      toast.error("Gagal mendapatkan chat id");
      setSending(false);
      return;
    }

    const newMsg: Message = {
      id: uuidv4(),
      chat_id: chatId,
      sender_id: userId,
      receiver_id: receiverId,
      product_id: productId,
      message: input.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setShouldFocus(true);

    const { error } = await supabase.from("messages").insert([newMsg]);
    if (error) {
      toast.error("Gagal kirim pesan!");
      setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
    }
    setSending(false);
  };

  // PATCH: focus juga setelah klik Quick Reply
  const handleQuickReply = (msg: string) => {
    setInput(msg);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // PATCH: Handler klik emoji
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + (emojiData.emoji || ""));
    setShowEmoji(false);
    setTimeout(() => inputRef.current?.focus(), 0);
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

  return (
    <div className="flex flex-col h-[90vh] max-h-[600px] max-w-lg w-full bg-white rounded-2xl shadow-xl border overflow-hidden relative mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src={owner.avatar}
            className="w-11 h-11 rounded-full border-2 border-blue-400"
            alt="avatar"
          />
          <div className="flex-1">
            <div className="font-semibold flex items-center gap-1 text-gray-800">
              {owner.name}
              {owner.verified && (
                <span className="text-green-500 ml-1" title="Terverifikasi">
                  ✔️
                </span>
              )}
              {owner.online && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Online
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div>
                <div className="text-xs text-gray-500">
                  {barang.name}
                  <span className="text-blue-500 font-semibold ml-1">
                    {barang.price}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{barang.location}</div>
              </div>
              <button
                className="ml-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow transition duration-150 ease-in-out flex items-center gap-1"
                tabIndex={-1}
                style={{ minWidth: 120, boxShadow: "0 2px 8px #1d4ed81a" }}
              >
                <ShoppingBag className="inline-block w-4 h-4 mr-1" />
                Sewa Barang Ini
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reply */}
      <div className="flex gap-2 p-3 border-b bg-blue-50/80 overflow-x-auto">
        {quickReplies.map((q, i) => (
          <button
            key={i}
            className="text-xs bg-white border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded-full shadow transition"
            onClick={() => handleQuickReply(q)}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50/50">
        {messages.length === 0 && (
          <div className="flex justify-center items-center text-gray-400 h-full">
            Belum ada chat.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                px-4 py-2 rounded-2xl
                ${
                  msg.sender_id === userId
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border border-blue-100 text-blue-900 rounded-bl-md"
                }
                max-w-[75%] break-words relative
              `}
            >
              <span>{msg.message}</span>
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.sender_id === userId ? "text-blue-100" : "text-blue-300"
                }`}
              >
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 bg-white border-t relative"
      >
        <button
          type="button"
          className="text-2xl text-gray-400 hover:text-blue-500 transition"
          tabIndex={-1}
          id="emoji-trigger"
          onClick={() => setShowEmoji((s) => !s)}
          aria-label="Insert emoji"
        >
          😊
        </button>

        {showEmoji && (
          <div className="absolute bottom-14 left-0 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={350}
              theme={Theme.LIGHT}
            />
          </div>
        )}

        <input
          autoFocus
          type="text"
          className="flex-1 border border-blue-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Tulis pesan…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          ref={inputRef}
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow hover:bg-blue-700 transition ${
            sending && "opacity-60 cursor-not-allowed"
          }`}
          disabled={!input.trim() || sending}
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
