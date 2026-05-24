/**
 * studio/ResumePanel.tsx — upload resume PDF; stored at siteConfig/resume.
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { C, SectionCard, StudioBtn, Toast } from "./ui";
import { useToast } from "./hooks";
import { RESUME_PATH } from "@/lib/constants";

interface ResumePanelProps {
  password: string;
}

export function ResumePanel({ password }: ResumePanelProps) {
  const { toast, show } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/studio/collection/siteConfig?doc=resume")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.url === "string") setResumeUrl(data.url);
      })
      .catch(() => {});
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("adminPassword", password);
      form.append("file", file);
      const res = await fetch("/api/studio/resume", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setResumeUrl(data.url);
      show("Resume uploaded — download button will use this file");
    } catch (err) {
      show(String(err), "err");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const downloadHref = resumeUrl ?? RESUME_PATH;

  return (
    <>
      <Toast toast={toast} />
      <SectionCard
        title="Resume (PDF)"
        subtitle="Upload your resume. The portfolio download button uses this file when set; otherwise the static file in public/resume/."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
            Current download target:{" "}
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.fg, wordBreak: "break-all" }}
            >
              {resumeUrl ? "Uploaded PDF" : "Static fallback"}
            </a>
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />

          <StudioBtn
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload PDF (max 8MB)"}
          </StudioBtn>
        </div>
      </SectionCard>
    </>
  );
}
