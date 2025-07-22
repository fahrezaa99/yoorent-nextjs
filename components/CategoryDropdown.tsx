"use client";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

const categories = [
  "Semua Kategori",
  "Kamera & Elektronik",
  "Handphone & Gadget",
  "Laptop & Komputer",
  "Kendaraan",
  "Properti",
  "Alat Berat",
  "Fashion & Aksesoris",
  "Outdoor & Camping",
  "Lainnya",
];

interface CategoryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function CategoryDropdown({
  value,
  onChange,
  className = "",
}: CategoryDropdownProps) {
  const [selected, setSelected] = useState(value || categories[0]);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleChange = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={`w-full ${className}`}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button
            className="
              w-full
              min-w-[180px]
              max-w-full
              rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2
              text-left
              cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-400
              transition
              truncate
              text-lg font-semibold
              min-h-[56px]
            "
          >
            {selected}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="
                absolute
                mt-2
                w-full
                min-w-[180px]
                max-w-[90vw]
                rounded-xl
                bg-white
                shadow-lg
                z-20
                overflow-auto
                max-h-60
                ring-1 ring-black ring-opacity-5
                focus:outline-none
              "
            >
              {categories.map((category) => (
                <Listbox.Option
                  key={category}
                  value={category}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 text-lg font-semibold min-h-[42px] ${
                      active
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-800"
                    }`
                  }
                >
                  <span className="block truncate">{category}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
