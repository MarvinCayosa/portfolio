/**
 * studio/hooks.ts — shared React hooks for the studio.
 *
 * useToast    — shows a temporary success/error notification
 * useCollection — fetches and manages a single Firestore collection
 * useVisibility — fetches and saves siteConfig/visibility
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { CollectionName } from "./types";

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastState = { msg: string; type: "ok" | "err" } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const show = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    // Auto-dismiss after 3.5 s
    setTimeout(() => setToast(null), 3500);
  }, []);

  return { toast, show };
}

// ─── Collection ───────────────────────────────────────────────────────────────

export function useCollection(name: CollectionName, unlocked: boolean) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/studio/collection/${name}`);
      setItems(res.ok ? await res.json() : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [name]);

  // Reload whenever the active collection changes (and we're unlocked)
  useEffect(() => {
    if (unlocked) load();
  }, [unlocked, load]);

  return { items, loading, reload: load };
}

// ─── Visibility ───────────────────────────────────────────────────────────────

export function useVisibility(
  unlocked: boolean,
  defaults: Record<string, boolean>,
) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(defaults);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/studio/collection/siteConfig?doc=visibility`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === "object" && !Array.isArray(data)) {
        // Merge stored values with defaults so new sections always appear
        setVisibility({ ...defaults, ...data });
      }
    } catch {
      // Keep defaults on error
    }
  }, [defaults]);

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked, load]);

  /** Toggle a single section and immediately persist to Firestore */
  const toggle = useCallback(
    async (key: string, value: boolean, password: string) => {
      const next = { ...visibility, [key]: value };
      setVisibility(next); // optimistic update
      setSaving(true);
      try {
        await fetch(`/api/studio/collection/siteConfig`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminPassword: password, id: "visibility", doc: next }),
        });
      } catch {
        // Revert on failure
        setVisibility(visibility);
      } finally {
        setSaving(false);
      }
    },
    [visibility],
  );

  return { visibility, setVisibility, saving, toggle };
}
