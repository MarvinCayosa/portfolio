/**
 * GradualBlur — stacked backdrop blur fade at section edges (React Bits).
 */

"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
  type CSSProperties,
} from "react";
import "./GradualBlur.css";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type Target = "parent" | "page";

interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  /** Single backdrop-blur layer — much cheaper than stacked layers while scrolling. */
  lite?: boolean;
  exponential?: boolean;
  curve?: Curve;
  opacity?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  target?: Target;
  preset?: string;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_CONFIG = {
  position: "bottom" as Position,
  strength: 2,
  height: "8rem",
  divCount: 6,
  exponential: true,
  zIndex: 50,
  animated: false as boolean | "scroll",
  duration: "0.4s",
  easing: "ease-out",
  opacity: 1,
  curve: "bezier" as Curve,
  target: "parent" as Target,
  className: "",
  style: {} as CSSProperties,
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) =>
    p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
};

function getGradientDirection(position: Position): string {
  const map: Record<Position, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return map[position] ?? "to bottom";
}

function GradualBlurComponent(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...props }), [props]);

  const [isVisible, setIsVisible] = useState(
    config.animated !== "scroll",
  );

  useEffect(() => {
    if (config.animated !== "scroll" || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [config.animated]);

  const blurDivs = useMemo(() => {
    const direction = getGradientDirection(config.position);
    const lite = config.lite || config.divCount <= 1;

    if (lite) {
      const maxBlur = config.exponential
        ? Math.pow(2, 4) * 0.0625 * config.strength
        : 0.0625 * (config.divCount + 1) * config.strength;

      return [
        <div
          key="lite-blur"
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `linear-gradient(${direction}, transparent 0%, black 58%)`,
            WebkitMaskImage: `linear-gradient(${direction}, transparent 0%, black 58%)`,
            backdropFilter: `blur(${maxBlur.toFixed(3)}rem) saturate(1.15)`,
            WebkitBackdropFilter: `blur(${maxBlur.toFixed(3)}rem) saturate(1.15)`,
            opacity: config.opacity,
          }}
        />,
        <div
          key="lite-fade"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${direction}, transparent 0%, var(--background) 92%)`,
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />,
      ];
    }

    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const curveFunc = CURVE_FUNCTIONS[config.curve];

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * config.strength;
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * config.strength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);

      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `linear-gradient(${direction}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity: config.opacity,
          }}
        />,
      );
    }
    return divs;
  }, [config]);

  const isVertical = ["top", "bottom"].includes(config.position);
  const isPageTarget = config.target === "page";

  const containerStyle: CSSProperties = {
    position: isPageTarget ? "fixed" : "absolute",
    pointerEvents: "none",
    opacity: isVisible ? 1 : 0,
    transition: config.animated
      ? `opacity ${config.duration} ${config.easing}`
      : undefined,
    zIndex: config.zIndex,
    ...config.style,
  };

  if (isVertical) {
    containerStyle.height = config.height;
    containerStyle.width = config.width ?? "100%";
    containerStyle[config.position] = 0;
    containerStyle.left = 0;
    containerStyle.right = 0;
  }

  return (
    <div
      ref={containerRef}
      className={`gradual-blur gradual-blur-parent ${config.className}`}
      style={containerStyle}
      aria-hidden
    >
      <div className="gradual-blur-inner">{blurDivs}</div>
    </div>
  );
}

export const GradualBlur = memo(GradualBlurComponent);
