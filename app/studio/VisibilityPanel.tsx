/**
 * studio/VisibilityPanel.tsx — slide toggles for each portfolio section.
 *
 * Each toggle auto-saves to Firestore on change (no Save button needed).
 * The portfolio page reads siteConfig/visibility on every request so changes
 * are reflected immediately after a page refresh.
 */

"use client";

import React from "react";
import { C, SectionCard, Toggle } from "./ui";
import { useVisibility } from "./hooks";
import { DEFAULT_SECTION_VISIBILITY } from "@/lib/constants";

// Human-readable labels for each section key
const SECTION_LABELS: Record<string, string> = {
  home:           "Hero / Home",
  skills:         "Skills",
  experience:     "Experience",
  projects:       "Projects",
  certifications: "Certifications",
  education:      "Education",
  awards:         "Awards",
  contact:        "Contact",
};

interface VisibilityPanelProps {
  password: string;
}

export function VisibilityPanel({ password }: VisibilityPanelProps) {
  const { visibility, saving, toggle } = useVisibility(true, DEFAULT_SECTION_VISIBILITY);

  return (
    <SectionCard
      title="Section Visibility"
      subtitle="Toggle sections on or off. Changes save instantly and take effect on the next page load."
    >
      {saving && (
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Saving…</p>
      )}

      <div
        style={{
          display: "grid",
          // 2 columns on wider screens, 1 on narrow
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 14,
        }}
      >
        {Object.keys(visibility).map((key) => (
          <div
            key={key}
            style={{
              background: C.elevated,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 13, color: C.fg }}>
              {SECTION_LABELS[key] ?? key}
            </span>
            <Toggle
              checked={!!visibility[key]}
              onChange={(v) => toggle(key, v, password)}
              disabled={saving}
              label={visibility[key] ? "visible" : "hidden"}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
