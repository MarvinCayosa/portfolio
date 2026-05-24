/**
 * skill-pill-colors.ts
 *
 * Provides vibrant highlight colors for skill pills and project tags.
 *
 * Two functions:
 *   getPillHighlightColor(skill)         — deterministic color by skill name hash
 *   getPillColorAtIndex(index, prevIndex) — position-aware color that guarantees
 *                                           no two adjacent pills share the same color
 */

export type PillColor = {
  bg: string;
  border: string;
  text: string;
};

// ─── Palette ──────────────────────────────────────────────────────────────────
// 8 distinct colors so adjacent pills almost never collide even with a simple hash.

const RAW_PALETTE = [
  { hex: "#FF6D00", text: "#ffffff" }, // orange
  { hex: "#673AB7", text: "#ffffff" }, // purple
  { hex: "#1E88E5", text: "#ffffff" }, // blue
  { hex: "#E53935", text: "#ffffff" }, // red
  { hex: "#00897B", text: "#ffffff" }, // teal
  { hex: "#F4511E", text: "#ffffff" }, // deep-orange
  { hex: "#8E24AA", text: "#ffffff" }, // violet
  { hex: "#039BE5", text: "#ffffff" }, // light-blue
] as const;

function toPillColor(hex: string, text: string): PillColor {
  return {
    bg:     `color-mix(in srgb, ${hex} 55%, var(--surface-elevated))`,
    border: `color-mix(in srgb, ${hex} 75%, var(--border))`,
    text,
  };
}

const PALETTE: PillColor[] = RAW_PALETTE.map((e) => toPillColor(e.hex, e.text));
const N = PALETTE.length;

/** Simple djb2-style hash → palette index */
function hashIndex(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % N;
}

/**
 * Returns a deterministic color for a skill name.
 * Used when a category is selected (highlighted mode).
 */
export function getPillHighlightColor(skill: string): PillColor {
  return PALETTE[hashIndex(skill)]!;
}

/**
 * Returns a color for a pill at a given position, guaranteeing it differs
 * from the previous pill's color. Used in "All" (unfiltered) mode so the
 * masonry grid never shows two identical colors side-by-side.
 *
 * @param skill      The skill name (used as primary hash seed)
 * @param globalIndex The pill's position in the full flat list
 * @param prevColor  The color assigned to the previous pill (to avoid repeat)
 */
export function getPillColorForIndex(
  skill: string,
  globalIndex: number,
  prevColor: PillColor | null,
): PillColor {
  let idx = hashIndex(skill);
  // If this color matches the previous one, shift forward until it doesn't
  let attempts = 0;
  while (prevColor && PALETTE[idx] === prevColor && attempts < N - 1) {
    idx = (idx + 1) % N;
    attempts++;
  }
  // Also use globalIndex as a secondary offset to break runs of similar names
  if (prevColor && PALETTE[idx] === prevColor) {
    idx = (hashIndex(skill) + globalIndex) % N;
  }
  return PALETTE[idx]!;
}
