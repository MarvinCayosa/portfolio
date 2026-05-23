/**
 * TopChrome — full name appears after leaving hero.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HERO_COPY } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { scrollToSection } from "@/lib/utils";
import { SECTION_IDS } from "@/lib/constants";
import { usePastHero } from "@/hooks/usePastHero";

export function TopChrome() {
  const pastHero = usePastHero();
  const reduceMotion = useReducedMotion();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8">
      <motion.button
        type="button"
        onClick={() => scrollToSection(SECTION_IDS.HOME)}
        className="inline-flex items-baseline gap-1.5 text-left"
        aria-label="Back to top"
        initial={false}
        animate={
          reduceMotion
            ? { opacity: pastHero ? 1 : 0 }
            : {
                opacity: pastHero ? 1 : 0,
                y: pastHero ? 0 : -10,
              }
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: pastHero ? "auto" : "none" }}
      >
        <span className="font-body text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
          {HERO_COPY.firstName}
        </span>
        <span className="font-display text-sm italic text-[var(--foreground)] sm:text-base">
          {HERO_COPY.lastName}
        </span>
      </motion.button>
      <ThemeToggle />
    </header>
  );
}
