"use client";

interface Category {
  name: string;
  emoji: string;
}

const categories: Category[] = [
  { name: "Kamera", emoji: "📷" },
  { name: "Elektronik", emoji: "🔌" },
  { name: "Outdoor", emoji: "⛺" },
  { name: "Kendaraan", emoji: "🚗" },
  { name: "Event", emoji: "🎤" },
  { name: "Perkakas", emoji: "🔧" },
];

export default function CategoryGrid() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Kategori Populer</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center py-5 hover:scale-105 transition cursor-pointer"
          >
            <span className="text-3xl mb-2">{cat.emoji}</span>
            <span className="text-base font-medium">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
