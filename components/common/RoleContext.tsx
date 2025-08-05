"use client";
import { createContext, useContext } from "react";

export const RoleContext = createContext<{
  role: "penyewa" | "pemilik";
  setRole: (role: "penyewa" | "pemilik") => void;
}>({
  role: "penyewa",
  setRole: () => {},
});

export function useRole() {
  return useContext(RoleContext);
}
