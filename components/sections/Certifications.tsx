/**
 * Certifications — spotlight cards for licenses and certifications.
 */

"use client";

import { ExternalLink, Award } from "lucide-react";
import { BorderGlow } from "@/components/react-bits/BorderGlow";
import { FadeIn } from "@/components/animations/FadeIn";
import { TwoColumnSection } from "@/components/layout/TwoColumnSection";
import { SECTION_IDS, SECTION_TITLES } from "@/lib/constants";
import { useBorderGlowConfig } from "@/hooks/useBorderGlowConfig";
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
  const glow = useBorderGlowConfig();

  if (!certifications || certifications.length === 0) return null;

  return (
    <TwoColumnSection
      id={SECTION_IDS.CERTIFICATIONS}
      title={SECTION_TITLES.certifications}
    >
      <ul className="space-y-3">
        {certifications.map((cert, i) => (
          <li key={cert.id ?? i}>
            <FadeIn delay={i * 0.05}>
              <BorderGlow {...glow} borderRadius={12}>
                <div className="flex items-start gap-4 p-4 sm:p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted)]">
                    <Award className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-display text-base text-[var(--foreground)] sm:text-lg">
                        {cert.title}
                      </h3>
                      {cert.date && (
                        <span className="font-label shrink-0 text-[0.6rem] text-[var(--muted)]">
                          {formatDate(cert.date)}
                        </span>
                      )}
                    </div>
                    {cert.issuer && (
                      <p className="mt-0.5 font-body text-sm text-[var(--muted)]">
                        {cert.issuer}
                      </p>
                    )}
                    {cert.notes && (
                      <p className="mt-2 font-body text-xs leading-relaxed text-[var(--muted)]">
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
                        <ExternalLink className="h-3 w-3" aria-hidden />
                        View credential
                      </a>
                    )}
                  </div>
                </div>
              </BorderGlow>
            </FadeIn>
          </li>
        ))}
      </ul>
    </TwoColumnSection>
  );
}
