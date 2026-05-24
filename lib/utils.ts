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
  start: Date | string,
  end: Date | string | null | undefined,
  current: boolean | undefined,
): string {
  const toDate = (value: Date | string): Date =>
    value instanceof Date ? value : new Date(value);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const startDate = toDate(start);
  const endDate = end ? toDate(end) : null;

  if (current || !endDate) {
    return `${fmt(startDate)} — Present`;
  }
  return `${fmt(startDate)} — ${fmt(endDate)}`;
}

/** Formats award year or year range for display. */
export function formatAwardYears(year?: number, yearEnd?: number | null): string {
  if (!year) return "";
  if (yearEnd == null || yearEnd === year) return String(year);
  return `${year}–${yearEnd}`;
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
