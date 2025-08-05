// components/chat/ChatHeader.tsx
import React from "react";
interface Props {
  owner: { name: string; avatar: string; online: boolean; verified?: boolean };
  item: { name: string; price: string; location?: string };
}
export default function ChatHeader({ owner, item }: Props) {
  return (
    <div className="flex items-center border-b p-3 bg-white rounded-t-2xl">
      <img src={owner.avatar} className="w-10 h-10 rounded-full mr-3" alt="avatar" />
      <div>
        <div className="font-bold flex items-center gap-1">
          {owner.name}
          {owner.verified && <span className="ml-1 text-green-600 text-xs font-semibold">✔️</span>}
          {owner.online && (
            <span className="ml-2 bg-green-200 text-green-900 px-2 py-0.5 rounded-full text-xs">Online</span>
          )}
        </div>
        <div className="text-xs text-gray-500">{item.name} – {item.price}</div>
        <div className="text-xs text-gray-400">{item.location}</div>
      </div>
      <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl text-sm">
        Sewa Barang Ini
      </button>
    </div>
  );
}
