/**
 * useReducedEffects — lighter visuals on low-power or reduced-motion devices.
 */

"use client";

import { useSyncExternalStore } from "react";

function getReducedEffects(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) return true;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowCores =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  return coarse && lowCores;
}

function subscribe(onStoreChange: () => void) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  reducedMotion.addEventListener("change", onStoreChange);
  coarsePointer.addEventListener("change", onStoreChange);
  return () => {
    reducedMotion.removeEventListener("change", onStoreChange);
    coarsePointer.removeEventListener("change", onStoreChange);
  };
}

export function useReducedEffects(): boolean {
  return useSyncExternalStore(subscribe, getReducedEffects, () => false);
}
