/**
 * studio/HeroPanel.tsx — edit the hero section content stored in Firestore.
 *
 * Data is stored at siteConfig/hero and read by the portfolio page.
 * The Hero component falls back to lib/constants.ts if the doc doesn't exist.
 */

"use client";

import React, { useEffect, useState } from "react";
import { C, SectionCard, Toast } from "./ui";
import { HeroForm } from "./forms";
import { useToast } from "./hooks";
import { HERO_COPY, HERO_ROLE_PREFIXES, HERO_STATS } from "@/lib/constants";

interface HeroPanelProps {
  password: string;
}

export function HeroPanel({ password }: HeroPanelProps) {
  const { toast, show } = useToast();
  const [heroData, setHeroData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  const fallbackHero = {
    ...HERO_COPY,
    rolePrefixes: [...HERO_ROLE_PREFIXES],
    stats: HERO_STATS.map((stat) => ({ ...stat })),
  };

  // Load existing hero config from Firestore on mount
  useEffect(() => {
    fetch("/api/studio/collection/siteConfig?doc=hero")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setHeroData(data);
          return;
        }
        setHeroData(fallbackHero);
      })
      .catch((err) => {
        show(String(err), "err");
        setHeroData(fallbackHero);
      });
  }, []);

  async function handleSave(doc: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch("/api/studio/collection/siteConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword: password, id: "hero", doc }),
      });
      if (!res.ok) throw new Error(await res.text());
      show("Hero saved — refresh the portfolio to see changes");
      setHeroData(doc);
    } catch (err) {
      show(String(err), "err");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toast toast={toast} />
      <SectionCard
        title="Hero Section"
        subtitle="Edit the name, bio, role cycler, and stats shown on the hero section."
      >
        {heroData === null ? (
          <p style={{ color: C.muted, fontSize: 13 }}>Loading…</p>
        ) : (
          <HeroForm
            initial={heroData}
            onSave={handleSave}
            onCancel={() => {}}
            saving={saving}
          />
        )}
      </SectionCard>
    </>
  );
}
