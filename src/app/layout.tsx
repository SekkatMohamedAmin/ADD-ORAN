import type { Metadata } from "next";
import { Syne, DM_Serif_Display, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";

const fontDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
  display: "swap",
});

const fontEditorial = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADD PARKOUR ORAN — MOVE DIFFERENT // DEFY GRAVITY",
  description:
    "Club Art Du Déplacement Parkour Oran — Parkour, Escalade & sports de montagne, Trail. Adhésion officielle Saison 2026.",
  keywords: [
    "Parkour Oran",
    "Art du Déplacement",
    "Escalade Oran",
    "Trail Oran",
    "Club sportif Oran",
    "Algérie",
    "ADD Parkour Oran",
  ],
  icons: {
    icon: "/images/club/logo.svg",
    apple: "/images/club/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${fontDisplay.variable} ${fontEditorial.variable} ${fontBody.variable} ${fontMono.variable} h-full bg-[#0A0A0D] text-[#F5F5F2]`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0D] text-[#F5F5F2] font-body selection:bg-[#E52421] selection:text-[#F5F5F2]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
