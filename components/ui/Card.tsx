/**
 * Card — base card surface with hover lift and shadow.
 */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-foreground/8 bg-white/50 p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
