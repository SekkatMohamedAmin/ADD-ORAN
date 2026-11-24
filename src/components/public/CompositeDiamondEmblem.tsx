"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface DisciplineSector {
  id: string;
  name: string;
  number: string;
  targetId: string;
  imageSrc: string;
  path: string;
  iconX: number;
  iconY: number;
  angle: number;
  side: "top" | "right" | "bottom-right" | "bottom-left" | "left";
}

// 5 Perfect Kite Sectors with Single-Word Titles
const SECTORS: DisciplineSector[] = [
  {
    id: "slackline",
    name: "SLACKLINE",
    number: "03",
    targetId: "discipline-branch-03",
    imageSrc: "/images/disciplines/generated/discipline_slacklining.png",
    path: "M 250,250 L 147.1,108.4 L 250.0,20.0 L 352.9,108.4 Z",
    iconX: 250.0,
    iconY: 118.0,
    angle: 0,
    side: "top",
  },
  {
    id: "parkour",
    name: "PARKOUR",
    number: "01",
    targetId: "discipline-branch-01",
    imageSrc: "/images/disciplines/generated/discipline_parkour.png",
    path: "M 250,250 L 352.9,108.4 L 468.7,178.9 L 416.4,304.1 Z",
    iconX: 375.5,
    iconY: 209.2,
    angle: 72,
    side: "right",
  },
  {
    id: "trail",
    name: "TRAIL",
    number: "05",
    targetId: "discipline-branch-05",
    imageSrc: "/images/disciplines/generated/discipline_trail_running.png",
    path: "M 250,250 L 416.4,304.1 L 385.2,436.1 L 250.0,425.0 Z",
    iconX: 327.6,
    iconY: 356.8,
    angle: 144,
    side: "bottom-right",
  },
  {
    id: "trekking",
    name: "TREKKING",
    number: "04",
    targetId: "discipline-branch-04",
    imageSrc: "/images/disciplines/generated/discipline_trekking.png",
    path: "M 250,250 L 250.0,425.0 L 114.8,436.1 L 83.6,304.1 Z",
    iconX: 172.4,
    iconY: 356.8,
    angle: 216,
    side: "bottom-left",
  },
  {
    id: "climbing",
    name: "ESCALADE",
    number: "02",
    targetId: "discipline-branch-02",
    imageSrc: "/images/disciplines/generated/discipline_climbing.png",
    path: "M 250,250 L 83.6,304.1 L 31.3,178.9 L 147.1,108.4 Z",
    iconX: 124.5,
    iconY: 209.2,
    angle: 288,
    side: "left",
  },
];

// Single-word trilingual label dictionary
const SECTOR_LABELS: Record<string, { fr: string; en: string; ar: string }> = {
  slackline: { fr: "SLACKLINE", en: "SLACKLINE", ar: "سلاكلاين" },
  parkour: { fr: "PARKOUR", en: "PARKOUR", ar: "باركور" },
  trail: { fr: "TRAIL", en: "TRAIL", ar: "تريل" },
  trekking: { fr: "TREKKING", en: "TREKKING", ar: "تجوال" },
  climbing: { fr: "ESCALADE", en: "CLIMBING", ar: "تسلق" },
};

export function CompositeDiamondEmblem() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isManualHover, setIsManualHover] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-iterate active discipline (especially for mobile devices and dynamic feel)
  useEffect(() => {
    if (isManualHover) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SECTORS.length);
    }, 2500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isManualHover]);

  const scrollToBranch = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeSector = SECTORS[activeIndex];
  const activeLabel =
    SECTOR_LABELS[activeSector?.id]?.[locale] || activeSector?.name;

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Outer Glow Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full bg-[#E52421]/15 blur-[120px] pointer-events-none" />

      {/* Main 5-Sector Kite Emblem Container */}
      <div
        className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center"
        onMouseEnter={() => setIsManualHover(true)}
        onMouseLeave={() => setIsManualHover(false)}
      >
        {/* SVG Canvas for the 5 Kite Facets */}
        <svg
          viewBox="0 0 500 500"
          className="absolute inset-0 w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <filter id="facetGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="activeFacetGrad" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF1F0" />
            </radialGradient>
          </defs>

          {/* 1. Base Ambient Facet Outer Border Ring */}
          <polygon
            points="250,14 476,174 390,442 110,442 24,174"
            fill="none"
            stroke="#E52421"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* 2. The 5 Kite Facets (Slices of the Emblem) */}
          {SECTORS.map((sector, index) => {
            const isActive = activeIndex === index;

            return (
              <g key={sector.id} className="transition-all duration-300">
                <path
                  d={sector.path}
                  fill={isActive ? "url(#activeFacetGrad)" : "#FFFFFF"}
                  stroke={isActive ? "#E52421" : "#E52421"}
                  strokeWidth={isActive ? 3 : 1.5}
                  strokeOpacity={isActive ? 1 : 0.4}
                  className="cursor-pointer transition-all duration-300 hover:fill-[#FFF1F0]"
                  onClick={() => {
                    setActiveIndex(index);
                    scrollToBranch(sector.targetId);
                  }}
                  onMouseEnter={() => {
                    setActiveIndex(index);
                    setIsManualHover(true);
                  }}
                />

                {isActive && (
                  <path
                    d={sector.path}
                    fill="none"
                    stroke="#E52421"
                    strokeWidth="4"
                    filter="url(#facetGlow)"
                    className="pointer-events-none opacity-80"
                  />
                )}
              </g>
            );
          })}

          {/* 3. Internal Separation Lines radiating from center to vertices */}
          <line x1="250" y1="250" x2="250.0" y2="20.0"  stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="468.7" y2="178.9" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="385.2" y2="436.1" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="114.8" y2="436.1" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="31.3"  y2="178.9" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />

          {/* Kite Inner Dividing Spokes */}
          <line x1="250" y1="250" x2="352.9" y2="108.4" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="416.4" y2="304.1" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="250.0" y2="425.0" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="83.6"  y2="304.1" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="250" y1="250" x2="147.1" y2="108.4" stroke="#E52421" strokeOpacity="0.45" strokeWidth="1.5" />

          {/* 4. Vertex Corner Nodes in Crimson Red */}
          <circle cx="250.0" cy="20.0"  r="4" fill="#E52421" className="shadow-[0_0_8px_#E52421]" />
          <circle cx="468.7" cy="178.9" r="4" fill="#E52421" className="shadow-[0_0_8px_#E52421]" />
          <circle cx="385.2" cy="436.1" r="4" fill="#E52421" className="shadow-[0_0_8px_#E52421]" />
          <circle cx="114.8" cy="436.1" r="4" fill="#E52421" className="shadow-[0_0_8px_#E52421]" />
          <circle cx="31.3"  cy="178.9" r="4" fill="#E52421" className="shadow-[0_0_8px_#E52421]" />
        </svg>

        {/* 5. The 5 Vector Silhouettes Placed Within Their Respective Kite Facets */}
        {SECTORS.map((sector, index) => {
          const isActive = activeIndex === index;
          const leftPct = (sector.iconX / 500) * 100;
          const topPct = (sector.iconY / 500) * 100;
          const sectorName = SECTOR_LABELS[sector.id]?.[locale] || sector.name;

          return (
            <button
              key={`icon-${sector.id}`}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                scrollToBranch(sector.targetId);
              }}
              onMouseEnter={() => {
                setActiveIndex(index);
                setIsManualHover(true);
              }}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              aria-label={sectorName}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none ${
                isActive
                  ? "scale-125 z-40 drop-shadow-[0_0_12px_rgba(229,36,33,0.85)]"
                  : "opacity-85 hover:opacity-100 hover:scale-110"
              }`}
            >
              <div className="relative w-full h-full p-1 pointer-events-none">
                <Image
                  src={sector.imageSrc}
                  alt={sectorName}
                  fill
                  className="object-contain filter drop-shadow transition-transform duration-300"
                />
              </div>
            </button>
          );
        })}

        {/* 6. Center Red Heraldic Crest (ADD Oran Leaping Athlete & Oran Lions) */}
        <div
          onClick={() => scrollToBranch("discipline-branch-01")}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-24 h-24 sm:w-28 sm:h-28 cursor-pointer transition-all duration-300 hover:scale-110 drop-shadow-[0_0_20px_rgba(229,36,33,0.6)]"
          title="ADD Oran Blason"
        >
          <div className="relative w-full h-full p-1.5 flex items-center justify-center">
            <Image
              src="/images/disciplines/generated/discipline_center_crest.png"
              alt="ADD Oran Blason Fondateur"
              fill
              priority
              className="object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* ========================================================
            7. FANCY ANIMATED SIDE LABELS (JUST ONE WORD - TRILINGUAL)
           ======================================================== */}
        {activeSector && (
          <div
            key={`side-label-${activeSector.id}`}
            className={`absolute z-40 pointer-events-none transition-all duration-500 ${
              activeSector.side === "top"
                ? "-top-8 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-3"
                : activeSector.side === "right"
                ? "top-1/4 -right-8 sm:-right-20 animate-in fade-in slide-in-from-right-4"
                : activeSector.side === "bottom-right"
                ? "bottom-2 -right-6 sm:-right-16 animate-in fade-in slide-in-from-right-3"
                : activeSector.side === "bottom-left"
                ? "bottom-2 -left-6 sm:-left-16 animate-in fade-in slide-in-from-left-3"
                : "-left-8 sm:-left-20 top-1/4 animate-in fade-in slide-in-from-left-4"
            }`}
          >
            <div className="px-3.5 py-1.5 rounded-xl bg-[#0A0A0E]/95 border-2 border-[#E52421] shadow-[0_0_20px_rgba(229,36,33,0.55)] flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#E52421] animate-ping" />
              <span
                className={`text-xs sm:text-sm text-white uppercase tracking-wider leading-none ${
                  isArabic ? "font-arabic font-bold" : "font-display font-black"
                }`}
              >
                {activeLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
