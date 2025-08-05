// components/chat/ChatBubble.tsx
import React from "react";
interface Props {
  isOwner: boolean;
  text: string;
  time: string;
}
export default function ChatBubble({ isOwner, text, time }: Props) {
  return (
    <div className={`flex ${isOwner ? "justify-start" : "justify-end"}`}>
      <div className={`rounded-2xl px-4 py-2 max-w-[70%] ${isOwner ? "bg-gray-200 text-black" : "bg-blue-600 text-white"}`}>
        <span>{text}</span>
        <div className="text-xs text-gray-400 mt-1 text-right">{time}</div>
      </div>
    </div>
  );
}
