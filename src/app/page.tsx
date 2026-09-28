"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LastSeasonSection } from "@/components/public/LastSeasonSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LazyImage } from "@/components/ui/LazyImage";
import { KineticHeading } from "@/components/animations/KineticHeading";
import { RevealImage } from "@/components/animations/RevealImage";
import { AccentLine } from "@/components/animations/AccentLine";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2]">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO CAROUSEL: HIGH-IMPACT POSTER SHOWCASE WITH KINETIC TYPOGRAPHY */}
        <HeroCarousel />

        {/* 2. DISCIPLINE COMPOSITIONS — THREE DISTINCT VISUAL WORLDS WITH PERSONALIZED MOTION */}
        <section id="disciplines" className="relative bg-[#0A0A0D] overflow-hidden">
          {/* ========================================================
              DISCIPLINE 01: PARKOUR — URBAN FLIGHT (DIAGONAL / LATERAL MOTION)
             ======================================================== */}
          <div className="relative border-b border-white/10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
            {/* Trajectory Accent Line (Rule 14: Parkour trajectory line draws across) */}
            <AccentLine
              orientation="diagonal"
              color="#E52421"
              className="top-12 -left-4 w-72 h-32 opacity-30 hidden sm:block"
            />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Oversized Typography & Short Narrative */}
                <div className="lg:col-span-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#E52421] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E52421]" />
                    <span>{t.disciplines.parkour.name}</span>
                  </div>

                  {/* Kinetic English Campaign Statement with Lateral Personality */}
                  <div className="mb-6">
                    <KineticHeading
                      line1="MOVE"
                      line2="DIFFERENT."
                      accentColor="#E52421"
                      personality="lateral"
                      scrub={true}
                      className="text-6xl sm:text-8xl lg:text-9xl"
                    />
                  </div>

                  {/* Localized Functional Description */}
                  <ScrollReveal variant="fade-up" delay={100}>
                    <p className="font-body text-base text-[#9E9EA8] mb-8 max-w-md leading-relaxed">
                      {t.disciplines.parkour.desc}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-base uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] active:scale-95 group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                          {t.common.register}
                        </span>
                        <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ${isRtl ? "rtl-flip" : ""}`} />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: Dramatic Real Action Photograph with Cinematic Reveal & Lateral Parallax */}
                <div className="lg:col-span-6">
                  <RevealImage parallaxDirection="lateral" parallaxDistance={22}>
                    <div className="relative w-full h-[420px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <LazyImage
                        src="/images/disciplines/discipline-parkour.jpg"
                        alt={t.disciplines.parkour.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </RevealImage>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              DISCIPLINE 02: ESCALADE — TOWERING VERTICALITY (VERTICAL MOTION)
             ======================================================== */}
          <div className="relative border-b border-white/10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#121217]">
            {/* Vertical Accent Line (Rule 14: Escalade ascent indicator) */}
            <AccentLine
              orientation="vertical"
              color="#FFD21F"
              className="absolute top-20 right-8 h-64 opacity-25 hidden lg:block"
            />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Sheer Rock Action Photo with Vertical Parallax */}
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <RevealImage parallaxDirection="vertical" parallaxDistance={28}>
                    <div className="relative w-full h-[440px] sm:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <LazyImage
                        src="/images/disciplines/discipline-climbing.jpg"
                        alt={t.disciplines.escalade.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121217]/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </RevealImage>
                </div>

                {/* Right: Towering Text & Narrative with Vertical Kinetic Personality */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD21F]" />
                    <span>{t.disciplines.escalade.name}</span>
                  </div>

                  {/* Kinetic English Campaign Statement */}
                  <div className="mb-6">
                    <KineticHeading
                      line1="MOVE"
                      line2="HIGHER."
                      accentColor="#FFD21F"
                      personality="vertical"
                      scrub={true}
                      className="text-6xl sm:text-8xl lg:text-9xl"
                    />
                  </div>

                  {/* Localized Functional Description */}
                  <ScrollReveal variant="fade-up" delay={100}>
                    <p className="font-body text-base text-[#9E9EA8] mb-8 max-w-md leading-relaxed">
                      {t.disciplines.escalade.desc}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#FFD21F] hover:bg-[#FFB800] text-[#0A0A0D] font-display font-black text-base uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] active:scale-95 group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                          {t.common.register}
                        </span>
                        <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ${isRtl ? "rtl-flip" : ""}`} />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              DISCIPLINE 03: TRAIL — HORIZONTAL EXPANSE (HORIZONTAL VELOCITY)
             ======================================================== */}
          <div className="relative border-b border-white/10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0A0A0D]">
            {/* Horizontal Route Line (Rule 14: Trail route line extends across) */}
            <AccentLine
              orientation="horizontal"
              color="#FF3030"
              className="absolute bottom-16 left-0 w-96 opacity-25 hidden sm:block"
            />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Oversized Statement */}
                <div className="lg:col-span-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#FF3030] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF3030]" />
                    <span>{t.disciplines.trail.name}</span>
                  </div>

                  {/* Kinetic English Campaign Statement with Horizontal Personality */}
                  <div className="mb-6">
                    <KineticHeading
                      line1="RUN"
                      line2="FURTHER."
                      accentColor="#FF3030"
                      personality="horizontal"
                      scrub={true}
                      className="text-6xl sm:text-8xl lg:text-9xl"
                    />
                  </div>

                  {/* Localized Functional Description */}
                  <ScrollReveal variant="fade-up" delay={100}>
                    <p className="font-body text-base text-[#9E9EA8] mb-8 max-w-md leading-relaxed">
                      {t.disciplines.trail.desc}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-base uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] active:scale-95 group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                          {t.common.register}
                        </span>
                        <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ${isRtl ? "rtl-flip" : ""}`} />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: High-Speed Trail Runner Shot with Horizontal Parallax */}
                <div className="lg:col-span-6">
                  <RevealImage parallaxDirection="horizontal" parallaxDistance={24}>
                    <div className="relative w-full h-[420px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <LazyImage
                        src="/images/disciplines/discipline-trail.jpg"
                        alt={t.disciplines.trail.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </RevealImage>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LAST SEASON VISUAL SECTION: 2025 / 2026 REAL CLUB STORY */}
        <LastSeasonSection />

        {/* 4. ATHLETIC MANIFESTO: PHILOSOPHY & VALUES */}
        <section id="about" className="py-28 bg-[#121217] border-b border-white/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Movement Manifesto */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E52421]" />
                    <span>{t.nav.about}</span>
                  </div>
                  {/* Kinetic English Campaign Statement */}
                  <KineticHeading
                    line1="FIND"
                    line2="YOUR LINE."
                    accentColor="#E52421"
                    personality="editorial"
                    scrub={true}
                    className="text-5xl sm:text-7xl"
                  />
                </div>

                <ScrollReveal variant="fade-up" delay={100}>
                  <blockquote className="font-editorial italic text-2xl sm:text-3xl text-[#F5F5F2] border-l-2 border-[#E52421] pl-6 leading-snug">
                    « Être fort pour être utile. »
                  </blockquote>
                </ScrollReveal>

                <ScrollReveal variant="fade-up" delay={150}>
                  <p className="font-body text-base text-[#9E9EA8] leading-relaxed max-w-lg">
                    {t.home.aboutLead}
                  </p>
                </ScrollReveal>

                {/* 3 Core Tenets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                  <ScrollReveal variant="fade-up" delay={200}>
                    <div>
                      <div className="text-[#E52421] font-display font-bold text-lg uppercase mb-1">
                        {t.home.valuesArtTitle}
                      </div>
                      <div className="text-[#9E9EA8] text-xs leading-relaxed">
                        {t.home.valuesArtDesc}
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal variant="fade-up" delay={250}>
                    <div>
                      <div className="text-[#FFD21F] font-display font-bold text-lg uppercase mb-1">
                        {t.home.valuesDisciplineTitle}
                      </div>
                      <div className="text-[#9E9EA8] text-xs leading-relaxed">
                        {t.home.valuesDisciplineDesc}
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal variant="fade-up" delay={300}>
                    <div>
                      <div className="text-[#FF3030] font-display font-bold text-lg uppercase mb-1">
                        {t.home.valuesCommunityTitle}
                      </div>
                      <div className="text-[#9E9EA8] text-xs leading-relaxed">
                        {t.home.valuesCommunityDesc}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              {/* Right Column: High-End Campaign Photo of Athlete Overlooking Oran */}
              <div className="lg:col-span-6">
                <RevealImage parallaxDirection="vertical" parallaxDistance={20}>
                  <div className="relative w-full h-[460px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                    <LazyImage
                      src="/images/registration/reg-campaign.jpg"
                      alt="ADD Parkour Oran Culture"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217]/70 via-transparent to-transparent pointer-events-none" />
                  </div>
                </RevealImage>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FINAL CALL TO ACTION: POSTER MOMENT (Rules 17 & 18) */}
        <section className="py-32 bg-[#0A0A0D] text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
            {/* Kinetic Slogan Reveal */}
            <KineticHeading
              line1="JOIN THE"
              line2="MOVEMENT."
              accentColor="#E52421"
              personality="editorial"
              scrub={true}
              className="text-7xl sm:text-9xl"
            />

            {/* Localized Functional CTA with Micro-Interaction */}
            <ScrollReveal variant="fade-up" delay={150}>
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded font-display font-black text-xl text-[#F5F5F2] uppercase tracking-wider bg-[#E52421] hover:bg-[#FF3030] shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t.home.heroCta}
                  </span>
                  <ArrowUpRight className={`w-6 h-6 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-200 ${isRtl ? "rtl-flip" : ""}`} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
