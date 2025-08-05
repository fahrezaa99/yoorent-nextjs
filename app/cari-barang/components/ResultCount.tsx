interface ResultCountProps {
  count: number;
}
export default function ResultCount({ count }: ResultCountProps) {
  return (
    <span className="text-gray-600 text-base md:text-lg font-semibold tracking-tight bg-white rounded-lg px-4 py-1 shadow-sm">
      {count} barang ditemukan
    </span>
  );
}
