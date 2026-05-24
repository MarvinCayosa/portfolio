/**
 * Certifications — compact responsive credential cards.
 */

"use client";

import { ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { TwoColumnSection } from "@/components/layout/TwoColumnSection";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import type { CertificationRecord } from "@/types";

interface CertificationsProps {
  certifications: CertificationRecord[];
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function Certifications({ certifications }: CertificationsProps) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <TwoColumnSection
      id={SECTION_IDS.CERTIFICATIONS}
      title={SECTION_TITLES.certifications}
    >
      <ul className="space-y-3 sm:space-y-4">
        {certifications.map((cert, i) => (
          <li key={cert.id ?? i}>
            <FadeIn delay={i * 0.05}>
              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:rounded-2xl sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[clamp(0.95rem,3.5vw,1.125rem)] leading-snug text-[var(--foreground)]">
                      {cert.title}
                    </h3>
                    {cert.issuer && (
                      <p className="mt-1 font-body text-[clamp(0.8rem,2.8vw,0.875rem)] text-[var(--muted)]">
                        {cert.issuer}
                      </p>
                    )}
                  </div>
                  {cert.date && (
                    <time
                      dateTime={cert.date}
                      className="font-label shrink-0 text-[0.6rem] tracking-wide text-[var(--muted)] sm:text-[0.65rem]"
                    >
                      {formatDate(cert.date)}
                    </time>
                  )}
                </div>

                {cert.notes && (
                  <p className="mt-2.5 font-body text-[clamp(0.75rem,2.6vw,0.8125rem)] leading-relaxed text-[var(--muted)]">
                    {cert.notes}
                  </p>
                )}

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-3 inline-flex items-center gap-1.5 font-label text-[0.6rem] text-[var(--foreground)]"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                    Verify credential
                  </a>
                )}
              </article>
            </FadeIn>
          </li>
        ))}
      </ul>
    </TwoColumnSection>
  );
}
