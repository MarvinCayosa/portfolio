/**
 * useBorderGlowConfig — theme-aware BorderGlow props.
 */

"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { getBorderGlow } from "@/lib/theme";

export function useBorderGlowConfig() {
  const { theme } = useTheme();
  return getBorderGlow(theme);
}
