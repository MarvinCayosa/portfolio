/**
 * usePastHero — true when the user has scrolled past the hero section.
 */

"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/lib/constants";

export function usePastHero(): boolean {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(SECTION_IDS.HOME);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-12% 0px 0px 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return pastHero;
}
