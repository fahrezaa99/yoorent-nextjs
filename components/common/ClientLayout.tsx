"use client";

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
  // Tidak perlu wrap dengan SessionProvider lagi!
  return <>{children}</>;
}
