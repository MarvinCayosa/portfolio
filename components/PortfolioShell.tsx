/**
 * PortfolioShell — client shell that wraps all portfolio sections.
 *
 * Responsibilities:
 * - Shows the loading screen for 3 s then fades it out
 * - Provides the PortfolioReadyContext so child animations know when to start
 * - Respects sectionVisibility from Firestore to show/hide sections
 * - Renders the fixed chrome (TopChrome, BottomNav, ResumeFab, GradualBlur)
 */

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useReducedEffects } from "@/hooks/useReducedEffects";
import { PortfolioReadyContext } from "@/hooks/usePortfolioReady";

import { BottomNav } from "@/components/layout/BottomNav";
import { ResumeFab } from "@/components/layout/ResumeFab";
import { GradualBlur } from "@/components/react-bits/GradualBlur";
import { TopChrome } from "@/components/layout/TopChrome";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingScreen } from "@/components/sections/LoadingScreen";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { TooltipProvider } from "@/components/ui/Tooltip";

import { SECTION_IDS, DEFAULT_SECTION_VISIBILITY } from "@/lib/constants";
import type { PortfolioPageData, SectionVisibility } from "@/types";

/** Loading screen stays visible for 3 s, then fades out over 0.5 s */
const LOADING_EXIT_AT_MS = 3000;

interface PortfolioShellProps extends PortfolioPageData {}

export function PortfolioShell({
  projects,
  experiences,
  education,
  awards,
  certifications = [],
  sectionVisibility,
}: PortfolioShellProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const reducedEffects = useReducedEffects();

  // Merge stored visibility with defaults so new sections are always shown
  // unless explicitly hidden in the studio
  const vis: SectionVisibility = {
    ...DEFAULT_SECTION_VISIBILITY,
    ...(sectionVisibility ?? {}),
  };

  // Build the set of visible section IDs for the nav bar
  const visibleSections = new Set(
    Object.entries(vis)
      .filter(([, v]) => v !== false)
      .map(([k]) => k),
  );

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), LOADING_EXIT_AT_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <PortfolioReadyContext.Provider value={pageReady}>
      {/* Pointer events disabled until loader exits so nothing is clickable during load */}
      <div className={pageReady ? undefined : "pointer-events-none"}>
        <TooltipProvider>
          <TopChrome />

          {/* Top edge blur — sits above content */}
          <GradualBlur
            target="page"
            position="top"
            height={reducedEffects ? "5.5rem" : "7.5rem"}
            strength={reducedEffects ? 2.5 : 3.25}
            lite curve="bezier" exponential opacity={1} zIndex={35}
          />

          <PageWrapper>
            {/* Each section is conditionally rendered based on sectionVisibility */}
            {vis[SECTION_IDS.HOME] !== false && <Hero />}
            {vis[SECTION_IDS.SKILLS] !== false && <Skills />}
            {vis[SECTION_IDS.EXPERIENCE] !== false && (
              <Experience experiences={experiences} />
            )}
            {vis[SECTION_IDS.PROJECTS] !== false && (
              <Projects projects={projects} />
            )}
            {vis[SECTION_IDS.CERTIFICATIONS] !== false && (
              <Certifications certifications={certifications} />
            )}
            {vis[SECTION_IDS.EDUCATION] !== false && (
              <Education education={education} />
            )}
            {vis[SECTION_IDS.AWARDS] !== false && <Awards awards={awards} />}
            {/* Contact always rendered — it contains the footer */}
            <Contact />
          </PageWrapper>

          {/* Bottom edge blur — sits above content */}
          <GradualBlur
            target="page"
            position="bottom"
            height={reducedEffects ? "7rem" : "11rem"}
            strength={reducedEffects ? 2.5 : 3.25}
            lite curve="bezier" exponential opacity={1} zIndex={40}
          />

          <ResumeFab />
          <BottomNav visibleSections={visibleSections} />
        </TooltipProvider>
      </div>

      {/* Loading screen — AnimatePresence handles the fade-out */}
      <AnimatePresence onExitComplete={() => setPageReady(true)}>
        {showLoader && <LoadingScreen key="loading" />}
      </AnimatePresence>
    </PortfolioReadyContext.Provider>
  );
}
