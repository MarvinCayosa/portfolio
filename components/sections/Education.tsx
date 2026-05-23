/**
 * Education — single expandable card.
 */

"use client";

import { useState } from "react";
import { ChevronDown, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BorderGlow } from "@/components/react-bits/BorderGlow";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PRIMARY_EDUCATION, SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import { useBorderGlowConfig } from "@/hooks/useBorderGlowConfig";
import { cn } from "@/lib/utils";

export function Education() {
  const glow = useBorderGlowConfig();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <SectionContainer id={SECTION_IDS.EDUCATION} className="border-t border-[var(--border)]">
      <FadeIn>
        <h2 className="font-display heading-section text-[var(--foreground)]">
          {SECTION_TITLES.education}
        </h2>
      </FadeIn>

      <FadeIn delay={0.06}>
        <BorderGlow {...glow} borderRadius={14} className="mt-8">
          <div className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
              aria-expanded={open}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted)]">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <h3 className="font-display text-lg text-[var(--foreground)] sm:text-xl">
                  {PRIMARY_EDUCATION.institution}
                </h3>
                <p className="mt-0.5 font-body text-sm text-[var(--muted)]">
                  {PRIMARY_EDUCATION.degree}
                </p>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="font-label text-[var(--foreground)]">
                  {PRIMARY_EDUCATION.period}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-[var(--muted)] transition-transform duration-300",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </span>
            </button>

            <motion.div
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 border-t border-[var(--border)] px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                {PRIMARY_EDUCATION.details.map((line) => (
                  <li
                    key={line}
                    className="font-body text-sm leading-relaxed text-[var(--muted)]"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </BorderGlow>
      </FadeIn>
    </SectionContainer>
  );
}
