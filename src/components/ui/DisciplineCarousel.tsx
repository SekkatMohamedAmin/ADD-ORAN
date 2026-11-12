"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DisciplineCarouselProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  accentColor?: string;
  disciplineName?: string;
  autoPlayInterval?: number;
}

export function DisciplineCarousel({
  images,
  accentColor = "#E52421",
  disciplineName = "Discipline",
  autoPlayInterval = 5000,
}: DisciplineCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const total = images.length;

  const next = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, total, isPaused, autoPlayInterval]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-full h-[380px] sm:h-[480px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group select-none bg-[#0E0E12]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartXRef.current = e.touches[0].clientX;
        setIsPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchStartXRef.current !== null) {
          const diff = touchStartXRef.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) next();
            else prev();
          }
        }
        touchStartXRef.current = null;
        setIsPaused(false);
      }}
    >
      {/* Slides */}
      {images.map((img, idx) => {
        const isActive = idx === currentIdx;
        return (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt || `${disciplineName} image ${idx + 1}`}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-transform duration-1000 ease-out ${
                isActive ? "scale-100" : "scale-105"
              }`}
            />
            {/* Vignette gradient for depth & contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/75 via-transparent to-[#0A0A0D]/20 pointer-events-none" />
          </div>
        );
      })}

      {/* Navigation Arrows (visible on hover or touch) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prev();
            }}
            aria-label="Photo précédente"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            aria-label="Photo suivante"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator & Slide Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Aller à la photo ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIdx
                    ? "w-6 h-2 shadow-sm"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                style={{
                  backgroundColor: idx === currentIdx ? accentColor : undefined,
                }}
              />
            ))}
            <span className="font-mono text-[10px] text-white/70 pl-1.5 font-bold">
              {currentIdx + 1}/{total}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

