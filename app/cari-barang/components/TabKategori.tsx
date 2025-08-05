import React from "react";

interface TabKategoriProps {
  kategoriList: { key: string; label: string }[];
  selected: string;
  onSelect: (kategori: string) => void;
}

const TabKategori: React.FC<TabKategoriProps> = ({
  kategoriList,
  selected,
  onSelect,
}) => {
  return (
    <div className="flex gap-3 mb-7 overflow-x-auto pb-2">
      {kategoriList.map((k) => (
        <button
          key={k.key}
          className={`px-5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
            selected === k.label ||
            (selected === "Semua" && k.key === "top")
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-blue-50"
          }`}
          onClick={() => onSelect(k.label === "Top" ? "Semua" : k.label)}
          type="button"
        >
          {k.label}
        </button>
      ))}
    </div>
  );
};

export default TabKategori;
