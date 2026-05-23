/**
 * Ribbons — decorative ambient background motion (React Bits style).
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RibbonsProps {
  className?: string;
}

export function Ribbons({ className }: RibbonsProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15]", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-px w-[120%] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          style={{ top: `${25 + i * 22}%`, left: "-10%" }}
          animate={{ x: ["-5%", "5%", "-5%"], rotate: [-2 + i, 2 - i, -2 + i] }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
