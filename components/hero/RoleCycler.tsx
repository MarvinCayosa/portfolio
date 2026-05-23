/**
 * RoleCycler — smooth vertical scroll for role prefix; static muted "Engineer".
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_ROLE_PREFIXES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CYCLE_MS = 3200;

export function RoleCycler({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const current = HERO_ROLE_PREFIXES[index];

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_ROLE_PREFIXES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <p className={cn("font-body text-lg leading-snug sm:text-xl", className)}>
        <span className="font-semibold text-[var(--foreground)]">
          {HERO_ROLE_PREFIXES[0]}
        </span>
        <span className="font-normal text-[var(--muted)]"> Engineer</span>
      </p>
    );
  }

  return (
    <p
      className={cn("font-body text-lg leading-snug sm:text-xl", className)}
      aria-live="polite"
    >
      <span className="inline-flex items-baseline gap-[0.35em]">
        <span className="relative inline-block h-[1.25em] align-baseline leading-[1.25em]">
          <span
            className="invisible block whitespace-nowrap font-semibold"
            aria-hidden
          >
            {current}
          </span>
          <span className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current}
                className="block whitespace-nowrap font-semibold text-[var(--foreground)]"
                initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {current}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
        <span className="font-normal text-[var(--muted)]">Engineer</span>
      </span>

      <span className="sr-only">
        {HERO_ROLE_PREFIXES.join(", ")} Engineer
      </span>
    </p>
  );
}
