/**
 * PortfolioShell — cinematic page shell with loading, chrome header, bottom nav.
 */

"use client";

import { useEffect, useState } from "react";
import { useReducedEffects } from "@/hooks/useReducedEffects";
import { AnimatePresence } from "framer-motion";
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
import { Education } from "@/components/sections/Education";
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { TooltipProvider } from "@/components/ui/Tooltip";
import type { PortfolioPageData } from "@/types";

/** Text animation holds until 3s; 0.5s wipe exit completes at 3.5s. */
const LOADING_EXIT_AT_MS = 3000;
const LOADING_TOTAL_MS = 3500;

interface PortfolioShellProps extends PortfolioPageData {}

export function PortfolioShell({
  projects,
  experiences,
  education: _education,
  awards,
}: PortfolioShellProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [pageInteractive, setPageInteractive] = useState(false);
  const reducedEffects = useReducedEffects();

  useEffect(() => {
    const exitTimer = setTimeout(() => setShowLoader(false), LOADING_EXIT_AT_MS);
    const unlockTimer = setTimeout(() => setPageInteractive(true), LOADING_TOTAL_MS);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unlockTimer);
    };
  }, []);

  return (
    <>
      <div className={pageInteractive ? undefined : "pointer-events-none"}>
      <TooltipProvider>
        <TopChrome />
        <PageWrapper>
          <Hero />
          <Skills />
          <Experience experiences={experiences} />
          <Projects projects={projects} />
          <Education />
          <Awards awards={awards} />
          <Contact />
        </PageWrapper>
        <GradualBlur
          target="page"
          position="bottom"
          height={reducedEffects ? "7rem" : "11rem"}
          strength={reducedEffects ? 2.5 : 3.25}
          lite
          curve="bezier"
          exponential
          opacity={1}
          zIndex={40}
        />
        <ResumeFab />
        <BottomNav />
      </TooltipProvider>
      </div>

      <AnimatePresence>
        {showLoader && <LoadingScreen key="loading" />}
      </AnimatePresence>
    </>
  );
}
