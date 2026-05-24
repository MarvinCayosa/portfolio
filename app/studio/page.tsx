/**
 * app/studio/page.tsx — Admin Studio entry point.
 *
 * Layout:
 *   - Login screen (password gate)
 *   - Header with tab navigation
 *   - Tab panels: Hero | Projects | Experience | Education | Certifications | Awards | Messages | Visibility
 *
 * All data operations go through /api/studio/collection/[name].
 * The password is kept in React state (never sent to the server except as
 * a body field in POST/DELETE requests, matching ADMIN_PASSWORD env var).
 */

"use client";

import React, { useRef, useState } from "react";
import { LogOut } from "lucide-react";

import { C, StudioBtn, Toast } from "./ui";
import { CollectionPanel } from "./CollectionPanel";
import { VisibilityPanel } from "./VisibilityPanel";
import { HeroPanel } from "./HeroPanel";
import { UploadPanel, type UploadPanelHandle } from "./UploadPanel";
import { COLLECTIONS } from "./types";
import { useToast } from "./hooks";

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = "hero" | "visibility" | "projects" | "experiences" | "education" | "certifications" | "awards" | "messages";

const TABS: { id: TabId; label: string }[] = [
  { id: "hero",           label: "Hero" },
  { id: "visibility",     label: "Visibility" },
  { id: "projects",       label: "Projects" },
  { id: "experiences",    label: "Experience" },
  { id: "education",      label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "awards",         label: "Awards" },
  { id: "messages",       label: "Messages" },
];

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 16,
      }}
    >
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>Studio</h1>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: C.muted }}>
          Enter your admin password to continue
        </p>
        <input
          type="password"
          placeholder="Admin password"
          value={pw}
          autoFocus
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pw && onUnlock(pw)}
          style={{
            width: "100%",
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            color: C.fg,
            padding: "10px 14px",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 12,
          }}
        />
        <StudioBtn fullWidth onClick={() => pw && onUnlock(pw)}>
          Unlock Studio
        </StudioBtn>
      </div>
    </div>
  );
}

// ─── Main studio ──────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const { toast } = useToast();
  const uploadRef = useRef<UploadPanelHandle>(null);

  if (!unlocked) {
    return (
      <LoginScreen
        onUnlock={(pw) => {
          setPassword(pw);
          setUnlocked(true);
        }}
      />
    );
  }

  // Find the CollectionMeta for the active tab (if it's a collection tab)
  const activeMeta = COLLECTIONS.find((c) => c.id === activeTab);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.fg,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Toast toast={toast} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Studio</span>
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 99,
              background: C.elevated,
              border: `1px solid ${C.border}`,
              color: C.muted,
              letterSpacing: "0.06em",
            }}
          >
            ADMIN
          </span>
        </div>
        <StudioBtn
          variant="ghost"
          icon={<LogOut size={14} />}
          onClick={() => { setUnlocked(false); setPassword(""); }}
        >
          Sign out
        </StudioBtn>
      </header>

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ display: "flex", gap: 2, padding: "0 16px", minWidth: "max-content" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? `2px solid ${C.fg}` : "2px solid transparent",
                color: activeTab === tab.id ? C.fg : C.muted,
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* Hero tab */}
        {activeTab === "hero" && <HeroPanel password={password} />}

        {/* Visibility tab */}
        {activeTab === "visibility" && <VisibilityPanel password={password} />}

        {/* Collection tabs — UploadPanel is embedded inside CollectionPanel for Projects only */}
        {activeMeta && (
          <CollectionPanel
            key={activeMeta.id}
            meta={activeMeta}
            password={password}
            onUploadRequest={(onUrl, onEnd) => uploadRef.current?.triggerUpload(onUrl, onEnd)}
          />
        )}

        {/* Hidden upload panel — triggered programmatically by forms */}
        <UploadPanel ref={uploadRef} password={password} hidden />
      </main>
    </div>
  );
}
