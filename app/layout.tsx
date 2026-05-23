/**
 * Root layout — fonts, theme provider, metadata.
 */

import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/styles/globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Cloud, data, and software engineer — portfolio.",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="relative min-h-dvh font-body antialiased">
        <ThemeProvider>
          <div
            className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
