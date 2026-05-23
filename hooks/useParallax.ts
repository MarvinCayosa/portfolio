/**
 * useParallax — returns a Y offset for parallax scroll effects.
 */

"use client";

import { useEffect, useState } from "react";

interface UseParallaxOptions {
  /** Multiplier applied to scroll position (e.g. 0.4 = slower movement). */
  rate?: number;
}

/**
 * Computes a translateY offset based on scroll position and rate multiplier.
 */
export function useParallax(options: UseParallaxOptions = {}): number {
  const { rate = 0.4 } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * rate);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rate]);

  return offset;
}
