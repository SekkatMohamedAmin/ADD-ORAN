"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { SEASON_2025_2026 } from "@/lib/images";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  ArrowUpRight,
  X,
  Maximize2,
  Sparkles,
} from "lucide-react";

// ============================================================================
// Curated 7 Athletic Carousel Moments (from 2025/2026 authentic archives)
// ============================================================================

interface CarouselSlide {
  galleryIdx: number;
  tag: { fr: string; en: string; ar: string };
  title: { fr: string; en: string; ar: string };
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    galleryIdx: 0, // ls-614
    tag: { fr: "ÉQUIPE & ACADÉMIE", en: "TEAM & ACADEMY", ar: "الفريق والأكاديمية" },
    title: {
      fr: "Cérémonie des médailles — L'ensemble des athlètes et entraîneurs réunis",
      en: "Medal Ceremony — Athletes, coaches, and youth champions assembled",
      ar: "حفل توزيع الميداليات — تجمع الرياضيين والمدربين وأولياء الأمور",
    },
  },
  {
    galleryIdx: 1, // ls-613
    tag: { fr: "COACHING & TRANSMISSION", en: "COACHING & TRANSMISSION", ar: "التدريب ونقل الخبرة" },
    title: {
      fr: "Fierté collective — Éducateurs aux côtés d'un jeune champion médaillé d'or",
      en: "Collective Pride — Coaches alongside young gold medalist",
      ar: "فخر الإنجاز — المدربون رفقة بطل ناشئ متوج بالميدالية الذهبية",
    },
  },
  {
    galleryIdx: 3, // ls-589
    tag: { fr: "PARKOUR ACADEMY", en: "PARKOUR ACADEMY", ar: "أكاديمية الباركور" },
    title: {
      fr: "Franchissement dynamique — Vitesse et précision sur module incliné",
      en: "Dynamic Obstacle Vault — Speed and precision over inclined module",
      ar: "اجتياز ديناميكي — سرعة ودقة فوق الحاجز المائل",
    },
  },
  {
    galleryIdx: 9, // ls-595
    tag: { fr: "ENGAGEMENT ATHLÉTIQUE", en: "ATHLETIC AGILITY", ar: "خفة ومهارة رياضية" },
    title: {
      fr: "Saut en suspension — Engagement physique et envol au-dessus du vide",
      en: "Suspension Flight — Core commitment and aerial trajectory",
      ar: "قفزة معلقة في الهواء — لياقة بدنية عالية وانطلاق رشيق",
    },
  },
  {
    galleryIdx: 13, // ls-599
    tag: { fr: "TECHNIQUE D'OBSTACLE", en: "OBSTACLE TECHNIQUE", ar: "تقنيات اجتياز الموانع" },
    title: {
      fr: "Saut de chat — Fluidité et transfert d'énergie sur structure surélevée",
      en: "Cat Pass Vault — Energy transfer and smooth momentum across high beam",
      ar: "قفزة القط — انسيابية حركية وتحكم كامل فوق الهيكل المرتفع",
    },
  },
  {
    galleryIdx: 18, // ls-604
    tag: { fr: "RIGUEUR & JURY", en: "MASTERY & GRADING", ar: "التقييم والتحكيم الرياضي" },
    title: {
      fr: "Passage de grade — Validation des acquis moteurs et sécurité par les coachs",
      en: "Grade Examination — Motor skills and safety validation by master coaches",
      ar: "اختبار الترقية — تقييم المكتسبات الحركية ومعايير الأمان",
    },
  },
  {
    galleryIdx: 23, // ls-609
    tag: { fr: "PÉDAGOGIE & FAMILLES", en: "PEDAGOGY & COMMUNITY", ar: "البيداغوجيا وروح العائلة" },
    title: {
      fr: "Accompagnement personnalisé — Coach principal guidant un jeune élève",
      en: "Individual Guidance — Head coach guiding youth under family support",
      ar: "تأطير فردي — المدرب الرئيسي يوجه المتدرب الناشئ بتشجيع العائلات",
    },
  },
];

const UI_STRINGS = {
  fr: {
    yearBadge: "2025 / 2026",
    tag: "ARCHIVES ATHLÉTIQUES",
    titlePart1: "LAST ",
    titlePart2: "SEASON.",
    subtitle:
      "Revivez les moments forts, stages d'entraînement et sacres de nos jeunes athlètes lors de la saison écoulée.",
    viewAlbum: "Voir l'album complet (27 photos)",
    expand: "Agrandir",
    prev: "Photo précédente",
    next: "Photo suivante",
    photosCount: "photographies authentiques",
    closeModal: "Fermer",
  },
  en: {
    yearBadge: "2025 / 2026",
    tag: "ATHLETIC ARCHIVES",
    titlePart1: "LAST ",
    titlePart2: "SEASON.",
    subtitle:
      "Relive key athletic milestones, training sessions, and medal ceremonies across our past season.",
    viewAlbum: "View full album (27 photos)",
    expand: "Expand",
    prev: "Previous photo",
    next: "Next photo",
    photosCount: "authentic photographs",
    closeModal: "Close",
  },
  ar: {
    yearBadge: "2025 / 2026",
    tag: "الأرشيف الرياضي للموسم",
    titlePart1: "LAST ",
    titlePart2: "SEASON.",
    subtitle:
      "استرجع أقوى اللحظات، التربصات التدريبية وتتويجات أبطالنا الصاعدين خلال الموسم الرياضي المنصرم.",
    viewAlbum: "عرض الألبوم الكامل (27 صورة)",
    expand: "تكبير",
    prev: "الصورة السابقة",
    next: "الصورة التالية",
    photosCount: "صورة وثائقية أصلية",
    closeModal: "إغلاق",
  },
};

export function LastSeasonSection() {
  const { locale, isRtl } = useLanguage();
  const strings = UI_STRINGS[locale] || UI_STRINGS.fr;
  const isArabic = locale === "ar";

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  const season = SEASON_2025_2026;
  const gallery = season.gallery;
  const totalSlides = CAROUSEL_SLIDES.length;

  // Auto-advance carousel every 5.5 seconds (paused when user hovers)
  useEffect(() => {
    if (isPaused || albumOpen || selectedPhotoIdx !== null) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, albumOpen, selectedPhotoIdx, totalSlides]);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

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

  // Keyboard navigation for modal & lightbox
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
          if (isRtl) nextPhoto();
          else prevPhoto();
        }
      } else if (e.key === "ArrowRight") {
        if (selectedPhotoIdx !== null) {
          if (isRtl) prevPhoto();
          else nextPhoto();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [albumOpen, selectedPhotoIdx, nextPhoto, prevPhoto, isRtl]);

  const currentSlide = CAROUSEL_SLIDES[activeSlide];
  const currentPhoto = gallery[currentSlide.galleryIdx];

  return (
    <section
      id="last-season"
      className="relative py-20 sm:py-28 bg-[#000000] overflow-hidden select-none"
    >
      {/* Background Red Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[#E52421]/[0.08] blur-[150px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            1. HEADER BLOCK: Title + Year + View All CTA
           ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#E52421] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E52421] animate-ping" />
              <span>{strings.yearBadge}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/60">{strings.tag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-tight">
              {strings.titlePart1}
              <span className="text-[#E52421]">{strings.titlePart2}</span>
            </h2>

            <p
              className={`text-sm sm:text-base text-[#9E9EA8] mt-3 max-w-xl leading-relaxed ${
                isArabic ? "font-arabic" : "font-body"
              }`}
            >
              {strings.subtitle}
            </p>
          </div>

          <ScrollReveal variant="fade-up" delay={100}>
            <button
              type="button"
              onClick={() => setAlbumOpen(true)}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-[#E52421] text-white border border-white/10 hover:border-transparent font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 group"
            >
              <Camera className="w-4 h-4 text-[#E52421] group-hover:text-white transition-colors" />
              <span>{strings.viewAlbum}</span>
              <ArrowUpRight
                className={`w-4 h-4 text-[#E52421] group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  isRtl ? "rotate-[-90deg]" : ""
                }`}
              />
            </button>
          </ScrollReveal>
        </div>

        {/* ========================================================
            2. INTERACTIVE ATHLETIC CAROUSEL (Controlled Height ~460px)
           ======================================================== */}
        <div
          className="relative group rounded-3xl overflow-hidden border border-white/10 bg-[#07070A] shadow-[0_0_40px_rgba(229,36,33,0.12)] transition-all hover:border-[#E52421]/40"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slide Stage (Controlled Compact Height) */}
          <div
            onClick={() => openLightbox(currentSlide.galleryIdx)}
            className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] cursor-pointer overflow-hidden"
          >
            {/* The Active Image */}
            <Image
              key={`slide-img-${currentSlide.galleryIdx}`}
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays for Readability and Mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/70 via-transparent to-[#000000]/70 pointer-events-none" />

            {/* Top Right "Agrandir / Expand" Floating Pill */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-[#E52421] text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md border border-white/15 transition-all shadow-lg group-hover:border-transparent">
                <Maximize2 className="w-3.5 h-3.5 text-[#E52421] group-hover:text-white" />
                <span>{strings.expand}</span>
              </span>
            </div>

            {/* Bottom Slide Metadata Overlay */}
            <div
              className={`absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none`}
            >
              <div className="max-w-2xl space-y-2 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white bg-[#E52421] px-2.5 py-1 rounded-md font-bold shadow-md">
                    {currentSlide.tag[locale] || currentSlide.tag.fr}
                  </span>
                  <span className="font-mono text-[11px] text-white/70 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {String(activeSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className={`text-lg sm:text-2xl md:text-3xl text-white font-bold leading-snug drop-shadow-md ${
                    isArabic ? "font-arabic" : "font-display uppercase"
                  }`}
                >
                  {currentSlide.title[locale] || currentSlide.title.fr}
                </h3>
              </div>

              {/* Quick Slide Dots Indicator */}
              <div className="flex items-center gap-2 pointer-events-auto self-start md:self-end">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide(idx);
                    }}
                    aria-label={`Aller au moment ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      activeSlide === idx
                        ? "w-8 h-2.5 bg-[#E52421] shadow-[0_0_10px_#E52421]"
                        : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isRtl) nextSlide();
              else prevSlide();
            }}
            aria-label={strings.prev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-[#E52421] text-white border border-white/15 hover:border-transparent flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-xl hover:scale-110 active:scale-95 group/arrow"
          >
            <ChevronLeft
              className={`w-6 h-6 transition-transform group-hover/arrow:-translate-x-0.5 ${
                isRtl ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isRtl) prevSlide();
              else nextSlide();
            }}
            aria-label={strings.next}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-[#E52421] text-white border border-white/15 hover:border-transparent flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-xl hover:scale-110 active:scale-95 group/arrow"
          >
            <ChevronRight
              className={`w-6 h-6 transition-transform group-hover/arrow:translate-x-0.5 ${
                isRtl ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Thumbnail Preview Strip */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mt-4">
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const photo = gallery[slide.galleryIdx];
            const isActive = activeSlide === idx;

            return (
              <button
                key={`thumb-${idx}`}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`relative h-14 sm:h-20 rounded-xl overflow-hidden border transition-all duration-300 focus:outline-none ${
                  isActive
                    ? "border-[#E52421] ring-2 ring-[#E52421]/50 scale-[1.03] shadow-[0_0_15px_rgba(229,36,33,0.4)]"
                    : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
                <div
                  className={`absolute inset-0 transition-opacity ${
                    isActive ? "bg-transparent" : "bg-black/40"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. FULL ALBUM MODAL: 27 AUTHENTIC CLUB PHOTOS
         ======================================================== */}
      {albumOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#07070A]/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label={strings.viewAlbum}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#000000]/80">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E52421] animate-ping" />
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl uppercase text-white">
                  ADD ORAN • {season.year}
                </h3>
                <span className="font-mono text-xs text-[#9E9EA8]">
                  {gallery.length} {strings.photosCount} // Club Art Du Déplacement Parkour Oran
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAlbumOpen(false)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E52421] text-white border border-white/10 transition-colors"
              aria-label={strings.closeModal}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Gallery Grid */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {gallery.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/10 transition-all hover:border-[#E52421] hover:scale-[1.02] ${
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="font-display font-bold text-xs uppercase text-white line-clamp-2">
                      {photo.caption}
                    </p>
                    <span className="font-mono text-[10px] text-[#E52421] mt-1 font-semibold">
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
          4. LIGHTBOX VIEWER FOR HIGH DEFINITION INSPECTION
         ======================================================== */}
      {selectedPhotoIdx !== null && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar: Counter & Close */}
          <div className="flex items-center justify-between text-white z-20">
            <div className="font-mono text-sm tracking-wider text-[#9E9EA8]">
              <span className="text-[#E52421] font-bold">{selectedPhotoIdx + 1}</span> / {gallery.length}
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#E52421] text-white transition-colors"
              aria-label={strings.closeModal}
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
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#E52421] text-white border border-white/10 transition-colors"
              aria-label={strings.prev}
            >
              <ChevronLeft className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`} />
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
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#E52421] text-white border border-white/10 transition-colors"
              aria-label={strings.next}
            >
              <ChevronRight className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Bottom Bar: Caption */}
          <div className="text-center max-w-2xl mx-auto z-20">
            <p className="font-display font-bold text-sm sm:text-base uppercase text-white tracking-wide">
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
