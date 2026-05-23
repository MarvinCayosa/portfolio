/**
 * LoadingScreen — MC | Computer Engineer, then wipe reveal (3.5s total).
 */

"use client";

import { motion } from "framer-motion";
import { LOADING_COPY } from "@/lib/constants";

const WIPE_DURATION = 0.5;

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]"
      initial={{ clipPath: "inset(0 0 0 0)" }}
      exit={{ clipPath: "inset(0 0 0 100%)" }}
      transition={{ duration: WIPE_DURATION, ease: [0.65, 0, 0.35, 1] }}
    >
      <div
        className="flex items-baseline gap-2.5 px-4 sm:gap-3"
        aria-label={`${LOADING_COPY.initials}, ${LOADING_COPY.role}`}
      >
        <span className="font-display text-3xl tracking-tight text-[var(--foreground)] sm:text-4xl">
          {LOADING_COPY.initials}
        </span>

        <motion.span
          className="font-display text-2xl text-[var(--muted)] sm:text-3xl"
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.35, duration: 0.28, ease: "easeOut" }}
          aria-hidden
        >
          |
        </motion.span>

        <motion.div
          className="overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
          transition={{ delay: 0.5, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-block whitespace-nowrap font-body text-lg italic text-[var(--muted)] sm:text-xl"
            initial={{ x: "-110%" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.5, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {LOADING_COPY.role}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
