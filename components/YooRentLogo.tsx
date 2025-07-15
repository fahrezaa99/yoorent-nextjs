"use client";
import React from "react";

interface LogoProps {
  size?: number; // size = tinggi/lebarnya logo kamera (misal 60)
}

const YooRentLogo: React.FC<LogoProps> = ({ size = 60 }) => {
  return (
    <div className="flex items-center gap-4 select-none" style={{ height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        aria-label="YooRent Camera Logo"
      >
        {/* Body kamera */}
        <rect
          x="4"
          y="15"
          width="52"
          height="32"
          rx="10"
          fill="#1B2735"
        />
        {/* Tonjolan kiri kamera */}
        <rect
          x="10"
          y="8"
          width="10"
          height="10"
          rx="3"
          fill="#1B2735"
        />
        {/* Lensa putih BESAR */}
        <circle
          cx="30"
          cy="31"
          r="14"
          fill="#fff"
        />
        {/* Huruf Y sangat tebal & besar */}
        <text
          x="30"
          y="39"
          textAnchor="middle"
          fill="#21706D"
          fontSize="24"
          fontWeight="bold"
          fontFamily="Inter, Arial, sans-serif"
        >
          Y
        </text>
      </svg>
      {/* Teks YooRent */}
      <span
        className="font-extrabold tracking-tight"
        style={{
          fontSize: "2rem",
          lineHeight: "1",
          color: "#fff",
          letterSpacing: "-0.03em",
        }}
      >
        YooRent
      </span>
    </div>
  );
};

export default YooRentLogo;
