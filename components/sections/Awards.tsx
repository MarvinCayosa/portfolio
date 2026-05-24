/**
 * Awards — two-row horizontal scroll from the left; equal-height cards with title tooltips.
 */

"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useState } from "react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { CountUp } from "@/components/react-bits/CountUp";
import { FadeIn } from "@/components/animations/FadeIn";
import { TwoColumnSection } from "@/components/layout/TwoColumnSection";
import {
  AWARDS_STAT_LABEL,
  SECTION_IDS,
  SECTION_TITLES,
} from "@/lib/constants";
import { cn, formatAwardYears } from "@/lib/utils";
import type { AwardRecord } from "@/types";

interface AwardsProps {
  awards: AwardRecord[];
}

function needsHorizontalScroll(count: number) {
  return count > 2;
}

function AwardTitle({ title }: { title: string }) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
      <TooltipPrimitive.Trigger asChild>
        <button
          type="button"
          className="min-w-0 w-full truncate text-left font-display text-lg text-[var(--foreground)]"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => setOpen((v) => !v)}
        >
          {title}
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={6}
          className={cn(
            "z-50 max-w-[min(90vw,320px)] rounded-md border border-white/10",
            "bg-[var(--surface-elevated)]/95 px-2.5 py-1.5 font-body text-xs text-foreground shadow-lg backdrop-blur-md",
          )}
        >
          {title}
          <TooltipPrimitive.Arrow className="fill-[var(--surface-elevated)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export function Awards({ awards }: AwardsProps) {
  const horizontal = needsHorizontalScroll(awards.length);

  return (
    <TwoColumnSection
      id={SECTION_IDS.AWARDS}
      title={SECTION_TITLES.awards}
    >
      <p className="font-label mb-6 text-[var(--muted)]">
        <CountUp end={awards.length} className="text-[var(--foreground)]" />{" "}
        {AWARDS_STAT_LABEL}
      </p>

      <div className="relative overflow-visible">
        {horizontal && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/60 to-transparent sm:w-16"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--background)] via-[var(--background)]/60 to-transparent sm:w-16"
              aria-hidden
            />
          </>
        )}

        <ul
          className={
            horizontal
              ? "grid h-[min(320px,42vh)] auto-cols-[min(85vw,280px)] grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-px-12 pb-2 pl-12 pr-12 [-ms-overflow-style:none] [scrollbar-width:none] sm:auto-cols-[300px] sm:gap-4 sm:scroll-px-16 sm:pl-16 sm:pr-16 [&::-webkit-scrollbar]:hidden"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          }
        >
          {awards.map((award, i) => (
            <li
              key={award.id ?? `${award.title}-${i}`}
              className={cn("min-w-0", horizontal && "h-full snap-start")}
            >
              <FadeIn delay={i * 0.05} className="h-full">
                <SpotlightCard className="flex h-full min-h-[140px] flex-col border border-[var(--border)] bg-[var(--surface)] p-5">
                  <AwardTitle title={award.title} />
                  <p className="mt-1.5 line-clamp-2 min-h-0 flex-1 font-body text-sm text-[var(--muted)]">
                    {award.issuer}
                  </p>
                  <p className="font-label mt-auto pt-3 text-[var(--foreground)]">
                    {formatAwardYears(award.year, award.yearEnd)}
                  </p>
                </SpotlightCard>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </TwoColumnSection>
  );
}
