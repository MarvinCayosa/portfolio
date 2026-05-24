/**
 * studio/ui.tsx — small, reusable UI primitives used throughout the studio.
 *
 * StudioBtn    — button with primary / danger / ghost variants
 * StudioInput  — labelled text input
 * StudioTextarea — labelled textarea
 * StudioSelect — labelled select dropdown
 * Toast        — fixed bottom-right notification
 * Toggle       — iOS-style slide switch for section visibility
 * SectionCard  — card wrapper with title + optional action slot
 */

"use client";

import React from "react";
import type { ToastState } from "./hooks";

// ─── Colour tokens (dark theme) ───────────────────────────────────────────────
export const C = {
  bg:       "#0a0a0a",
  surface:  "#141414",
  elevated: "#1c1c1c",
  border:   "#2a2a2a",
  fg:       "#f2f0eb",
  muted:    "#888",
  danger:   "#7f1d1d",
  dangerFg: "#fca5a5",
  ok:       "#14532d",
  okFg:     "#86efac",
} as const;

// ─── StudioBtn ────────────────────────────────────────────────────────────────

type BtnVariant = "primary" | "danger" | "ghost";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function StudioBtn({
  variant = "primary",
  icon,
  fullWidth,
  children,
  style,
  ...rest
}: BtnProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 18px",
    borderRadius: 8,
    border: variant === "ghost" ? `1px solid ${C.border}` : "none",
    cursor: rest.disabled ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 500,
    opacity: rest.disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : undefined,
    background:
      variant === "primary" ? C.fg :
      variant === "danger"  ? C.danger :
      C.elevated,
    color:
      variant === "primary" ? C.bg :
      variant === "danger"  ? C.dangerFg :
      C.muted,
    transition: "opacity 0.15s",
    ...style,
  };
  return (
    <button style={base} {...rest}>
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── StudioInput ──────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function StudioInput({ label, hint, style, ...rest }: InputProps) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: C.muted, marginBottom: 5 }}>
        {label}
      </span>
      <input
        style={{
          width: "100%",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          color: C.fg,
          padding: "9px 12px",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      />
      {hint && <span style={{ display: "block", fontSize: 11, color: C.muted, marginTop: 4 }}>{hint}</span>}
    </label>
  );
}

// ─── StudioTextarea ───────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function StudioTextarea({ label, hint, style, ...rest }: TextareaProps) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: C.muted, marginBottom: 5 }}>
        {label}
      </span>
      <textarea
        style={{
          width: "100%",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          color: C.fg,
          padding: "9px 12px",
          fontSize: 14,
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
          fontFamily: "inherit",
          ...style,
        }}
        {...rest}
      />
      {hint && <span style={{ display: "block", fontSize: 11, color: C.muted, marginTop: 4 }}>{hint}</span>}
    </label>
  );
}

// ─── StudioSelect ─────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function StudioSelect({ label, options, style, ...rest }: SelectProps) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: C.muted, marginBottom: 5 }}>
        {label}
      </span>
      <select
        style={{
          width: "100%",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          color: C.fg,
          padding: "9px 12px",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        right: 16,
        zIndex: 9999,
        background: toast.type === "ok" ? C.ok : C.danger,
        color: toast.type === "ok" ? C.okFg : C.dangerFg,
        border: `1px solid ${toast.type === "ok" ? "#166534" : "#991b1b"}`,
        borderRadius: 10,
        padding: "10px 18px",
        fontSize: 13,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {toast.msg}
    </div>
  );
}

// ─── Toggle (slide switch) ────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}

export function Toggle({ checked, onChange, disabled, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Track */}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width: 40,
          height: 22,
          borderRadius: 99,
          background: checked ? C.fg : C.border,
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: checked ? C.bg : C.muted,
            transition: "left 0.2s, background 0.2s",
          }}
        />
      </span>
      <span style={{ fontSize: 13, color: checked ? C.fg : C.muted, textTransform: "capitalize" }}>
        {label}
      </span>
    </button>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "20px 20px",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.fg }}>{title}</h2>
          {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>{subtitle}</p>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "16px 0" }} />;
}
