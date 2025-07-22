"use client";

import { SessionProvider } from "next-auth/react";

type ClientLayoutProps = {
  children: React.ReactNode;
  setShowToast?: React.Dispatch<React.SetStateAction<boolean>>;
  setToastMsg?: React.Dispatch<React.SetStateAction<string>>;
};

export default function ClientLayout({
  children,
  setShowToast,
  setToastMsg,
}: ClientLayoutProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
