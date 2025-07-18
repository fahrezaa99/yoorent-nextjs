// components/Toast.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ show, message, onHide }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => {
        onHide?.();
      }, 2500); // Toast hilang setelah 2.5 detik
      return () => clearTimeout(t);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl font-bold text-white
          bg-gradient-to-r from-blue-600 via-green-400 to-purple-500 shadow-2xl text-base md:text-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
