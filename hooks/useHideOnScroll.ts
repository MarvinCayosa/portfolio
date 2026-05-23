/**
 * useHideOnScroll — hides UI when scrolling down, shows when scrolling up.
 */

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns whether the target element (e.g. bottom nav) should be visible.
 */
export function useHideOnScroll(): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 80) {
        setVisible(true);
      } else if (delta > 8) {
        setVisible(false);
      } else if (delta < -8) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return visible;
}
