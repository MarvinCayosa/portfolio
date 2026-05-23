/**
 * PortfolioShell — cinematic page shell with loading, chrome header, bottom nav.
 */

"use client";

import { useEffect, useState } from "react";
import { useReducedEffects } from "@/hooks/useReducedEffects";
import { PortfolioReadyContext } from "@/hooks/usePortfolioReady";
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

/** Text holds until 3s; 0.5s fade exit completes at 3.5s, then section animations run. */
const LOADING_EXIT_AT_MS = 3000;

interface PortfolioShellProps extends PortfolioPageData {}

export function PortfolioShell({
  projects,
  experiences,
  education: _education,
  awards,
}: PortfolioShellProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const reducedEffects = useReducedEffects();

  useEffect(() => {
    const exitTimer = setTimeout(() => setShowLoader(false), LOADING_EXIT_AT_MS);
    return () => clearTimeout(exitTimer);
  }, []);

  const onLoaderExitComplete = () => {
    setPageReady(true);
  };

  return (
    <PortfolioReadyContext.Provider value={pageReady}>
      <div className={pageReady ? undefined : "pointer-events-none"}>
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

      <AnimatePresence onExitComplete={onLoaderExitComplete}>
        {showLoader && <LoadingScreen key="loading" />}
      </AnimatePresence>
    </PortfolioReadyContext.Provider>
  );
}
