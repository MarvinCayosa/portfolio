/**
 * ParallaxWrapper — applies vertical parallax offset via Framer Motion.
 */

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useParallax } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";

interface ParallaxWrapperProps {
  children: ReactNode;
  className?: string;
  rate?: number;
}

export function ParallaxWrapper({
  children,
  className,
  rate = 0.4,
}: ParallaxWrapperProps) {
  const offset = useParallax({ rate });

  return (
    <motion.div
      className={cn(className)}
      style={{ y: -offset }}
    >
      {children}
    </motion.div>
  );
}
