import React from "react";

interface LoadingModalProps {
  show: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ show, message = "Loading..." }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/30 border border-white/60 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6 max-w-xs w-[88vw] glass-card animate-fade-in">
        {/* Spinner */}
        <div className="relative flex justify-center items-center h-16 w-16 mb-2">
          <div className="absolute h-full w-full flex items-center justify-center">
            <svg className="animate-spin-slow h-16 w-16 text-blue-400/70" fill="none" viewBox="0 0 48 48">
              <circle className="opacity-40" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6"/>
              <path
                d="M24 4a20 20 0 0120 20"
                stroke="#60a5fa"
                strokeWidth="6"
                strokeLinecap="round"
                className="origin-center animate-pulse"
              />
            </svg>
          </div>
          <div className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-blue-300 blur-lg opacity-60"></div>
        </div>
        {/* Text */}
        <span className="text-xl font-bold text-white drop-shadow text-center leading-snug tracking-wide select-none">
          {message}
        </span>
      </div>
      <style jsx>{`
        .glass-card {
          backdrop-filter: blur(12px) saturate(160%);
          background-color: rgba(255,255,255,0.18);
        }
        .animate-fade-in {
          animation: fadeIn 0.35s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-spin-slow {
          animation: spin 1.2s linear infinite;
        }
        @media (max-width: 480px) {
          span {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
