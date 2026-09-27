"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_SLIDES } from "@/lib/images";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowUpRight } from "lucide-react";

export function HeroCarousel() {
  const { t, isRtl } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Autoplay with reduced motion check
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  const slide = HERO_SLIDES[currentIdx];

  return (
    <section
      className="relative w-full h-[90vh] min-h-[660px] max-h-[980px] overflow-hidden bg-[#0A0A0D]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="ADD Parkour Oran Campaign"
    >
      {/* Background Slides with High-Res Photography */}
      {HERO_SLIDES.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              className="object-cover object-center select-none"
              sizes="100vw"
            />
          </div>
          {/* Subtle gradient vignette to keep typography razor-sharp while preserving the photography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D]/90 via-[#0A0A0D]/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-transparent to-[#0A0A0D]/40 z-10" />
        </div>
      ))}

      {/* Main Content Overlay: Clean, Spacious, Typography-Driven */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-28 pb-10">
        {/* Subtle Natural City Reference without clutter */}
        <div className="flex items-center gap-3 animate-fade-in">
          <span 
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: slide.accentColor }} 
          />
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E9EA8]">
            ART DU DÉPLACEMENT // ORAN
          </span>
        </div>

        {/* Center: Oversized English Campaign Statement */}
        <div className="max-w-4xl my-auto py-6">
          <h1 className="font-display text-7xl sm:text-8xl lg:text-[10rem] font-black uppercase tracking-tight text-[#F5F5F2] leading-[0.85] drop-shadow-lg mb-6 select-none animate-slide-up">
            {slide.statement.split(" ")[0]} <br />
            <span style={{ color: slide.accentColor }}>
              {slide.statement.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          {/* Clean Action CTA Buttons - Localized Functional Content */}
          <div className="flex flex-wrap items-center gap-4 pt-4 animate-slide-up-delay">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-xl uppercase tracking-wider shadow-2xl transition-all duration-300 active:scale-95 group"
            >
              <span>{t.home.heroCta}</span>
              <ArrowUpRight className={`w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
            </Link>

            <a
              href="#disciplines"
              className="inline-flex items-center gap-2 px-6 py-4 rounded font-display text-sm font-bold uppercase tracking-wider text-[#F5F5F2] hover:text-[#FFD21F] transition-colors"
            >
              <span>{t.home.heroSecondary}</span>
              <span className="text-[#FFD21F]">↓</span>
            </a>
          </div>
        </div>

        {/* Bottom Campaign Navigation: Clean, Minimal, Non-Boxy */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-6">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Poster ${idx + 1}: ${s.statement}`}
                className={`group flex items-center gap-2 py-1 transition-all duration-300 text-left ${
                  idx === currentIdx
                    ? "text-[#F5F5F2] font-bold border-b-2"
                    : "text-[#9E9EA8]/70 hover:text-[#F5F5F2]"
                }`}
                style={{
                  borderBottomColor: idx === currentIdx ? s.accentColor : "transparent",
                }}
              >
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: idx === currentIdx ? s.accentColor : undefined }}
                >
                  0{idx + 1}
                </span>
                <span className="font-display font-bold text-xs uppercase tracking-wider">
                  {s.statement.replace(".", "")}
                </span>
              </button>
            ))}
          </div>

          {/* Minimal Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-10 h-10 rounded flex items-center justify-center bg-[#0A0A0D]/70 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-all font-mono text-sm"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-10 h-10 rounded flex items-center justify-center bg-[#0A0A0D]/70 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-all font-mono text-sm"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
