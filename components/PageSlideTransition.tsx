// components/PageSlideTransition.tsx
"use client";
import { motion } from "framer-motion";

export default function PageSlideTransition({
  direction = "right",
  children,
}: {
  direction: "left" | "right";
  children: React.ReactNode;
}) {
  const variants =
    direction === "right"
      ? {
          initial: { x: 160, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -160, opacity: 0 },
        }
      : {
          initial: { x: -160, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 160, opacity: 0 },
        };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.38, ease: "easeInOut" }}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}
