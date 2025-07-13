import React from "react";

export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-lg shadow-md p-6 bg-white dark:bg-zinc-800 ${className}`}>
      {children}
    </div>
  );
}
