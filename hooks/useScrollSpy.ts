/**
 * useScrollSpy — tracks which section is currently active (IntersectionObserver).
 */

"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section most visible in the upper viewport band.
 */
export function useScrollSpy(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const ratios = new Map<string, number>();
    let frame = 0;

    const pickActive = () => {
      let bestId = sectionIds[0] ?? "";
      let bestRatio = -1;

      for (const id of sectionIds) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (bestRatio <= 0) {
        const offset = window.innerHeight * 0.35;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= offset) {
            bestId = id;
          }
        }
      }

      setActiveId((prev) => (prev === bestId ? prev : bestId));
    };

    const schedulePick = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pickActive();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        schedulePick();
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    pickActive();

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeId;
}
