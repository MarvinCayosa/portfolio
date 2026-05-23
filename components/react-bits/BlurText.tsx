/**
 * BlurText — word/letter blur reveal (React Bits official pattern).
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { useReducedEffects } from "@/hooks/useReducedEffects";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  onAnimationComplete?: () => void;
  as?: "h1" | "h2" | "p" | "span";
}

function buildKeyframes(
  from: Record<string, string | number>,
  steps: Record<string, string | number>[],
) {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);
  const keyframes: Record<string, (string | number)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
}

export function BlurText({
  text = "",
  delay = 120,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
  onAnimationComplete,
  as: Tag = "h1",
}: BlurTextProps) {
  const reduceMotion = useReducedMotion();
  const reducedEffects = useReducedEffects();
  const skipBlur = reduceMotion || reducedEffects;
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || reduceMotion) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduceMotion]);

  const defaultFrom = useMemo(
    () =>
      skipBlur
        ? { opacity: 0, y: direction === "top" ? -12 : 12 }
        : direction === "top"
          ? { filter: "blur(10px)", opacity: 0, y: -40 }
          : { filter: "blur(10px)", opacity: 0, y: 40 },
    [direction, skipBlur],
  );

  const defaultTo = useMemo(
    () =>
      skipBlur
        ? [{ opacity: 1, y: 0 }]
        : [
            {
              filter: "blur(4px)",
              opacity: 0.6,
              y: direction === "top" ? 4 : -4,
            },
            { filter: "blur(0px)", opacity: 1, y: 0 },
          ],
    [direction, skipBlur],
  );

  const stepCount = defaultTo.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const motionClass = skipBlur
    ? "inline-block will-change-[transform,opacity]"
    : "inline-block will-change-[transform,filter,opacity]";

  return (
    <Tag
      ref={ref as never}
      className={cn("flex flex-wrap", className)}
      aria-label={text}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(
          defaultFrom as Record<string, string | number>,
          defaultTo as Record<string, string | number>[],
        );
        return (
          <motion.span
            className={motionClass}
            key={`${segment}-${index}`}
            initial={defaultFrom}
            animate={inView ? animateKeyframes : defaultFrom}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </Tag>
  );
}
