/**
 * studio/forms.tsx — form components for each Firestore collection.
 *
 * Each form component:
 * - Accepts an optional `initial` record (for editing existing docs)
 * - Calls `onSave(doc, id?)` when submitted
 * - Calls `onCancel()` when the user cancels
 *
 * Forms use plain HTML inputs (no JSON) so they're easy to use.
 */

"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload } from "lucide-react";
import { C, StudioBtn, StudioInput, StudioTextarea, StudioSelect, Divider } from "./ui";

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Renders a list of string items with add/remove controls */
function StringListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.muted, marginBottom: 5 }}>
        {label}
      </span>
      {hint && <span style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6 }}>{hint}</span>}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 6 }}>
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.fg, padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" as const }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              style={{ background: C.danger, border: "none", borderRadius: 8, color: C.dangerFg, padding: "0 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: "7px 12px", fontSize: 12, cursor: "pointer", alignSelf: "flex-start" as const }}
        >
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  );
}

/** Merge legacy image + photos fields into one ordered gallery */
function projectImagesFromRecord(initial?: Record<string, unknown>): string[] {
  const image = String(initial?.image ?? "");
  const photos = Array.isArray(initial?.photos) ? (initial.photos as string[]).filter(Boolean) : [];
  const out: string[] = [];
  if (image) out.push(image);
  for (const p of photos) {
    if (p && !out.includes(p)) out.push(p);
  }
  return out;
}

/** Upload-first image gallery for project photos */
function ImageGalleryEditor({
  images,
  onChange,
  onUploadRequest,
}: {
  images: string[];
  onChange: (v: string[]) => void;
  onUploadRequest?: (onUrl: (url: string) => void, onEnd?: () => void) => void;
}) {
  const [uploading, setUploading] = useState(false);

  function moveImage(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    onChange(reordered);
  }

  function handleUpload() {
    if (!onUploadRequest) return;
    setUploading(true);
    onUploadRequest(
      (url) => onChange([...images, url]),
      () => setUploading(false),
    );
  }

  return (
    <div>
      <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.muted, marginBottom: 5 }}>
        Project Images
      </span>
      <span style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 10 }}>
        Upload images — first image is the cover. Max 4MB per image.
      </span>

      {images.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
            marginBottom: 12,
          }}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                background: C.bg,
              }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector("[data-gallery-controls]") as HTMLElement | null;
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector("[data-gallery-controls]") as HTMLElement | null;
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              <img
                src={src}
                alt={i === 0 ? "Cover" : `Photo ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {i === 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    fontSize: 9,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  Cover
                </span>
              )}
              <div
                data-gallery-controls
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "rgba(0,0,0,0.55)",
                  opacity: 0,
                  transition: "opacity 0.15s",
                }}
              >
                <button
                  type="button"
                  title="Move up"
                  disabled={i === 0}
                  onClick={() => moveImage(i, -1)}
                  style={{
                    background: C.elevated,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    color: C.fg,
                    padding: "6px 8px",
                    cursor: i === 0 ? "not-allowed" : "pointer",
                    opacity: i === 0 ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={i === images.length - 1}
                  onClick={() => moveImage(i, 1)}
                  style={{
                    background: C.elevated,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    color: C.fg,
                    padding: "6px 8px",
                    cursor: i === images.length - 1 ? "not-allowed" : "pointer",
                    opacity: i === images.length - 1 ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                  style={{
                    background: C.danger,
                    border: "none",
                    borderRadius: 6,
                    color: C.dangerFg,
                    padding: "6px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {onUploadRequest && (
        <StudioBtn
          type="button"
          variant="ghost"
          icon={<Upload size={14} />}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </StudioBtn>
      )}
    </div>
  );
}

// ─── Form prop types ──────────────────────────────────────────────────────────

interface FormProps {
  initial?: Record<string, unknown>;
  onSave: (doc: Record<string, unknown>, id?: string) => Promise<void>;
  onCancel: () => void;
  onUploadRequest?: (onUrl: (url: string) => void, onEnd?: () => void) => void;
  saving?: boolean;
}

// ─── ProjectForm ──────────────────────────────────────────────────────────────

export function ProjectForm({ initial, onSave, onCancel, onUploadRequest, saving }: FormProps) {
  const [title, setTitle]               = useState(String(initial?.title ?? ""));
  const [description, setDescription]   = useState(String(initial?.description ?? ""));
  const [tags, setTags]                 = useState<string[]>(Array.isArray(initial?.tags) ? initial.tags as string[] : []);
  const [url, setUrl]                   = useState(String(initial?.url ?? ""));
  const [repoUrl, setRepoUrl]           = useState(String(initial?.repoUrl ?? ""));
  const [avpVideoUrl, setAvpVideoUrl]   = useState(String(initial?.avpVideoUrl ?? ""));
  const [gallery, setGallery]           = useState<string[]>(() => projectImagesFromRecord(initial));
  const [collaborators, setCollaborators] = useState(String(initial?.collaborators ?? ""));
  const [featured, setFeatured]         = useState(Boolean(initial?.featured));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title, description,
      tags: tags.filter(Boolean),
      url: url || null,
      repoUrl: repoUrl || null,
      avpVideoUrl: avpVideoUrl || null,
      image: gallery[0] ?? null,
      photos: gallery,
      collaborators: collaborators || null,
      featured,
    }, initial?.id as string | undefined);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StudioInput label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="My Project" />
      <StudioTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What does this project do?" />
      <StringListEditor label="Tags" hint="Technologies used" items={tags} onChange={setTags} placeholder="e.g. Next.js" />
      <ImageGalleryEditor
        images={gallery}
        onChange={setGallery}
        onUploadRequest={onUploadRequest}
      />
      <StudioInput label="Live URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" type="url" />
      <StudioInput label="GitHub / Repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/user/repo" type="url" />
      <StudioInput label="AVP Video URL" value={avpVideoUrl} onChange={(e) => setAvpVideoUrl(e.target.value)} placeholder="https://video.example.com" type="url" />
      <StudioInput label="Collaborators" value={collaborators} onChange={(e) => setCollaborators(e.target.value)} placeholder="Solo, or Team of 3" />
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.fg }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ accentColor: C.fg, width: 15, height: 15 }} />
        Featured project
      </label>
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving}>{saving ? "Saving…" : initial?.id ? "Update project" : "Add project"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}

// ─── ExperienceForm ───────────────────────────────────────────────────────────

export function ExperienceForm({ initial, onSave, onCancel, saving }: FormProps) {
  const [company, setCompany]   = useState(String(initial?.company ?? ""));
  const [role, setRole]         = useState(String(initial?.role ?? ""));
  const [startDate, setStart]   = useState(String(initial?.startDate ?? ""));
  const [endDate, setEnd]       = useState(String(initial?.endDate ?? ""));
  const [current, setCurrent]   = useState(Boolean(initial?.current));
  const [bullets, setBullets]   = useState<string[]>(Array.isArray(initial?.bullets) ? initial.bullets as string[] : []);
  const [order, setOrder]       = useState(String(initial?.order ?? ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      company, role,
      startDate: startDate || null,
      endDate: current ? null : (endDate || null),
      current,
      bullets: bullets.filter(Boolean),
      order: order ? Number(order) : undefined,
    }, initial?.id as string | undefined);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StudioInput label="Company *" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Company Name" />
      <StudioInput label="Role / Title *" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="Software Engineer" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StudioInput label="Start Date" value={startDate} onChange={(e) => setStart(e.target.value)} placeholder="2024-01-01" hint="YYYY-MM-DD" />
        <StudioInput label="End Date" value={endDate} onChange={(e) => setEnd(e.target.value)} placeholder="2025-06-01" disabled={current} hint="Leave blank if current" />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.fg }}>
        <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} style={{ accentColor: C.fg, width: 15, height: 15 }} />
        Currently working here
      </label>
      <StringListEditor label="Bullet Points" hint="Key achievements or responsibilities" items={bullets} onChange={setBullets} placeholder="Led a team of 5 engineers…" />
      <StudioInput label="Display Order" value={order} onChange={(e) => setOrder(e.target.value)} type="number" placeholder="1" hint="Lower numbers appear first" />
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving}>{saving ? "Saving…" : initial?.id ? "Update experience" : "Add experience"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}

// ─── EducationForm ────────────────────────────────────────────────────────────

export function EducationForm({ initial, onSave, onCancel, saving }: FormProps) {
  const [degree, setDegree]           = useState(String(initial?.degree ?? ""));
  const [institution, setInstitution] = useState(String(initial?.institution ?? ""));
  const [year, setYear]               = useState(String(initial?.year ?? ""));
  const [bullets, setBullets]         = useState<string[]>(
    Array.isArray(initial?.bullets)
      ? (initial?.bullets as string[])
      : initial?.notes
        ? [String(initial.notes)]
        : [],
  );
  const [order, setOrder]             = useState(String(initial?.order ?? ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      degree, institution,
      year: year ? Number(year) : null,
      bullets: bullets.filter(Boolean),
      order: order ? Number(order) : undefined,
    }, initial?.id as string | undefined);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StudioInput label="Degree *" value={degree} onChange={(e) => setDegree(e.target.value)} required placeholder="Bachelor of Science in Computer Engineering" />
      <StudioInput label="Institution *" value={institution} onChange={(e) => setInstitution(e.target.value)} required placeholder="University of the East — Manila" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StudioInput label="Graduation Year" value={year} onChange={(e) => setYear(e.target.value)} type="number" placeholder="2026" />
        <StudioInput label="Display Order" value={order} onChange={(e) => setOrder(e.target.value)} type="number" placeholder="1" />
      </div>
      <StringListEditor
        label="Bullet Points"
        hint="Key achievements or responsibilities"
        items={bullets}
        onChange={setBullets}
        placeholder="e.g. Magna Cum Laude, 2022–2026"
      />
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving}>{saving ? "Saving…" : initial?.id ? "Update education" : "Add education"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}

// ─── CertificationForm ────────────────────────────────────────────────────────

export function CertificationForm({ initial, onSave, onCancel, saving }: FormProps) {
  const [title, setTitle]   = useState(String(initial?.title ?? ""));
  const [issuer, setIssuer] = useState(String(initial?.issuer ?? ""));
  const [date, setDate]     = useState(String(initial?.date ?? ""));
  const [url, setUrl]       = useState(String(initial?.url ?? ""));
  const [notes, setNotes]   = useState(String(initial?.notes ?? ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title, issuer,
      date: date || null,
      url: url || null,
      notes: notes || null,
    }, initial?.id as string | undefined);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StudioInput label="Certification Title *" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="AWS Solutions Architect" />
      <StudioInput label="Issuing Organization" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Amazon Web Services" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StudioInput label="Date Issued" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2024-01-01" hint="YYYY-MM-DD" />
        <StudioInput label="Credential URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://credential.url" type="url" />
      </div>
      <StudioTextarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional notes about this certification" />
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving}>{saving ? "Saving…" : initial?.id ? "Update certification" : "Add certification"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}

// ─── GalleryForm ──────────────────────────────────────────────────────────────

export function GalleryForm({ initial, onSave, onCancel, onUploadRequest, saving }: FormProps) {
  const [image, setImage] = useState(String(initial?.image ?? ""));
  const [alt, setAlt] = useState(String(initial?.alt ?? ""));
  const [order, setOrder] = useState(String(initial?.order ?? ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    await onSave(
      {
        image,
        alt: alt || null,
        order: order ? Number(order) : undefined,
      },
      initial?.id as string | undefined,
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.muted, marginBottom: 5 }}>
          Photo
        </span>
        <span style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 8 }}>
          Upload an image for the dome gallery. Max 4MB.
        </span>
        {image && (
          <img
            src={image}
            alt={alt || "Preview"}
            style={{ display: "block", maxHeight: 120, borderRadius: 8, marginBottom: 10, border: `1px solid ${C.border}` }}
          />
        )}
        {onUploadRequest && (
          <StudioBtn
            type="button"
            variant="ghost"
            icon={<Upload size={14} />}
            onClick={() => onUploadRequest((url) => setImage(url))}
          >
            Upload image
          </StudioBtn>
        )}
      </div>
      <StudioInput label="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Graduation ceremony" />
      <StudioInput label="Display order" value={order} onChange={(e) => setOrder(e.target.value)} type="number" placeholder="1" hint="Lower numbers appear first in the dome" />
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving || !image}>{saving ? "Saving…" : initial?.id ? "Update photo" : "Add photo"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}

// ─── AwardForm ────────────────────────────────────────────────────────────────

export function AwardForm({ initial, onSave, onCancel, saving }: FormProps) {
  const [title, setTitle]       = useState(String(initial?.title ?? ""));
  const [issuer, setIssuer]     = useState(String(initial?.issuer ?? ""));
  const [year, setYear]         = useState(String(initial?.year ?? ""));
  const [yearEnd, setYearEnd]   = useState(
    initial?.yearEnd != null ? String(initial.yearEnd) : "",
  );
  const [yearError, setYearError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startYear = year ? Number(year) : null;
    const endYear = yearEnd ? Number(yearEnd) : null;
    if (startYear != null && endYear != null && endYear < startYear) {
      setYearError("End year must be the same as or after the start year.");
      return;
    }
    setYearError("");
    await onSave(
      {
        title,
        issuer,
        year: startYear,
        yearEnd: endYear,
      },
      initial?.id as string | undefined,
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StudioInput label="Award Title *" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Dean's List" />
      <StudioInput label="Awarded By" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="University of the East" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StudioInput label="Year *" value={year} onChange={(e) => setYear(e.target.value)} type="number" placeholder="2024" required />
        <StudioInput label="End year (optional)" value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} type="number" placeholder="2026" />
      </div>
      {yearError ? (
        <p style={{ fontSize: 12, color: "#e57373", margin: 0 }}>{yearError}</p>
      ) : (
        <p style={{ fontSize: 11, color: "var(--muted, #888)", margin: 0 }}>
          Leave end year empty for a single year, or set both for a range (e.g. 2022–2024).
        </p>
      )}
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving}>{saving ? "Saving…" : initial?.id ? "Update award" : "Add award"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}

// ─── HeroForm ─────────────────────────────────────────────────────────────────

export function HeroForm({ initial, onSave, onCancel, saving }: FormProps) {
  const [firstName, setFirstName]   = useState(String(initial?.firstName ?? "Marvin"));
  const [lastName, setLastName]     = useState(String(initial?.lastName ?? "Cayosa"));
  const [bioRole, setBioRole]       = useState(String(initial?.bioRole ?? "Computer Engineer"));
  const [bioHighlight, setBioHigh]  = useState(String(initial?.bioHighlight ?? "Magna Cum Laude"));
  const [bioBody, setBioBody]       = useState(String(initial?.bioBody ?? ""));
  const [bioClosing, setBioClosing] = useState(String(initial?.bioClosing ?? ""));
  const [location, setLocation]     = useState(String(initial?.location ?? "Remote · Worldwide"));
  const [availability, setAvail]    = useState(String(initial?.availability ?? "Available for contract & full-time"));
  const [rolePrefixes, setRoles]    = useState<string[]>(Array.isArray(initial?.rolePrefixes) ? initial.rolePrefixes as string[] : ["Cloud", "Data", "Software", "Embedded Systems"]);
  const [stats, setStats]           = useState<Array<{label:string;value:string}>>(
    Array.isArray(initial?.stats) ? initial.stats as Array<{label:string;value:string}> :
    [{ label: "Graduation", value: "2026" }, { label: "GPA", value: "1.38" }, { label: "Focus", value: "Cloud" }]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ firstName, lastName, bioRole, bioHighlight, bioBody, bioClosing, location, availability, rolePrefixes: rolePrefixes.filter(Boolean), stats }, initial?.id as string | undefined);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StudioInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <StudioInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <StudioInput label="Role (bio)" value={bioRole} onChange={(e) => setBioRole(e.target.value)} hint='Appears as "A [Role]"' />
      <StudioInput label="Highlight (bio)" value={bioHighlight} onChange={(e) => setBioHigh(e.target.value)} hint='Appears in italic, e.g. "Magna Cum Laude"' />
      <StudioTextarea label="Bio Body" value={bioBody} onChange={(e) => setBioBody(e.target.value)} rows={3} />
      <StudioInput label="Bio Closing Line" value={bioClosing} onChange={(e) => setBioClosing(e.target.value)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <StudioInput label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <StudioInput label="Availability" value={availability} onChange={(e) => setAvail(e.target.value)} />
      </div>
      <StringListEditor label="Role Prefixes (cycler)" hint='Words that cycle before "Engineer"' items={rolePrefixes} onChange={setRoles} placeholder="Cloud" />
      {/* Stats editor */}
      <div>
        <span style={{ display: "block", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.muted, marginBottom: 5 }}>Stats</span>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 6 }}>
              <input value={s.label} onChange={(e) => { const n=[...stats]; n[i]={...n[i],label:e.target.value}; setStats(n); }} placeholder="Label" style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.fg, padding: "8px 10px", fontSize: 13, outline: "none" }} />
              <input value={s.value} onChange={(e) => { const n=[...stats]; n[i]={...n[i],value:e.target.value}; setStats(n); }} placeholder="Value" style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.fg, padding: "8px 10px", fontSize: 13, outline: "none" }} />
              <button type="button" onClick={() => setStats(stats.filter((_,j)=>j!==i))} style={{ background: C.danger, border: "none", borderRadius: 8, color: C.dangerFg, padding: "0 10px", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={13}/></button>
            </div>
          ))}
          <button type="button" onClick={() => setStats([...stats, { label: "", value: "" }])} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, padding: "7px 12px", fontSize: 12, cursor: "pointer", alignSelf: "flex-start" as const }}><Plus size={12}/> Add stat</button>
        </div>
      </div>
      <Divider />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StudioBtn type="submit" disabled={saving}>{saving ? "Saving…" : "Save hero"}</StudioBtn>
        <StudioBtn type="button" variant="ghost" onClick={onCancel}>Cancel</StudioBtn>
      </div>
    </form>
  );
}
