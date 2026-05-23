/**
 * Aurora — subtle animated hero background wash (React Bits style).
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraProps {
  className?: string;
}

export function Aurora({ className }: AuroraProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-30",
          "bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--accent)_25%,transparent),transparent_50%)]",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full opacity-25 blur-3xl"
        style={{ background: "color-mix(in srgb, var(--accent) 40%, transparent)" }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[60%] w-[60%] rounded-full opacity-20 blur-3xl"
        style={{ background: "color-mix(in srgb, #8a9a7b 50%, transparent)" }}
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
