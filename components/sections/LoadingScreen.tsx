/**
 * LoadingScreen — minimal chrome loader.
 */

"use client";

import { motion } from "framer-motion";
import { LOADING_COPY } from "@/lib/constants";

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="font-display text-5xl text-[var(--foreground)]">
        {LOADING_COPY.initials}
      </span>
      <motion.div
        className="mt-6 h-px w-20 bg-[var(--foreground)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}
