/**
 * Silk — lightweight CSS animated background (no Three.js).
 */

"use client";

import { useEffect, useRef, useState } from "react";
import "./Silk.css";

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export function Silk({
  speed = 2.5,
  scale = 0.55,
  color = "#888888",
  noiseIntensity = 1.2,
  rotation = 0.4,
  className = "",
}: SilkProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(root);

    const onVisibility = () => {
      if (document.hidden) setActive(false);
      else if (root) {
        const rect = root.getBoundingClientRect();
        setActive(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const duration = Math.max(8, 18 / speed);

  return (
    <div
      ref={rootRef}
      className={`silk-root absolute inset-0 opacity-40 ${className}`}
      aria-hidden
      style={
        {
          "--silk-color": color,
          "--silk-scale": scale,
          "--silk-rotation": `${rotation}rad`,
          "--silk-noise": noiseIntensity,
          "--silk-duration": `${duration}s`,
          animationPlayState: active ? "running" : "paused",
        } as React.CSSProperties
      }
    >
      <div className="silk-layer silk-layer-a" />
      <div className="silk-layer silk-layer-b" />
    </div>
  );
}
