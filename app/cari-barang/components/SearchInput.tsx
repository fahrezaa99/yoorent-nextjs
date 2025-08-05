"use client";
import { Search } from "lucide-react"; // atau bisa ganti ke heroicons, tablericons dsb

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="w-full flex justify-center my-4">
      <div className="relative w-full max-w-xl">
        {/* Icon Search */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
        <input
          type="text"
          className="
            w-full rounded-xl border border-gray-200
            bg-white py-3 pl-11 pr-4 text-gray-700 text-base
            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200
            placeholder-gray-400
            transition
          "
          placeholder="Cari nama barang, lokasi, atau pemilik..."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {/* Optional: Clear button */}
        {value && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414l4.95-4.95-4.95-4.95A1 1 0 015.05 3.636L10 8.586z" clipRule="evenodd" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
