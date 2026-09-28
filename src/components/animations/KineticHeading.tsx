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

interface KineticHeadingProps {
  /** First line of the heading (e.g. "MOVE", "DEFY", "LAST") */
  line1: string;
  /** Second line of the heading (e.g. "DIFFERENT.", "GRAVITY.", "SEASON.") */
  line2: string;
  /** Accent color for line 2 (e.g. #E52421, #FFD21F) */
  accentColor?: string;
  /** Optional custom CSS classes for the container */
  className?: string;
  /** Custom heading tag (defaults to h2) */
  as?: "h1" | "h2" | "h3";
  /** Movement personality: 'lateral' (Parkour), 'vertical' (Escalade), 'horizontal' (Trail), 'editorial' */
  personality?: "lateral" | "vertical" | "horizontal" | "editorial";
  /** Whether to add a subtle scrubbed parallax as the user scrolls through the section */
  scrub?: boolean;
  /** Delay before reveal starts */
  delay?: number;
}

export function KineticHeading({
  line1,
  line2,
  accentColor = "#E52421",
  className = "",
  as: Tag = "h2",
  personality = "editorial",
  scrub = false,
  delay = 0,
}: KineticHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  // Check if text is Arabic to prevent breaking character ligatures
  const isArabic = containsArabic(line1) || containsArabic(line2);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !line1Ref.current || !line2Ref.current) return;

    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      if (reduced || mobile) {
        gsap.set([line1Ref.current, line2Ref.current], { opacity: 1, y: 0, x: 0, rotation: 0 });
        return;
      }

      // Personality directional offsets
      let line1From = { y: 70, x: 0, rotate: 0 };
      let line2From = { y: 80, x: 0, rotate: 0 };

      if (personality === "lateral") {
        // Parkour: energetic diagonal / lateral cut
        line1From = { y: mobile ? 30 : 50, x: mobile ? -20 : -45, rotate: mobile ? 0 : -1.5 };
        line2From = { y: mobile ? 40 : 60, x: mobile ? 20 : 35, rotate: mobile ? 0 : 1 };
      } else if (personality === "vertical") {
        // Escalade: sheer upward verticality
        line1From = { y: mobile ? 50 : 90, x: 0, rotate: 0 };
        line2From = { y: mobile ? 70 : 110, x: 0, rotate: 0 };
      } else if (personality === "horizontal") {
        // Trail: expansive lateral velocity
        line1From = { y: mobile ? 20 : 35, x: mobile ? -35 : -70, rotate: 0 };
        line2From = { y: mobile ? 30 : 45, x: mobile ? -20 : -40, rotate: 0 };
      }

      // Master Entrance Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        delay,
      });

      // Reveal Line 1
      tl.fromTo(
        line1Ref.current,
        {
          opacity: 0,
          y: line1From.y,
          x: line1From.x,
          rotation: line1From.rotate,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          duration: mobile ? 0.7 : 0.85,
          ease: MOTION_PRESETS.easeEditorial,
        },
        0
      );

      // Reveal Line 2 with slight offset & deliberate layer timing
      tl.fromTo(
        line2Ref.current,
        {
          opacity: 0,
          y: line2From.y,
          x: line2From.x,
          rotation: line2From.rotate,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          duration: mobile ? 0.75 : 0.9,
          ease: MOTION_PRESETS.easeEditorial,
        },
        0.14
      );

      // Optional subtle scrubbed motion (Rule 9 & 10: keep ranges small and physical!)
      if (scrub && !mobile) {
        let scrubShiftX = 0;
        let scrubShiftY = 0;

        if (personality === "lateral") {
          scrubShiftX = 18;
          scrubShiftY = -10;
        } else if (personality === "vertical") {
          scrubShiftY = -22;
        } else if (personality === "horizontal") {
          scrubShiftX = 25;
        } else {
          scrubShiftX = 15;
        }

        gsap.to(line2Ref.current, {
          x: scrubShiftX,
          y: scrubShiftY,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [line1, line2, personality, scrub, delay, isArabic]);

  return (
    <div ref={containerRef} className="inline-block max-w-full">
      <Tag className={`font-display font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.85] select-none ${className}`}>
        {/* Line 1 with clip container */}
        <span className="block overflow-hidden pb-1">
          <span ref={line1Ref} className="inline-block will-change-transform">
            {line1}
          </span>
        </span>

        {/* Line 2 with clip container and accent styling */}
        <span className="block overflow-hidden pt-1">
          <span
            ref={line2Ref}
            className="inline-block will-change-transform"
            style={{ color: accentColor }}
          >
            {line2}
          </span>
        </span>
      </Tag>
    </div>
  );
}
