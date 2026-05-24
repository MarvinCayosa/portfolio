/**
 * Gallery — full-bleed dome gallery section (no title or framed container).
 */

"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SECTION_IDS } from "@/lib/constants";
import type { GalleryImageRecord } from "@/types";

const DomeGallery = dynamic(() => import("@/components/react-bits/DomeGallery"), {
  ssr: false,
  loading: () => (
    <div className="h-[min(100dvh,900px)] min-h-[70dvh] w-full animate-pulse bg-[var(--background)]" />
  ),
});

interface GalleryProps {
  images: GalleryImageRecord[];
}

export function Gallery({ images }: GalleryProps) {
  const { theme } = useTheme();
  const overlayColor = theme === "dark" ? "#0a0a0a" : "#fafafa";

  const domeImages = images.map((img) => ({
    src: img.image,
    alt: img.alt ?? "Gallery photo",
  }));

  return (
    <section
      id={SECTION_IDS.GALLERY}
      className="scroll-mt-20 relative h-[min(100dvh,900px)] min-h-[70dvh] w-full overflow-hidden"
      aria-label="Gallery"
    >
      {domeImages.length > 0 ? (
        <DomeGallery
          images={domeImages}
          fit={0.78}
          minRadius={1100}
          maxVerticalRotationDeg={6}
          segments={26}
          curvature={0.82}
          perspectiveFactor={2.85}
          overlayBlurColor={overlayColor}
          grayscale={false}
          imageBorderRadius="18px"
          openedImageBorderRadius="20px"
          openedImageWidth="min(90vw, 420px)"
          openedImageHeight="min(70vh, 520px)"
        />
      ) : (
        <p className="flex h-full w-full items-center justify-center px-6 text-center font-body text-sm text-[var(--muted)]">
          Add photos in Studio → Gallery to populate this section.
        </p>
      )}
    </section>
  );
}
