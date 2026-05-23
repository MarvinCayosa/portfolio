/**
 * Utility helpers — className merging with clsx and tailwind-merge.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicts via tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date range for experience entries.
 */
export function formatDateRange(
  start: Date,
  end: Date | null,
  current: boolean,
): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (current || !end) {
    return `${fmt(start)} — Present`;
  }
  return `${fmt(start)} — ${fmt(end)}`;
}

/**
 * Smooth-scrolls to a section by element id.
 */
export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
