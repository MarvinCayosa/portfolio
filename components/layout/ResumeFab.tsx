/**
 * ResumeFab — expands to label; aligned with bottom nav row.
 */

"use client";

import { FileDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RESUME_PATH } from "@/lib/constants";
import { usePastHero } from "@/hooks/usePastHero";
import { cn } from "@/lib/utils";

export function ResumeFab() {
  const pastHero = usePastHero();
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={RESUME_PATH}
      download
      aria-label="Download resume (PDF)"
      className={cn(
        "group fixed bottom-5 left-3 z-[45] flex h-11 items-center overflow-hidden rounded-full sm:left-5 sm:h-12",
        "border border-white/20 bg-white text-[var(--background)]",
        "shadow-lg shadow-black/25",
        "hover:bg-white/95 hover:shadow-xl",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
        "max-w-[calc(100vw-5.5rem)] sm:max-w-none",
      )}
      initial={false}
      animate={
        reduceMotion
          ? { opacity: pastHero ? 1 : 0, scale: pastHero ? 1 : 0.92 }
          : {
              opacity: pastHero ? 1 : 0,
              scale: pastHero ? 1 : 0.9,
              x: pastHero ? 0 : -16,
            }
      }
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: pastHero ? "auto" : "none" }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
        <FileDown className="h-5 w-5" aria-hidden />
      </span>
      <span
        className={cn(
          "max-w-0 overflow-hidden whitespace-nowrap font-label text-[0.6rem] opacity-0",
          "transition-all duration-300 ease-out",
          "group-hover:max-w-[9rem] group-hover:pr-4 group-hover:opacity-100",
          "group-focus-visible:max-w-[9rem] group-focus-visible:pr-4 group-focus-visible:opacity-100",
          "max-sm:group-active:max-w-[9rem] max-sm:group-active:pr-4 max-sm:group-active:opacity-100",
        )}
      >
        Download Resume
      </span>
    </motion.a>
  );
}
