/**
 * Vibrant highlight colors for expertise pills (deterministic per skill name).
 */

export type PillColor = {
  bg: string;
  border: string;
  text: string;
};

type PaletteEntry = {
  hex: string;
  text: string;
};

const PALETTE_ENTRIES: PaletteEntry[] = [
  { hex: "#FF6D00", text: "#ffffff" },
  { hex: "#673AB7", text: "#ffffff" },
  { hex: "#FFEB3B", text: "#1a1a1a" },
  { hex: "#E53935", text: "#ffffff" },
  { hex: "#1E88E5", text: "#ffffff" },
];

function toPillColor({ hex, text }: PaletteEntry): PillColor {
  return {
    bg: `color-mix(in srgb, ${hex} 55%, var(--surface-elevated))`,
    border: `color-mix(in srgb, ${hex} 75%, var(--border))`,
    text,
  };
}

const PALETTE = PALETTE_ENTRIES.map(toPillColor);

export function getPillHighlightColor(skill: string): PillColor {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = (hash * 31 + skill.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}
