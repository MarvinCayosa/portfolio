/**
 * GradientText — accent gradient labels (React Bits style).
 */

"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: string;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-[var(--accent)] via-[#b8956a] to-[#8a9a7b] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
