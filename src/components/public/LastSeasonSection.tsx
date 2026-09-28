"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { SEASON_2025_2026 } from "@/lib/images";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LazyImage } from "@/components/ui/LazyImage";
import { KineticHeading } from "@/components/animations/KineticHeading";
import { RevealImage } from "@/components/animations/RevealImage";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import {
  gsap,
  prefersReducedMotion,
  isMobile,
  useIsomorphicLayoutEffect,
  MOTION_PRESETS,
} from "@/lib/animations/gsap-init";

export function LastSeasonSection() {
  const { t, isRtl } = useLanguage();
  const [albumOpen, setAlbumOpen] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  const season = SEASON_2025_2026;
  const gallery = season.gallery;

  const sectionRef = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const photoCol1Ref = useRef<HTMLDivElement>(null);
  const photoCol2Ref = useRef<HTMLDivElement>(null);
  const photoCol3Ref = useRef<HTMLDivElement>(null);

  // Photo Collage Motion (Rules 15 & 16: tiny differences in movement for depth)
  useIsomorphicLayoutEffect(() => {
    if (!collageRef.current) return;

    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      if (reduced || mobile) {
        if (photoCol1Ref.current) gsap.set(photoCol1Ref.current, { opacity: 1, y: 0 });
        if (photoCol2Ref.current) gsap.set(photoCol2Ref.current, { opacity: 1, y: 0 });
        if (photoCol3Ref.current) gsap.set(photoCol3Ref.current, { opacity: 1, y: 0 });
        return;
      }

      const trigger = {
        trigger: collageRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      };

      if (photoCol1Ref.current) {
        gsap.fromTo(
          photoCol1Ref.current,
          { opacity: 0, y: mobile ? 25 : 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: 0.1,
            ease: MOTION_PRESETS.easeEditorial,
            scrollTrigger: trigger,
          }
        );
      }

      if (photoCol2Ref.current) {
        gsap.fromTo(
          photoCol2Ref.current,
          { opacity: 0, y: mobile ? 30 : 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            delay: 0.18,
            ease: MOTION_PRESETS.easeEditorial,
            scrollTrigger: trigger,
          }
        );
      }

      if (photoCol3Ref.current) {
        gsap.fromTo(
          photoCol3Ref.current,
          { opacity: 0, y: mobile ? 15 : 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.28,
            ease: MOTION_PRESETS.easeEditorial,
            scrollTrigger: trigger,
          }
        );
      }
    }, collageRef);

    return () => ctx.revert();
  }, []);

  const openLightbox = (idx: number) => {
    setSelectedPhotoIdx(idx);
  };

  const closeLightbox = () => {
    setSelectedPhotoIdx(null);
  };

  const nextPhoto = useCallback(() => {
    if (selectedPhotoIdx === null) return;
    setSelectedPhotoIdx((prev) => ((prev ?? 0) + 1) % gallery.length);
  }, [selectedPhotoIdx, gallery.length]);

  const prevPhoto = useCallback(() => {
    if (selectedPhotoIdx === null) return;
    setSelectedPhotoIdx((prev) => ((prev ?? 0) - 1 + gallery.length) % gallery.length);
  }, [selectedPhotoIdx, gallery.length]);

  // Keyboard navigation for modal / lightbox
  useEffect(() => {
    if (!albumOpen && selectedPhotoIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPhotoIdx !== null) {
          closeLightbox();
        } else {
          setAlbumOpen(false);
        }
      } else if (e.key === "ArrowLeft") {
        if (selectedPhotoIdx !== null) {
          if (isRtl) {
            nextPhoto();
          } else {
            prevPhoto();
          }
        }
      } else if (e.key === "ArrowRight") {
        if (selectedPhotoIdx !== null) {
          if (isRtl) {
            prevPhoto();
          } else {
            nextPhoto();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [albumOpen, selectedPhotoIdx, nextPhoto, prevPhoto, isRtl]);

  return (
    <section
      ref={sectionRef}
      id="last-season"
      className="relative py-28 sm:py-36 bg-[#0A0A0D] border-b border-white/10 overflow-hidden"
    >
      {/* Subtle background red accent glow */}
      <div 
        className="absolute top-1/4 -right-48 w-96 h-96 rounded-full bg-[#E52421]/5 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block: Title + Year + Action CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#FFD21F] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E52421]" />
              <span>{season.year}</span>
            </div>

            {/* Giant Kinetic Typography Header (Rule 15: LAST and SEASON. reveal separately) */}
            <KineticHeading
              line1="LAST"
              line2="SEASON."
              accentColor="#E52421"
              personality="editorial"
              scrub={true}
              className="text-6xl sm:text-8xl lg:text-9xl mb-2"
            />

            <ScrollReveal variant="fade-up" delay={100}>
              <p className="font-body text-base text-[#9E9EA8] mt-6 max-w-lg leading-relaxed">
                {t.home.lastSeasonSubtitle}
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fade-up" delay={150}>
            <button
              type="button"
              onClick={() => setAlbumOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-white/5 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 hover:border-transparent font-display font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-95 group"
            >
              <Camera className="w-4 h-4 text-[#FFD21F] group-hover:text-[#F5F5F2] transition-colors" />
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {t.home.viewAlbum}
              </span>
              <ArrowUpRight className={`w-4 h-4 text-[#FFD21F] group-hover:text-[#F5F5F2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ${isRtl ? "rtl-flip" : ""}`} />
            </button>
          </ScrollReveal>
        </div>

        {/* ========================================================
            EDITORIAL COMPOSITION: ASYMMETRIC SPORTS MAGAZINE LAYOUT
           ======================================================== */}
        <div className="space-y-8 sm:space-y-12">
          {/* 1. Large Hero Landscape Banner: Full Team & Medalists */}
          <RevealImage parallaxDirection="vertical" parallaxDistance={20}>
            <div 
              onClick={() => openLightbox(0)}
              className="group relative w-full h-[360px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10"
            >
              <LazyImage
                src={season.heroFeatured.src}
                alt={season.heroFeatured.alt}
                fill
                priority={false}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/90 via-[#0A0A0D]/20 to-transparent pointer-events-none" />

              {/* Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD21F] bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded inline-block mb-2">
                    {season.year} — ÉQUIPE & ACADÉMIE
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-3xl uppercase text-[#F5F5F2] tracking-wide leading-tight">
                    {season.heroFeatured.caption}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#F5F5F2] bg-white/10 group-hover:bg-[#E52421] px-4 py-2 rounded-full backdrop-blur-md transition-colors self-start sm:self-auto">
                  <span>Agrandir</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </RevealImage>

          {/* 2. Editorial Collage: 3-Column Asymmetric Moments (Rule 16: Motion depth) */}
          <div ref={collageRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Column: Portrait Vault Action */}
            <div ref={photoCol1Ref} className="md:col-span-5 will-change-transform">
              <div 
                onClick={() => openLightbox(3)} // ls-589: yellow shirt vault
                className="group relative w-full h-[460px] sm:h-[540px] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/10"
              >
                <LazyImage
                  src={season.highlights[1].src}
                  alt={season.highlights[1].alt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#E52421] bg-black/60 px-2 py-0.5 rounded inline-block mb-1">
                    PARKOUR ACADEMY
                  </span>
                  <p className="font-display font-bold text-sm uppercase text-[#F5F5F2]">
                    {season.highlights[1].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Stacked Moments (Landscape Coaches Selfie + Portrait Beam Vault) */}
            <div className="md:col-span-7 space-y-6 sm:space-y-8">
              {/* Top: Coaches Selfie & Medal (Landscape) */}
              <div ref={photoCol2Ref} className="will-change-transform">
                <div 
                  onClick={() => openLightbox(1)} // ls-613
                  className="group relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/10"
                >
                  <LazyImage
                    src={season.highlights[0].src}
                    alt={season.highlights[0].alt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD21F] bg-black/60 px-2 py-0.5 rounded inline-block mb-1">
                      COACHING & TRANSMISSION
                    </span>
                    <p className="font-display font-bold text-sm sm:text-base uppercase text-[#F5F5F2]">
                      {season.highlights[0].caption}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Split technical shots */}
              <div ref={photoCol3Ref} className="grid grid-cols-2 gap-4 sm:gap-6 will-change-transform">
                {/* Cat Pass Technique */}
                <div 
                  onClick={() => openLightbox(13)} // ls-599: Cat pass
                  className="group relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/10"
                >
                  <LazyImage
                    src={season.highlights[3].src}
                    alt={season.highlights[3].alt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-display font-bold text-xs uppercase text-[#F5F5F2] line-clamp-1">
                      Saut de Chat
                    </p>
                  </div>
                </div>

                {/* Head Coach Guidance */}
                <div 
                  onClick={() => openLightbox(23)} // ls-609: Coach & family
                  className="group relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/10"
                >
                  <LazyImage
                    src={season.highlights[5].src}
                    alt={season.highlights[5].alt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-display font-bold text-xs uppercase text-[#F5F5F2] line-clamp-1">
                      Encadrement & Familles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL ALBUM MODAL: 27 AUTHENTIC CLUB PHOTOS
         ======================================================== */}
      {albumOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0A0A0D]/95 backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={t.home.albumModalTitle}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E52421]" />
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl uppercase text-[#F5F5F2]">
                  {t.home.albumModalTitle}
                </h3>
                <span className="font-mono text-xs text-[#9E9EA8]">
                  {gallery.length} photographies authentiques // Club Art Du Déplacement Parkour Oran
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAlbumOpen(false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-colors"
              aria-label={t.home.closeAlbum}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Gallery Grid (Asymmetric Editorial Flow) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {gallery.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(idx)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/10 transition-all hover:border-[#E52421] ${
                    photo.orientation === "landscape" 
                      ? "col-span-2 aspect-[4/3]" 
                      : "col-span-1 aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="font-display font-bold text-xs uppercase text-[#F5F5F2] line-clamp-2">
                      {photo.caption}
                    </p>
                    <span className="font-mono text-[10px] text-[#FFD21F] mt-1">
                      Photo {idx + 1} / {gallery.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          LIGHTBOX VIEWER FOR HIGH DEFINITION INSPECTION
         ======================================================== */}
      {selectedPhotoIdx !== null && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar: Counter & Close */}
          <div className="flex items-center justify-between text-[#F5F5F2] z-20">
            <div className="font-mono text-sm tracking-wider text-[#9E9EA8]">
              <span className="text-[#FFD21F] font-bold">{selectedPhotoIdx + 1}</span> / {gallery.length}
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#E52421] text-[#F5F5F2] transition-colors"
              aria-label="Fermer la vue plein écran"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image with Navigation */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Left Nav */}
            <button
              type="button"
              onClick={isRtl ? nextPhoto : prevPhoto}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-colors"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[78vh] flex items-center justify-center">
              <Image
                src={gallery[selectedPhotoIdx].src}
                alt={gallery[selectedPhotoIdx].alt}
                fill
                priority
                className="object-contain select-none"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>

            {/* Right Nav */}
            <button
              type="button"
              onClick={isRtl ? prevPhoto : nextPhoto}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#E52421] text-[#F5F5F2] border border-white/10 transition-colors"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Caption */}
          <div className="text-center max-w-2xl mx-auto z-20">
            <p className="font-display font-bold text-sm sm:text-base uppercase text-[#F5F5F2] tracking-wide">
              {gallery[selectedPhotoIdx].caption}
            </p>
            <p className="font-mono text-xs text-[#9E9EA8] mt-1">
              Club Art Du Déplacement Parkour Oran // Saison {season.year}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
