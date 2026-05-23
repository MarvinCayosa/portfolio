/**
 * Contact — compact paths + form, then footer.
 */

"use client";

import { useState, type FormEvent } from "react";
import { Check, Handshake, MessageCircle, Briefcase } from "lucide-react";
import { BorderGlow } from "@/components/react-bits/BorderGlow";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/Button";
import { CONTACT_COPY, SECTION_IDS } from "@/lib/constants";
import { useBorderGlowConfig } from "@/hooks/useBorderGlowConfig";
import { cn } from "@/lib/utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const pathIcons = {
  collaborate: Handshake,
  services: Briefcase,
  connect: MessageCircle,
} as const;

export function Contact() {
  const glow = useBorderGlowConfig();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Required";
    if (!email.trim()) next.email = "Required";
    else if (!emailPattern.test(email)) next.email = "Invalid email";
    if (!message.trim()) next.message = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputClass = cn(
    "w-full rounded border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2",
    "font-body text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]",
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
  );

  return (
    <>
      <SectionContainer
        id={SECTION_IDS.CONTACT}
        className="border-t border-[var(--border)] py-12 sm:py-14"
      >
        <FadeIn>
          <h2 className="font-display heading-section text-[var(--foreground)]">
            {CONTACT_COPY.title}
          </h2>
          <p className="mt-2 max-w-2xl font-body text-sm text-[var(--muted)] sm:text-base">
            {CONTACT_COPY.subtitle}
          </p>
        </FadeIn>

        <ul className="mt-6 grid gap-2 sm:grid-cols-3 sm:items-stretch">
          {CONTACT_COPY.paths.map((path, i) => {
            const Icon = pathIcons[path.id as keyof typeof pathIcons] ?? MessageCircle;
            const mailto = `mailto:${CONTACT_COPY.directEmail}?subject=${encodeURIComponent(path.mailSubject)}`;

            return (
              <FadeIn key={path.id} delay={i * 0.04} className="h-full">
                <BorderGlow {...glow} borderRadius={12} className="h-full">
                  <a
                    href={mailto}
                    className="flex h-full min-h-[9.75rem] flex-col gap-2 p-3.5 transition-transform hover:-translate-y-0.5 sm:min-h-[11rem] sm:p-4"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden />
                    <h3 className="font-display text-base text-[var(--foreground)]">
                      {path.title}
                    </h3>
                    <p className="line-clamp-2 flex-1 font-body text-xs leading-snug text-[var(--muted)]">
                      {path.description}
                    </p>
                    <span className="font-label mt-auto text-[0.6rem] text-[var(--foreground)]">
                      {path.cta} →
                    </span>
                  </a>
                </BorderGlow>
              </FadeIn>
            );
          })}
        </ul>

        <FadeIn delay={0.1}>
          <BorderGlow {...glow} borderRadius={12} className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-3 p-4" noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-label mb-1 block text-[var(--muted)]"
                  >
                    {CONTACT_COPY.formName}
                  </label>
                  <input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-label mb-1 block text-[var(--muted)]"
                  >
                    {CONTACT_COPY.formEmail}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="font-label mb-1 block text-[var(--muted)]"
                >
                  {CONTACT_COPY.formMessage}
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={inputClass}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : CONTACT_COPY.submit}
              </Button>
              {status === "success" && (
                <p className="flex items-center gap-2 text-sm" role="status">
                  <Check className="h-4 w-4" />
                  {CONTACT_COPY.success}
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-500">{CONTACT_COPY.error}</p>
              )}
            </form>
          </BorderGlow>
        </FadeIn>
      </SectionContainer>
      <Footer />
    </>
  );
}
