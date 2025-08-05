import { FaCommentDots } from "react-icons/fa";

export default function BarangCardActions({
  onSewaClick,
  onChatClick,
  onBeliClick,
  bisaDibeli,
  isLoggedIn,
  ownerId,
  userId,
  mounted,
  itemId,
  ownerName,
  sedangDisewa, // PATCH: tambahkan prop ini!
}: any) {
  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      {/* Tombol Sewa & Beli Sejajar */}
      <div className="flex gap-2">
        {mounted && (
          <button
            className={`flex-1 px-4 py-2 rounded-xl font-bold shadow transition text-center
              ${sedangDisewa
                ? "bg-gray-800 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"}
            `}
            onClick={e => {
              if (sedangDisewa) return;
              e.preventDefault();
              if (!isLoggedIn) {
                onSewaClick && onSewaClick();
              } else {
                window.location.href = `/barang/${itemId}`;
              }
            }}
            type="button"
            disabled={sedangDisewa}
          >
            {sedangDisewa ? "Sedang Disewa" : "Sewa"}
          </button>
        )}
        {mounted && bisaDibeli && (
          <button
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow transition text-center"
            onClick={e => {
              e.preventDefault();
              onBeliClick && onBeliClick();
            }}
            type="button"
          >
            Beli
          </button>
        )}
      </div>
      {/* Tombol Chat tetap di bawah */}
      {mounted && isLoggedIn && ownerId && userId !== ownerId && (
        <button
          onClick={onChatClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 shadow transition text-base focus:outline-none focus:ring-2 focus:ring-green-200"
          title={`Chat ${ownerName}`}
          type="button"
        >
          <FaCommentDots className="text-lg" />
          Chat Pemilik
        </button>
      )}
    </div>
  );
}
