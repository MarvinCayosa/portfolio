/**
 * Home page — server component that fetches all portfolio data from Firestore
 * and passes it down to the client shell. `force-dynamic` ensures fresh data
 * on every request (no stale cache).
 */

import { PortfolioShell } from "@/components/PortfolioShell";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch everything from Firestore (falls back to constants if DB is unavailable)
  const data = await getPortfolioData();

  return (
    <PortfolioShell
      projects={data.projects}
      experiences={data.experiences}
      education={data.education}
      awards={data.awards}
      certifications={data.certifications ?? []}
      gallery={data.gallery ?? []}
      hero={data.hero ?? null}
      resumeUrl={data.resumeUrl}
      sectionVisibility={data.sectionVisibility}
    />
  );
}
