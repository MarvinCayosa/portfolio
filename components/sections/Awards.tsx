/**
 * Awards — two-row horizontal scroll from the left; equal-height cards with title tooltips.
 */

"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const SCROLL_STEP = 320;

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

function AwardsHorizontalScroller({ awards }: { awards: AwardRecord[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, pointerId: -1 });

  const scrollByStep = useCallback((dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absY <= absX) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
    };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    if (!dragRef.current.active || !scrollerRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    scrollerRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const el = scrollerRef.current;
    if (el) {
      el.releasePointerCapture(e.pointerId);
      el.style.cursor = "";
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByStep(-1)}
        aria-label="Scroll awards left"
        className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--foreground)] shadow-sm backdrop-blur-sm transition-colors hover:bg-[var(--surface-elevated)] sm:h-10 sm:w-10"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scrollByStep(1)}
        aria-label="Scroll awards right"
        className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--foreground)] shadow-sm backdrop-blur-sm transition-colors hover:bg-[var(--surface-elevated)] sm:h-10 sm:w-10"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/40 to-transparent sm:w-10 sm:via-[var(--background)]/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[var(--background)] via-[var(--background)]/40 to-transparent sm:w-10 sm:via-[var(--background)]/50"
        aria-hidden
      />

      <ul
        ref={scrollerRef}
        role="region"
        aria-label="Awards list"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") scrollByStep(-1);
          if (e.key === "ArrowRight") scrollByStep(1);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "grid h-[min(320px,42vh)] auto-cols-[min(72vw,260px)] grid-flow-col grid-rows-2 gap-3",
          "cursor-grab overflow-x-auto overscroll-x-contain pb-2 pl-11 pr-11",
          "touch-pan-x [-webkit-overflow-scrolling:touch]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:auto-cols-[300px] sm:gap-4 sm:pl-14 sm:pr-14",
        )}
      >
        {awards.map((award, i) => (
          <li key={award.id ?? `${award.title}-${i}`} className="h-full min-w-0">
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

      {horizontal ? (
        <AwardsHorizontalScroller awards={awards} />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {awards.map((award, i) => (
            <li key={award.id ?? `${award.title}-${i}`} className="min-w-0">
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
      )}
    </TwoColumnSection>
  );
}
