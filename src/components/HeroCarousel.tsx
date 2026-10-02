"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_SLIDES } from "@/lib/images";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowUpRight } from "lucide-react";
import { HeroKineticTitle } from "@/components/animations/HeroKineticTitle";
import {
  gsap,
  prefersReducedMotion,
  isMobile,
  useIsomorphicLayoutEffect,
  MOTION_PRESETS,
} from "@/lib/animations/gsap-init";

export function HeroCarousel() {
  const { t, isRtl } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // GSAP animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Autoplay with reduced motion check
  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced || isPaused) {
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

  // Coordinated Hero Entrance & Scroll Scrub Timeline (Rules 5, 9, 32)
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Phase 1: Supporting badge enters gently at 0.2s
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, y: mobile ? -6 : -10 },
          {
            opacity: 1,
            y: 0,
            duration: mobile ? 0.5 : 0.6,
            delay: 0.15,
            ease: MOTION_PRESETS.easeEditorial,
          }
        );
      }

      // Phase 5: Action CTA buttons appear smoothly at 0.65s
      if (ctaGroupRef.current) {
        gsap.fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: mobile ? 18 : 30 },
          {
            opacity: 1,
            y: 0,
            duration: mobile ? 0.55 : 0.7,
            delay: mobile ? 0.45 : 0.65,
            ease: MOTION_PRESETS.easeEditorial,
          }
        );
      }

      // Hero Scroll Parallax (Rule 9 & 13: depth between text and background image)
      if (!mobile && imageContainerRef.current && contentWrapperRef.current) {
        gsap.to(imageContainerRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(contentWrapperRef.current, {
          yPercent: -8,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const slide = HERO_SLIDES[currentIdx];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[90vh] min-h-[660px] max-h-[980px] overflow-hidden bg-[#0A0A0D]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="ADD Parkour Oran Campaign"
    >
      {/* Background Slides with High-Res Photography & Breathing Scale */}
      <div ref={imageContainerRef} className="absolute inset-0 w-full h-full will-change-transform">
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
                className={`object-cover object-center select-none transition-transform duration-1000 ease-out ${
                  idx === currentIdx ? "scale-100" : "scale-105"
                }`}
                sizes="100vw"
              />
            </div>
            {/* Subtle gradient vignette to keep typography razor-sharp while preserving the photography */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D]/90 via-[#0A0A0D]/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-transparent to-[#0A0A0D]/40 z-10" />
          </div>
        ))}
      </div>

      {/* Main Content Overlay: Clean, Spacious, Typography-Driven */}
      <div
        ref={contentWrapperRef}
        className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-28 pb-10 will-change-transform"
      >
        {/* Subtle Natural City Reference without clutter */}
        <div ref={badgeRef} dir="ltr" className="flex items-center gap-3 [direction:ltr]">
          <span 
            className="inline-block w-2.5 h-2.5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: slide.accentColor }} 
          />
          <span className="font-mono text-xs uppercase tracking-widest text-[#9E9EA8] [direction:ltr]">
            ART DU DÉPLACEMENT // ORAN
          </span>
        </div>

        {/* Center: Oversized English Campaign Statement with Kinetic Typography */}
        <div dir="ltr" className="max-w-4xl my-auto py-6 [direction:ltr] text-left">
          <HeroKineticTitle
            statement={slide.statement}
            accentColor={slide.accentColor}
            slideIndex={currentIdx}
          />

          {/* Clean Action CTA Buttons - Localized Functional Content */}
          <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-xl uppercase tracking-wider shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {t.home.heroCta}
              </span>
              <ArrowUpRight className={`w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 ${isRtl ? "rtl-flip" : ""}`} />
            </Link>

            <a
              href="#disciplines"
              className="inline-flex items-center gap-2 px-6 py-4 rounded font-display text-sm font-bold uppercase tracking-wider text-[#F5F5F2] hover:text-[#FFD21F] transition-all group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {t.home.heroSecondary}
              </span>
              <span className="text-[#FFD21F] group-hover:translate-y-0.5 transition-transform duration-200">↓</span>
            </a>
          </div>
        </div>

        {/* Bottom Campaign Navigation: Clean, Minimal, Non-Boxy */}
        <div dir="ltr" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 [direction:ltr]">
          <div className="flex items-center gap-6 [direction:ltr]">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Poster ${idx + 1}: ${s.statement}`}
                className={`group flex items-center gap-2 py-1 transition-all duration-300 text-left [direction:ltr] ${
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
              className="w-10 h-10 rounded flex items-center justify-center bg-[#0A0A0D]/70 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-all font-mono text-sm active:scale-95"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-10 h-10 rounded flex items-center justify-center bg-[#0A0A0D]/70 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-all font-mono text-sm active:scale-95"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
