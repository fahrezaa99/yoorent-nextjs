"use client";
import { createContext, useContext, useState } from "react";

type Direction = "left" | "right";

const PageTransitionContext = createContext<{
  direction: Direction;
  setDirection: (d: Direction) => void;
}>({
  direction: "right",
  setDirection: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<Direction>("right");
  return (
    <PageTransitionContext.Provider value={{ direction, setDirection }}>
      {children}
    </PageTransitionContext.Provider>
  );
}
