/**
 * studio/CollectionPanel.tsx — manages one Firestore collection.
 *
 * Shows a list of existing documents with Edit / Delete buttons,
 * and an inline form to create or edit a document.
 * The form is collection-aware — it renders the right fields for each type.
 */

"use client";

import React, { useRef, useState } from "react";
import { Edit2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { C, SectionCard, StudioBtn, Toast } from "./ui";
import {
  ProjectForm,
  ExperienceForm,
  EducationForm,
  CertificationForm,
  AwardForm,
} from "./forms";
import { useCollection, useToast } from "./hooks";
import type { CollectionName, CollectionMeta } from "./types";

interface CollectionPanelProps {
  meta: CollectionMeta;
  password: string;
  /** Open file picker; onUrl receives the uploaded image URL when done */
  onUploadRequest: (onUrl: (url: string) => void, onEnd?: () => void) => void;
}

export function CollectionPanel({ meta, password, onUploadRequest }: CollectionPanelProps) {
  const { items, loading, reload } = useCollection(meta.id, true);
  const { toast, show } = useToast();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // ── Save (create or update) ─────────────────────────────────────────────────
  async function handleSave(doc: Record<string, unknown>, id?: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/studio/collection/${meta.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword: password, doc, id }),
      });
      if (!res.ok) throw new Error(await res.text());
      show(id ? "Updated successfully" : "Created successfully");
      setEditing(null);
      setShowForm(false);
      await reload();
    } catch (err) {
      show(String(err), "err");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await fetch(`/api/studio/collection/${meta.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPassword: password, id }),
    });
    if (res.ok) {
      show("Deleted");
      await reload();
    } else {
      show("Delete failed", "err");
    }
  }

  // ── Start editing an existing item ──────────────────────────────────────────
  function startEdit(item: Record<string, unknown>) {
    setEditing(item);
    setShowForm(true);
    // Scroll the form into view on mobile
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  // ── Render the right form for this collection ───────────────────────────────
  function renderForm() {
    const props = {
      initial: editing ?? undefined,
      onSave: handleSave,
      onCancel: () => { setEditing(null); setShowForm(false); },
      onUploadRequest,
      saving,
    };
    switch (meta.id) {
      case "projects":       return <ProjectForm {...props} />;
      case "experiences":    return <ExperienceForm {...props} />;
      case "education":      return <EducationForm {...props} />;
      case "certifications": return <CertificationForm {...props} />;
      case "awards":         return <AwardForm {...props} />;
      default:               return null;
    }
  }

  // ── Summary line for each item ──────────────────────────────────────────────
  function itemSummary(item: Record<string, unknown>): string {
    switch (meta.id) {
      case "projects":       return `${item.title ?? "Untitled"} ${item.featured ? "★" : ""}`;
      case "experiences":    return `${item.role ?? ""} @ ${item.company ?? ""}`;
      case "education":      return `${item.degree ?? ""} — ${item.institution ?? ""}`;
      case "certifications": return `${item.title ?? ""} · ${item.issuer ?? ""}`;
      case "awards":         return `${item.title ?? ""} (${item.year ?? ""})`;
      case "messages":       return `From: ${item.name ?? item.email ?? "Unknown"} — ${String(item.message ?? "").slice(0, 60)}`;
      default:               return String(item.id ?? "");
    }
  }

  return (
    <>
      <Toast toast={toast} />

      {/* Form panel — shown when adding or editing */}
      {showForm && !meta.readOnly && (
        <div ref={formRef}>
          <SectionCard
            title={editing ? `Edit ${meta.label.slice(0, -1)}` : `New ${meta.label.slice(0, -1)}`}
            subtitle={editing ? `Editing ID: ${editing.id}` : `Fill in the fields below`}
          >
            {renderForm()}
          </SectionCard>
        </div>
      )}

      {/* Items list */}
      <SectionCard
        title={`${meta.label} (${items.length})`}
        subtitle={meta.description}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <StudioBtn variant="ghost" icon={<RefreshCw size={13} />} onClick={reload}>
              Refresh
            </StudioBtn>
            {!meta.readOnly && (
              <StudioBtn
                icon={<Plus size={13} />}
                onClick={() => { setEditing(null); setShowForm(true); }}
              >
                Add
              </StudioBtn>
            )}
          </div>
        }
      >
        {loading && (
          <p style={{ color: C.muted, fontSize: 13 }}>Loading…</p>
        )}
        {!loading && items.length === 0 && (
          <p style={{ color: "#555", fontSize: 13 }}>
            No documents yet.{!meta.readOnly && " Click Add to create one."}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item: Record<string, unknown>) => {
            const imageUrl = meta.id === "projects" && typeof item.image === "string" ? item.image : null;
            return (
            <div
              key={String(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: C.elevated,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }}
                />
              )}

              <span style={{ flex: 1, fontSize: 13, color: C.fg, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {itemSummary(item)}
              </span>

              {!meta.readOnly && (
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <StudioBtn
                    variant="ghost"
                    icon={<Edit2 size={13} />}
                    onClick={() => startEdit(item)}
                    style={{ padding: "6px 10px" }}
                  >
                    Edit
                  </StudioBtn>
                  <StudioBtn
                    variant="danger"
                    icon={<Trash2 size={13} />}
                    onClick={() => handleDelete(String(item.id))}
                    style={{ padding: "6px 10px" }}
                  />
                </div>
              )}
            </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
