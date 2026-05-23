/**
 * Badge — monotone tech tags.
 */

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
}

export function Badge({ label, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "font-label inline-flex border border-[var(--border)] px-2 py-0.5 text-[0.6rem] text-[var(--muted)]",
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}
