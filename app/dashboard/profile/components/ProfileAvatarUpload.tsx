// app/dashboard/profile/components/ProfileAvatarUpload.tsx
"use client";
import { useRef } from "react";
import { FaCamera } from "react-icons/fa";

type Props = {
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
};

export default function ProfileAvatarUpload({ preview, onFileChange, uploading }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <button
        type="button"
        className="relative w-20 h-20 rounded-full border-2 border-blue-300 bg-gray-50 flex items-center justify-center shadow group"
        onClick={() => fileInput.current?.click()}
      >
        <img
          src={preview || "/default-avatar.png"}
          alt="Preview"
          className="w-full h-full rounded-full object-cover"
        />
        <span className="absolute bottom-1 right-1 bg-white p-1 rounded-full border shadow group-hover:bg-blue-100">
          <FaCamera className="text-blue-600 text-xl" />
        </span>
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={onFileChange}
        disabled={uploading}
      />
      {uploading && (
        <span className="text-xs text-blue-600 mt-1">Uploading...</span>
      )}
      <span className="text-xs text-gray-500">Klik foto untuk ganti</span>
    </div>
  );
}
