/**
 * RoleCycler — vertical slide + width animation; Engineer locked to bottom alignment.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HERO_ROLE_PREFIXES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CYCLE_MS = 3200;
const WIDTH_EASE = [0.22, 1, 0.36, 1] as const;
const LINE_HEIGHT = "1.25em";

export function RoleCycler({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [slotWidth, setSlotWidth] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  const current = HERO_ROLE_PREFIXES[index];

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const spans = measure.querySelectorAll("[data-word]");
    const target = spans[index] as HTMLElement | undefined;
    if (target) setSlotWidth(target.offsetWidth);
  }, [index]);

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
      className={cn("relative font-body text-lg sm:text-xl", className)}
      style={{ lineHeight: LINE_HEIGHT }}
      aria-live="polite"
    >
      <span
        className="inline-flex items-end"
        style={{ height: LINE_HEIGHT, lineHeight: LINE_HEIGHT }}
      >
        <motion.span
          className="relative inline-block shrink-0 overflow-hidden"
          style={{ height: LINE_HEIGHT }}
          animate={{ width: slotWidth || "auto" }}
          transition={{ duration: 0.55, ease: WIDTH_EASE }}
        >
          <span className="relative block h-full w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current}
                className="absolute bottom-0 left-0 block whitespace-nowrap font-semibold text-[var(--foreground)]"
                style={{ lineHeight: LINE_HEIGHT }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: WIDTH_EASE }}
              >
                {current}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.span>
        <span
          className="ml-[0.35em] shrink-0 font-normal leading-none text-[var(--muted)]"
          style={{ lineHeight: "1.1em", paddingBottom: "0.05em" }}
        >
          Engineer
        </span>
      </span>

      <span className="sr-only">
        {HERO_ROLE_PREFIXES.join(", ")} Engineer
      </span>

      <div
        ref={measureRef}
        className="pointer-events-none absolute -left-[9999px] top-0 whitespace-nowrap text-lg font-semibold opacity-0 sm:text-xl"
        style={{ lineHeight: LINE_HEIGHT }}
        aria-hidden
      >
        {HERO_ROLE_PREFIXES.map((word) => (
          <span key={word} data-word className="inline-block">
            {word}
          </span>
        ))}
      </div>
    </p>
  );
}
