"use client";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const locations = [
  "Jakarta",
  "Bandung",
  "Surabaya",
];

interface LocationDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function LocationDropdown({
  value,
  onChange,
  className = "",
}: LocationDropdownProps) {
  const [selected, setSelected] = useState(value || locations[0]);

  const handleChange = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={`w-full min-w-[130px] ${className}`}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[56px] text-lg font-semibold`}>
            {selected}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-2 w-full rounded-xl bg-white shadow-lg z-20 overflow-auto max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {locations.map((location) => (
                <Listbox.Option
                  key={location}
                  value={location}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 text-lg font-semibold min-h-[42px] ${
                      active ? "bg-blue-100 text-blue-800" : "text-gray-800"
                    }`
                  }
                >
                  {location}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
