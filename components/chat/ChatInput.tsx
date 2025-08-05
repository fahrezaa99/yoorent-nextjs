// components/chat/ChatInput.tsx
import React, { useState } from "react";
export default function ChatInput() {
  const [value, setValue] = useState("");
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle send message logic
    setValue("");
  };
  return (
    <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t bg-white rounded-b-2xl">
      <button type="button" className="text-gray-400 hover:text-blue-600">
        😊
      </button>
      <input
        className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        placeholder="Tulis pesan..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
      >
        Kirim
      </button>
    </form>
  );
}
