import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean; // ✅ ini ditambahkan
};

export function Button({
  children,
  className = "",
  loading = false,
  variant = "primary",
  disabled = false, // ✅ default value biar aman
  ...props
}: ButtonProps) {
  const base =
    "h-11 px-5 flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400";
  let variantClass = "";

  if (variant === "primary") {
    variantClass =
      "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow hover:from-blue-600 hover:to-blue-500";
  } else if (variant === "secondary") {
    variantClass =
      "bg-gray-200 text-blue-800 hover:bg-gray-300";
  } else if (variant === "outline") {
    variantClass =
      "border border-blue-500 text-blue-500 bg-white hover:bg-blue-50";
  }

  const responsive = "w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg whitespace-nowrap";

  return (
    <button
      className={`${base} ${variantClass} ${responsive} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
      ) : null}
      {children}
    </button>
  );
}
