/**
 * studio/UploadPanel.tsx — upload files to Firebase Storage.
 *
 * After a successful upload the public URL is shown and copied to clipboard.
 * The panel also exposes an imperative `triggerUpload(onUrl)` function so
 * collection forms can request an upload and receive the URL back.
 */

"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { C, SectionCard, StudioBtn, Toast } from "./ui";
import { useToast } from "./hooks";

export interface UploadPanelHandle {
  /** Open the file picker; calls onUrl with the resulting URL */
  triggerUpload: (onUrl: (url: string) => void, onEnd?: () => void) => void;
}

interface UploadPanelProps {
  password: string;
  /** When true, the panel renders nothing visible — only the hidden file input */
  hidden?: boolean;
}

export const UploadPanel = forwardRef<UploadPanelHandle, UploadPanelProps>(
  function UploadPanel({ password, hidden }, ref) {
    const { toast, show } = useToast();
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [lastUrl, setLastUrl] = useState("");
    // Callbacks set by triggerUpload
    const pendingCallback = useRef<((url: string) => void) | null>(null);
    const pendingOnEnd = useRef<(() => void) | null>(null);

    function finishPending() {
      pendingOnEnd.current?.();
      pendingOnEnd.current = null;
      pendingCallback.current = null;
    }

    // Expose triggerUpload to parent components
    useImperativeHandle(ref, () => ({
      triggerUpload(onUrl, onEnd) {
        pendingCallback.current = onUrl;
        pendingOnEnd.current = onEnd ?? null;
        const onWindowFocus = () => {
          window.removeEventListener("focus", onWindowFocus);
          setTimeout(() => {
            if (!fileRef.current?.files?.length) finishPending();
          }, 300);
        };
        window.addEventListener("focus", onWindowFocus);
        fileRef.current?.click();
      },
    }));

    async function handleUpload() {
      const file = fileRef.current?.files?.[0];
      if (!file) {
        show("No file selected", "err");
        finishPending();
        return;
      }

      // Check file size (5MB limit)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        show("File size exceeds 5MB limit", "err");
        if (fileRef.current) fileRef.current.value = "";
        finishPending();
        return;
      }

      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("adminPassword", password);

        const res = await fetch("/api/studio/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        if (!data?.url) throw new Error("No URL returned");

        const fromForm = Boolean(pendingCallback.current);
        setLastUrl(data.url);
        if (!fromForm) navigator.clipboard?.writeText(data.url).catch(() => {});
        show(fromForm ? "Image uploaded" : "Uploaded — URL copied to clipboard");

        if (pendingCallback.current) {
          pendingCallback.current(data.url);
        }

        if (fileRef.current) fileRef.current.value = "";
      } catch (err) {
        show(String(err), "err");
      } finally {
        setUploading(false);
        finishPending();
      }
    }

    // Hidden mode — only render the file input (no visible UI)
    if (hidden) {
      return (
        <>
          <Toast toast={toast} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </>
      );
    }

    return (
      <>
        <Toast toast={toast} />
        <SectionCard
          title="Upload to Firebase Storage"
          subtitle="Images are made public and the URL is copied to your clipboard automatically."
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
            <StudioBtn
              variant="ghost"
              icon={<Upload size={14} />}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Choose file & upload"}
            </StudioBtn>
          </div>

          {lastUrl && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Last uploaded URL:</p>
              <code
                style={{
                  display: "block",
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontSize: 12,
                  color: C.fg,
                  wordBreak: "break-all",
                }}
              >
                {lastUrl}
              </code>
              {/* Preview */}
              {/\.(png|jpe?g|gif|webp|svg)$/i.test(lastUrl) && (
                <img
                  src={lastUrl}
                  alt="uploaded"
                  style={{ marginTop: 8, maxHeight: 100, borderRadius: 6, border: `1px solid ${C.border}` }}
                />
              )}
            </div>
          )}
        </SectionCard>
      </>
    );
  },
);
