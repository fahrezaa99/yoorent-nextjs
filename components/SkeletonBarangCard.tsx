export default function SkeletonBarangCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col animate-pulse min-h-[320px]">
      <div className="bg-gray-200 h-44 w-full rounded-xl mb-4"></div>
      <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-1/3 rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-2/3 rounded mb-2"></div>
      <div className="bg-gray-200 h-8 w-2/5 rounded mt-auto"></div>
    </div>
  );
}
