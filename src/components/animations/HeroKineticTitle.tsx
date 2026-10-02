"use client";

import React, { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  isMobile,
  containsArabic,
  useIsomorphicLayoutEffect,
  MOTION_PRESETS,
} from "@/lib/animations/gsap-init";

interface HeroKineticTitleProps {
  /** Full statement string, e.g. "DEFY GRAVITY." */
  statement: string;
  /** Accent color for the second word/part */
  accentColor: string;
  /** Slide index to trigger transition when user changes slides */
  slideIndex: number;
}

export function HeroKineticTitle({
  statement,
  accentColor,
  slideIndex,
}: HeroKineticTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  // Split into line 1 and line 2 (e.g. "DEFY" and "GRAVITY.")
  const words = statement.trim().split(" ");
  const line1Text = words[0] || "";
  const line2Text = words.slice(1).join(" ") || "";

  const isArabic = containsArabic(statement);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      const line1Chars = containerRef.current?.querySelectorAll(".hero-char-l1");
      const line2Chars = containerRef.current?.querySelectorAll(".hero-char-l2");

      if (reduced) {
        if (line1Chars) gsap.set(line1Chars, { y: 0, opacity: 1, x: 0 });
        if (line2Chars) gsap.set(line2Chars, { y: 0, opacity: 1, x: 0 });
        return;
      }

      // Choreographed Master Timeline
      const tl = gsap.timeline({
        defaults: { ease: MOTION_PRESETS.easeEditorial },
      });

      // Phase 2: DEFY reveals vertically through clipping masks with subtle character stagger
      if (line1Chars && line1Chars.length > 0) {
        tl.fromTo(
          line1Chars,
          {
            y: mobile ? 45 : 75,
            opacity: 0,
            x: (i) => (mobile ? 0 : (i - line1Chars.length / 2) * -3), // subtle convergence
          },
          {
            y: 0,
            opacity: 1,
            x: 0,
            duration: mobile ? 0.6 : 0.75,
            stagger: mobile ? 0.02 : 0.035,
          },
          0.15
        );
      }

      // Phase 3: GRAVITY. reveals from vertical offset with crisp stagger
      if (line2Chars && line2Chars.length > 0) {
        tl.fromTo(
          line2Chars,
          {
            y: mobile ? 55 : 90,
            opacity: 0,
            x: (i) => (mobile ? 0 : (i - line2Chars.length / 2) * 2),
          },
          {
            y: 0,
            opacity: 1,
            x: 0,
            duration: mobile ? 0.65 : 0.8,
            stagger: mobile ? 0.02 : 0.03,
          },
          0.32
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [statement, slideIndex, isArabic]);

  // If text is Arabic, reveal by words instead of splitting individual letters to preserve ligatures
  if (isArabic) {
    return (
      <h1
        ref={containerRef}
        className="font-display text-7xl sm:text-8xl lg:text-[10rem] font-black uppercase tracking-tight text-[#F5F5F2] leading-[0.85] drop-shadow-lg mb-6 select-none"
      >
        <span className="block overflow-hidden pb-1">
          <span className="hero-char-l1 inline-block will-change-transform">{line1Text}</span>
        </span>
        <span className="block overflow-hidden pt-1">
          <span
            className="hero-char-l2 inline-block will-change-transform"
            style={{ color: accentColor }}
          >
            {line2Text}
          </span>
        </span>
      </h1>
    );
  }

  return (
    <h1
      ref={containerRef}
      dir="ltr"
      className="font-display text-7xl sm:text-8xl lg:text-[10rem] font-black uppercase tracking-tight text-[#F5F5F2] leading-[0.85] drop-shadow-lg mb-6 select-none text-left [direction:ltr]"
    >
      {/* Line 1: Character Split Reveal */}
      <span className="block overflow-hidden pb-1 text-left [direction:ltr]">
        <span className="inline-flex text-left [direction:ltr]">
          {line1Text.split("").map((char, index) => (
            <span key={`l1-${index}`} className="inline-block overflow-hidden [direction:ltr]">
              <span className="hero-char-l1 inline-block will-change-transform [direction:ltr]">
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </span>
      </span>

      {/* Line 2: Character Split Reveal with Accent Color */}
      <span className="block overflow-hidden pt-1 text-left [direction:ltr]">
        <span className="inline-flex text-left [direction:ltr]" style={{ color: accentColor }}>
          {line2Text.split("").map((char, index) => (
            <span key={`l2-${index}`} className="inline-block overflow-hidden [direction:ltr]">
              <span className="hero-char-l2 inline-block will-change-transform [direction:ltr]">
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
