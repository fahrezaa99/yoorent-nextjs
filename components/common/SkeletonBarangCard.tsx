const shimmer =
  "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-50 flex flex-col group relative">
      {/* Gambar skeleton */}
      <div className={`${shimmer} w-full h-40 rounded-t-2xl`} />

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Status & Favorite */}
        <div className="flex items-center justify-between mb-3">
          <div className={`${shimmer} w-20 h-5 rounded-full`} />
          <div className={`${shimmer} w-8 h-8 rounded-full`} />
        </div>
        {/* Judul */}
        <div className={`${shimmer} w-4/5 h-6 rounded mb-2`} />
        {/* Lokasi */}
        <div className={`${shimmer} w-1/3 h-4 rounded mb-2`} />
        {/* Owner */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`${shimmer} w-8 h-8 rounded-full`} />
          <div>
            <div className={`${shimmer} w-16 h-3 rounded mb-1`} />
            <div className={`${shimmer} w-12 h-3 rounded`} />
          </div>
        </div>
        {/* Rating */}
        <div className={`${shimmer} w-24 h-4 rounded mb-3`} />
        {/* Harga */}
        <div className={`${shimmer} w-2/5 h-5 rounded mb-4`} />
        {/* Tombol */}
        <div className="flex gap-2 mt-auto">
          <div className={`${shimmer} h-10 rounded-xl flex-1`} />
          <div className={`${shimmer} h-10 rounded-xl flex-1`} />
        </div>
      </div>
    </div>
  );
}
