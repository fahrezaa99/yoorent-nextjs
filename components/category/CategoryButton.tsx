// components/CategoryButton.tsx
import React from 'react';

type CategoryButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const CategoryButton: React.FC<CategoryButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-40 h-36 bg-white rounded-xl shadow-md hover:shadow-xl transition border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 m-2"
    >
      <div className="text-5xl mb-3">{icon}</div>
      <span className="font-semibold text-lg text-black">{label}</span>
    </button>
  );
};

export default CategoryButton;
