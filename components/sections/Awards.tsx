/**
 * Awards — two-row horizontal scroll from the left; equal-height cards with title tooltips.
 */

"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const COLUMN_CLASS = "w-[min(72vw,260px)] shrink-0 sm:w-[300px]";

function needsHorizontalScroll(count: number) {
  return count > 2;
}

/** Pair awards into columns (2 per column) for reliable horizontal scroll on mobile. */
function awardsToColumns(awards: AwardRecord[]): AwardRecord[][] {
  const columns: AwardRecord[][] = [];
  for (let i = 0; i < awards.length; i += 2) {
    columns.push(awards.slice(i, i + 2));
  }
  return columns;
}

function AwardTitle({ title }: { title: string }) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
      <TooltipPrimitive.Trigger asChild>
        <button
          type="button"
          className="min-w-0 w-full touch-pan-x truncate text-left font-display text-lg text-[var(--foreground)]"
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

function AwardCard({ award, index }: { award: AwardRecord; index: number }) {
  return (
    <FadeIn delay={index * 0.05} className="h-full">
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
  );
}

function AwardsHorizontalScroller({ awards }: { awards: AwardRecord[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [coarsePointer, setCoarsePointer] = useState(false);

  const columns = useMemo(() => awardsToColumns(awards), [awards]);

  const scrollByStep = useCallback((dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (coarsePointer) return;
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
  }, [coarsePointer]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (coarsePointer || e.pointerType === "touch") return;
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !scrollerRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    scrollerRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const el = scrollerRef.current;
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      el.style.cursor = "";
    }
  };

  const navBtnClass =
    "absolute top-1/2 z-20 hidden -translate-y-1/2 p-1 text-[var(--foreground)]/80 transition-opacity hover:text-[var(--foreground)] md:flex";

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={() => scrollByStep(-1)}
        aria-label="Scroll awards left"
        className={cn(navBtnClass, "left-0")}
        style={{ filter: "drop-shadow(2px 0 8px rgba(0,0,0,0.35))" }}
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scrollByStep(1)}
        aria-label="Scroll awards right"
        className={cn(navBtnClass, "right-0")}
        style={{ filter: "drop-shadow(-2px 0 8px rgba(0,0,0,0.35))" }}
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2} aria-hidden />
      </button>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/35 to-transparent sm:w-8 sm:via-[var(--background)]/45"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-[var(--background)] via-[var(--background)]/35 to-transparent sm:w-8 sm:via-[var(--background)]/45"
        aria-hidden
      />

      <div
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
          "no-scrollbar -mx-1 overflow-x-auto overscroll-x-contain px-1 pb-2",
          "touch-pan-x [-webkit-overflow-scrolling:touch]",
          !coarsePointer && "cursor-grab md:px-10",
        )}
      >
        <div className="flex w-max gap-3 sm:gap-4">
          {columns.map((column, colIndex) => (
            <div
              key={column.map((a) => a.id ?? a.title).join("-")}
              className={cn(COLUMN_CLASS, "flex flex-col gap-3 sm:gap-4")}
            >
              {column.map((award, rowIndex) => {
                const globalIndex = colIndex * 2 + rowIndex;
                return (
                  <div key={award.id ?? `${award.title}-${globalIndex}`} className="min-h-[140px]">
                    <AwardCard award={award} index={globalIndex} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
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

      <div className="min-w-0">
        {horizontal ? (
          <AwardsHorizontalScroller awards={awards} />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {awards.map((award, i) => (
              <li key={award.id ?? `${award.title}-${i}`} className="min-w-0">
                <AwardCard award={award} index={i} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </TwoColumnSection>
  );
}
