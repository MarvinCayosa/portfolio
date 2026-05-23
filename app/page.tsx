/**
 * Home page — single-page portfolio shell with DB-driven section data.
 */

import { PortfolioShell } from "@/components/PortfolioShell";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <PortfolioShell
      projects={data.projects}
      experiences={data.experiences}
      education={data.education}
      awards={data.awards}
    />
  );
}
