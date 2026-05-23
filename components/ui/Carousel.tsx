/**
 * Carousel — horizontal drag-scrollable carousel with keyboard support.
 */

"use client";

import { useRef, type ReactNode, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}

export function Carousel({ children, className, ariaLabel }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const scrollAmount = 280;
    if (e.key === "ArrowRight") {
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    if (e.key === "ArrowLeft") {
      ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex gap-4 overflow-x-auto pb-4",
        "snap-x snap-mandatory scroll-smooth",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {children}
    </div>
  );
}
