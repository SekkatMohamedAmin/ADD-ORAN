"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LastSeasonSection } from "@/components/public/LastSeasonSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LazyImage } from "@/components/ui/LazyImage";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2]">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO CAROUSEL: HIGH-IMPACT POSTER SHOWCASE */}
        <HeroCarousel />

        {/* 2. DISCIPLINE COMPOSITIONS — THREE DISTINCT VISUAL WORLDS WITH LAZY SCROLL */}
        <section id="disciplines" className="relative bg-[#0A0A0D] overflow-hidden">
          {/* ========================================================
              DISCIPLINE 01: PARKOUR — URBAN FLIGHT
             ======================================================== */}
          <div className="relative border-b border-white/10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Oversized Typography & Short Narrative */}
                <div className="lg:col-span-6">
                  <ScrollReveal variant="fade-up">
                    <div className="font-mono text-xs uppercase tracking-widest text-[#E52421] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E52421]" />
                      <span>{t.disciplines.parkour.name}</span>
                    </div>

                    {/* Artistic English Campaign Statement */}
                    <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.85] mb-6">
                      MOVE <br />
                      <span className="text-[#E52421]">DIFFERENT.</span>
                    </h2>

                    {/* Localized Functional Description */}
                    <p className="font-body text-base text-[#9E9EA8] mb-8 max-w-md leading-relaxed">
                      {t.disciplines.parkour.desc}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-base uppercase tracking-wider transition-all shadow-lg group"
                      >
                        <span>{t.common.register}</span>
                        <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: Dramatic Real Action Photograph with Lazy Scroll Entrance */}
                <div className="lg:col-span-6">
                  <ScrollReveal variant="scale-up" delay={150}>
                    <div className="relative w-full h-[420px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <LazyImage
                        src="/images/disciplines/discipline-parkour.jpg"
                        alt={t.disciplines.parkour.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              DISCIPLINE 02: ESCALADE — TOWERING VERTICALITY
             ======================================================== */}
          <div className="relative border-b border-white/10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#121217]">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Sheer Rock Action Photo */}
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <ScrollReveal variant="scale-up">
                    <div className="relative w-full h-[440px] sm:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <LazyImage
                        src="/images/disciplines/discipline-climbing.jpg"
                        alt={t.disciplines.escalade.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121217]/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: Towering Text & Narrative */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <ScrollReveal variant="fade-up" delay={150}>
                    <div className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFD21F]" />
                      <span>{t.disciplines.escalade.name}</span>
                    </div>

                    {/* Artistic English Campaign Statement */}
                    <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.85] mb-6">
                      MOVE <br />
                      <span className="text-[#FFD21F]">HIGHER.</span>
                    </h2>

                    {/* Localized Functional Description */}
                    <p className="font-body text-base text-[#9E9EA8] mb-8 max-w-md leading-relaxed">
                      {t.disciplines.escalade.desc}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#FFD21F] hover:bg-[#FFB800] text-[#0A0A0D] font-display font-black text-base uppercase tracking-wider transition-all shadow-lg group"
                      >
                        <span>{t.common.register}</span>
                        <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              DISCIPLINE 03: TRAIL — HORIZONTAL EXPANSE
             ======================================================== */}
          <div className="relative border-b border-white/10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0A0A0D]">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Oversized Statement */}
                <div className="lg:col-span-6">
                  <ScrollReveal variant="fade-up">
                    <div className="font-mono text-xs uppercase tracking-widest text-[#FF3030] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF3030]" />
                      <span>{t.disciplines.trail.name}</span>
                    </div>

                    {/* Artistic English Campaign Statement */}
                    <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.85] mb-6">
                      RUN <br />
                      <span className="text-[#FF3030]">FURTHER.</span>
                    </h2>

                    {/* Localized Functional Description */}
                    <p className="font-body text-base text-[#9E9EA8] mb-8 max-w-md leading-relaxed">
                      {t.disciplines.trail.desc}
                    </p>

                    <div className="flex items-center gap-4">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-base uppercase tracking-wider transition-all shadow-lg group"
                      >
                        <span>{t.common.register}</span>
                        <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: High-Speed Trail Runner Shot */}
                <div className="lg:col-span-6">
                  <ScrollReveal variant="scale-up" delay={150}>
                    <div className="relative w-full h-[420px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                      <LazyImage
                        src="/images/disciplines/discipline-trail.jpg"
                        alt={t.disciplines.trail.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/70 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </ScrollReveal>
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
                <ScrollReveal variant="fade-up">
                  <div className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E52421]" />
                    <span>{t.nav.about}</span>
                  </div>
                  {/* Artistic English Campaign Statement */}
                  <h2 className="font-display text-5xl sm:text-7xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.9]">
                    FIND <br />
                    <span className="text-[#E52421]">YOUR LINE.</span>
                  </h2>
                </ScrollReveal>

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
                <ScrollReveal variant="scale-up" delay={200}>
                  <div className="relative w-full h-[460px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                    <LazyImage
                      src="/images/registration/reg-campaign.jpg"
                      alt="ADD Parkour Oran Culture"
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217]/70 via-transparent to-transparent pointer-events-none" />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FINAL CALL TO ACTION: POSTER MOMENT */}
        <section className="py-32 bg-[#0A0A0D] text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
            <ScrollReveal variant="fade-up">
              {/* Artistic English Slogan */}
              <h2 className="font-display text-7xl sm:text-9xl font-black text-[#F5F5F2] uppercase tracking-tight leading-[0.85]">
                JOIN THE <br />
                <span className="text-[#E52421]">MOVEMENT.</span>
              </h2>

              {/* Localized Functional CTA */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded font-display font-black text-xl text-[#F5F5F2] uppercase tracking-wider bg-[#E52421] hover:bg-[#FF3030] shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <span>{t.home.heroCta}</span>
                  <ArrowUpRight className={`w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
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
