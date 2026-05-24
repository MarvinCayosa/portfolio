/**
 * BottomNav — full bar on desktop; compact menu button on mobile.
 * Accepts an optional `visibleSections` set — items not in the set are hidden.
 */

"use client";

import { useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Home,
  Layers,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassSurface } from "@/components/react-bits/GlassSurface";
import { NAV_ITEMS } from "@/lib/constants";
import { THEME } from "@/lib/theme";
import { cn, scrollToSection } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  layers: Layers,
  briefcase: Briefcase,
  folder: FolderOpen,
  certificate: BadgeCheck,
  "graduation-cap": GraduationCap,
  award: Award,
  mail: Mail,
};

interface BottomNavProps {
  /** Section IDs that are currently visible. When undefined, all are shown. */
  visibleSections?: Set<string>;
}

export function BottomNav({ visibleSections }: BottomNavProps = {}) {
  // Filter nav items to only those whose section is visible
  const visibleItems = visibleSections
    ? NAV_ITEMS.filter((item) => visibleSections.has(item.id))
    : NAV_ITEMS;

  const sectionIds = visibleItems.map((item) => item.id);
  const activeId = useScrollSpy(sectionIds);
  const glass = THEME.glassNav;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goTo = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Desktop / tablet nav */}
      <nav
        className="fixed bottom-5 left-1/2 z-50 hidden w-[min(100%,calc(100vw-8rem))] -translate-x-1/2 md:block"
        aria-label="Section navigation"
      >
        <GlassSurface
          simple
          width="100%"
          height="auto"
          borderRadius={glass.borderRadius}
          backgroundOpacity={glass.backgroundOpacity}
          saturation={glass.saturation}
          blur={glass.blur}
          brightness={glass.brightness}
          className="mx-auto max-w-fit"
        >
          <ul className="flex items-center gap-0.5 px-1.5 py-1.5 lg:gap-1">
            {visibleItems.map((item) => {
              const Icon = iconMap[item.icon] ?? Home;
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    aria-label={`Go to ${item.label}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2.5 py-2 transition-colors duration-150 lg:px-3",
                      "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
                      isActive
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="hidden font-label text-[0.6rem] lg:inline">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </GlassSurface>
      </nav>

      {/* Mobile menu trigger — same bottom offset as resume FAB */}
      <div className="fixed bottom-5 right-3 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-sheet"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full",
            "border border-[var(--border)] bg-[var(--surface-elevated)]/95 text-[var(--foreground)]",
            "shadow-lg backdrop-blur-md",
            "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
          )}
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              id="mobile-nav-sheet"
              aria-label="Mobile section navigation"
              className="fixed bottom-[4.25rem] left-3 right-3 z-50 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/98 shadow-2xl backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="grid grid-cols-2 gap-1 p-2">
                {visibleItems.map((item) => {
                  const Icon = iconMap[item.icon] ?? Home;
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => goTo(item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left transition-colors",
                          isActive
                            ? "bg-[var(--foreground)] text-[var(--background)]"
                            : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="font-label text-[0.65rem]">
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
