// components/UserAvatar.tsx
import Image from "next/image";
import { User2 } from "lucide-react";

interface UserMeta {
  avatar_url?: string;
  full_name?: string;
}
interface UserType {
  email?: string;
  user_metadata?: UserMeta;
}

export default function UserAvatar({ user, size = 36 }: { user?: UserType | null; size?: number }) {
  // Ambil nama, inisial, foto
  const name = user?.user_metadata?.full_name || user?.email || "";
  const firstChar = name[0]?.toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const avatarSize = size || 40;

  return (
    <span
      className={`
        flex items-center justify-center rounded-full
        bg-gradient-to-br from-blue-500 to-blue-800
        shadow-md border-2 border-white/80 ring-2 ring-blue-200
        relative overflow-hidden
      `}
      style={{ width: avatarSize, height: avatarSize, minWidth: avatarSize }}
      title={name}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="User"
          width={avatarSize}
          height={avatarSize}
          className="object-cover w-full h-full rounded-full"
        />
      ) : name ? (
        <span className="text-lg sm:text-xl font-extrabold text-white drop-shadow">{firstChar}</span>
      ) : (
        <User2 className="w-2/3 h-2/3 text-white/70" />
      )}
      {/* Online Indicator? Uncomment di bawah jika mau */}
      {/* <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 border-2 border-white rounded-full"></span> */}
    </span>
  );
}
