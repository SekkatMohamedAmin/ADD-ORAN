"use client";

import React, { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  isMobile,
  useIsomorphicLayoutEffect,
  MOTION_PRESETS,
} from "@/lib/animations/gsap-init";

interface RevealImageProps {
  children: React.ReactNode;
  className?: string;
  /** Movement personality for subtle parallax scrub: 'vertical' | 'lateral' | 'horizontal' | 'none' */
  parallaxDirection?: "vertical" | "lateral" | "horizontal" | "none";
  /** Parallax shift distance in pixels (defaults to 24px) */
  parallaxDistance?: number;
  /** Delay in seconds before reveal starts */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
}

export function RevealImage({
  children,
  className = "",
  parallaxDirection = "vertical",
  parallaxDistance = 24,
  delay = 0,
  duration = 0.9,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(wrapperRef.current, { scale: 1, opacity: 1, x: 0, y: 0 });
        return;
      }

      // 1. Cinematic scale-in reveal on scroll entry (scale 1.04-1.08 -> 1, opacity 0 -> 1)
      gsap.fromTo(
        wrapperRef.current,
        {
          scale: mobile ? 1.04 : 1.08,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration,
          delay,
          ease: MOTION_PRESETS.easeSmooth,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Subtle physical scrubbed parallax (Rule 9 & 13)
      if (parallaxDirection !== "none" && !mobile) {
        let xTo = 0;
        let yTo = 0;
        const dist = parallaxDistance;

        if (parallaxDirection === "vertical") {
          yTo = -dist;
        } else if (parallaxDirection === "lateral") {
          xTo = dist * 0.7;
          yTo = -dist * 0.7;
        } else if (parallaxDirection === "horizontal") {
          xTo = -dist;
        }

        gsap.fromTo(
          wrapperRef.current,
          {
            x: -xTo * 0.5,
            y: -yTo * 0.5,
          },
          {
            x: xTo * 0.5,
            y: yTo * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [parallaxDirection, parallaxDistance, delay, duration]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative will-change-transform ${className}`}
    >
      <div ref={wrapperRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
