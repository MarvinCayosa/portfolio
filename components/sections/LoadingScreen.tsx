/**
 * LoadingScreen — MC | Computer Engineer, then fade out (3.5s total).
 */

"use client";

import { motion } from "framer-motion";
import { LOADING_COPY } from "@/lib/constants";

const FADE_DURATION = 0.5;

const titleClass =
  "font-display text-3xl tracking-tight text-[var(--foreground)] sm:text-4xl";

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
    >
      <div
        className="flex items-center gap-2.5 px-4 sm:gap-3"
        aria-label={`${LOADING_COPY.initials}, ${LOADING_COPY.role}`}
      >
        <span className={titleClass}>{LOADING_COPY.initials}</span>

        <motion.span
          className={titleClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
            className={`inline-block whitespace-nowrap ${titleClass}`}
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
