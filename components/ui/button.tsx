import React from "react";

export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
