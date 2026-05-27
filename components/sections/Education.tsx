/**
 * Education — expandable cards for each education record.
 */

"use client";

import { useState } from "react";
import { ChevronDown, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BorderGlow } from "@/components/react-bits/BorderGlow";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import { useBorderGlowConfig } from "@/hooks/useBorderGlowConfig";
import { cn } from "@/lib/utils";
import type { EducationRecord } from "@/types";

interface EducationProps {
  education: EducationRecord[];
}

function EducationCard({ record }: { record: EducationRecord }) {
  const glow = useBorderGlowConfig();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const details = Array.isArray(record.bullets) && record.bullets.length
    ? record.bullets
    : record.notes
      ? [record.notes]
      : [];
  const hasDetails = details.length > 0;

  return (
    <BorderGlow {...glow} borderRadius={14}>
      <div className="overflow-hidden">
        <button
          type="button"
          onClick={() => hasDetails && setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-4 p-4 text-left sm:p-5",
            !hasDetails && "cursor-default",
          )}
          aria-expanded={hasDetails ? open : undefined}
          disabled={!hasDetails}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted)]">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <h3 className="font-display text-lg text-[var(--foreground)] sm:text-xl">
              {record.institution}
            </h3>
            <p className="mt-0.5 font-body text-sm text-[var(--muted)]">
              {record.degree}
            </p>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            {record.year && (
              <span className="font-label text-[var(--foreground)]">
                {record.year}
              </span>
            )}
            {hasDetails && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[var(--muted)] transition-transform duration-300",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            )}
          </span>
        </button>

        {hasDetails && (
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
              {details.map((line) => (
                <li
                  key={line}
                  className="font-body text-sm leading-relaxed text-[var(--muted)]"
                >
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </BorderGlow>
  );
}

export function Education({ education }: EducationProps) {
  return (
    <SectionContainer
      id={SECTION_IDS.EDUCATION}
      className="border-t border-[var(--border)]"
    >
      <FadeIn>
        <h2 className="font-display heading-section text-[var(--foreground)]">
          {SECTION_TITLES.education}
        </h2>
      </FadeIn>

      <div className="mt-8 space-y-4">
        {education.map((record, i) => (
          <FadeIn key={record.id ?? i} delay={i * 0.06}>
            <EducationCard record={record} />
          </FadeIn>
        ))}
      </div>
    </SectionContainer>
  );
}
