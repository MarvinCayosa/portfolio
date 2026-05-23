/**
 * Theme tokens — monotone chrome palette for BorderGlow and glass.
 */

export const THEME = {
  glassNav: {
    borderRadius: 999,
    blur: 12,
    backgroundOpacity: 0.08,
    saturation: 1.2,
    brightness: 48,
  },
  borderGlowDark: {
    glowColor: "0 0% 75%",
    backgroundColor: "#0c0c0c",
    borderRadius: 16,
    glowRadius: 28,
    glowIntensity: 0.7,
    edgeSensitivity: 30,
    coneSpread: 20,
    fillOpacity: 0.25,
    colors: ["#666666", "#999999", "#444444"] as string[],
  },
  borderGlowLight: {
    glowColor: "0 0% 25%",
    backgroundColor: "#e8e6e1",
    borderRadius: 16,
    glowRadius: 28,
    glowIntensity: 0.6,
    edgeSensitivity: 30,
    coneSpread: 20,
    fillOpacity: 0.2,
    colors: ["#aaaaaa", "#cccccc", "#888888"] as string[],
  },
} as const;

export function getBorderGlow(theme: "light" | "dark") {
  return theme === "light" ? THEME.borderGlowLight : THEME.borderGlowDark;
}
