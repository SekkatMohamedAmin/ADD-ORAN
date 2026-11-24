"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FluidKineticBackground } from "@/components/public/FluidKineticBackground";
import { DisciplineBranchScroll } from "@/components/public/DisciplineBranchScroll";
import { AboutSection } from "@/components/public/AboutSection";
import { ArrowUpRight } from "lucide-react";

// Performance Optimization: Dynamic import of below-the-fold archives gallery
const LastSeasonSection = dynamic(
  () =>
    import("@/components/public/LastSeasonSection").then(
      (mod) => mod.LastSeasonSection
    ),
  {
    ssr: true,
    loading: () => (
      <div className="py-24 sm:py-32 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E52421]/30 border-t-[#E52421] animate-spin" />
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2] overflow-x-hidden font-body">
      {/* 1. Global Navigation Bar on top */}
      <Navbar />

      {/* 2. Solid Pure Black Canvas */}
      <FluidKineticBackground />

      {/* 3. Main Page Content */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Hub + Branching Disciplines: Central 5-Section Emblem & 5 Disciplines */}
        <DisciplineBranchScroll />

        {/* Club Definition & Core Values: Qui sommes-nous ? */}
        <AboutSection />

        {/* Kept Section: Last Season Photos with Transparent Background (Code-Split) */}
        <LastSeasonSection />

        {/* Minimal Final Registration Bar */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center border-t border-white/10 bg-[#000000]">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase">
              REJOINDRE <span className="text-[#E52421]">ADD ORAN</span>
            </h2>
            <p className="font-body text-sm sm:text-base text-[#A0A0AB] max-w-lg mx-auto">
              Inscriptions ouvertes pour toutes les sections sportives. Encadrement certifié et progression adaptée à chaque niveau.
            </p>
            <div className="pt-2 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#E52421] hover:bg-[#FF3030] text-white shadow-[0_0_25px_rgba(229,36,33,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Formulaire d'inscription</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Official Full-Featured Footer (Socials, Contacts, Legal) */}
      <Footer />
    </div>
  );
}
