"use client";

/**
 * RevealText — Clip-mask text reveal with vertical displacement.
 * 
 * Wraps children in an overflow-hidden container and animates
 * them upward through a clipping mask on scroll entry.
 * 
 * For headings, campaign slogans, and editorial typography.
 */
import React, { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  isMobile,
  useIsomorphicLayoutEffect,
  MOTION_PRESETS,
} from "@/lib/animations/gsap-init";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before this element starts animating */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Y displacement in pixels (reduced on mobile) */
  yOffset?: number;
  /** Trigger animation from scroll (true) or immediately on mount (false) */
  scroll?: boolean;
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Whether animation only plays once */
  once?: boolean;
}

export function RevealText({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  yOffset = 60,
  scroll = true,
  triggerStart = "top 85%",
  once = true,
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const reduced = prefersReducedMotion();
    const mobile = isMobile();
    const actualY = reduced ? 0 : mobile ? yOffset * 0.5 : yOffset;
    const actualDuration = reduced ? 0.01 : duration;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        innerRef.current,
        {
          y: actualY,
          opacity: reduced ? 1 : 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: actualDuration,
          delay,
          ease: MOTION_PRESETS.easeEditorial,
          ...(scroll
            ? {
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: triggerStart,
                  toggleActions: once
                    ? "play none none none"
                    : "play none none reverse",
                },
              }
            : {}),
        }
      );

      return () => {
        tween.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, yOffset, scroll, triggerStart, once]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
