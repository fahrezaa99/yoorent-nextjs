// components/ChatIcon.tsx
import React from "react";

interface ChatIconProps {
  className?: string;
}

const ChatIcon: React.FC<ChatIconProps> = ({ className = "w-6 h-6" }) => (
  <svg
    className={className + " text-gray-600 hover:text-blue-600 transition"}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.869 8.869 0 01-4-.93L3 19l1.316-3.29A7.964 7.964 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
    />
  </svg>
);

export default ChatIcon;
