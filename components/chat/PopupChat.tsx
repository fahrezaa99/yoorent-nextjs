import ChatRoom from "@/components/chat/ChatRoom";

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

type PopupChatProps = {
  receiverId: string;
  owner: Owner;
  barang: Item;
  productId: string;        // WAJIB!
  onClose?: () => void;
};

export default function PopupChat({
  receiverId,
  barang,
  owner,
  productId,                // WAJIB!
  onClose,
}: PopupChatProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Overlay close area */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Tutup chat"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeInUp">
        {/* Tombol close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-2xl z-20"
            aria-label="Tutup chat"
            type="button"
          >
            ×
          </button>
        )}
        {/* PATCH: Kirimkan productId ke ChatRoom */}
        <ChatRoom
          receiverId={receiverId}
          barang={barang}
          owner={owner}
          productId={productId}      // pastikan selalu dipass!
        />
      </div>
      <style jsx>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.22s cubic-bezier(0.4, 0.1, 0.45, 1.2);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
