"use client";

/**
 * GSAP + ScrollTrigger — One-time registration
 * 
 * Import from this module instead of importing gsap directly.
 * This ensures ScrollTrigger is registered exactly once.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Expose globally for debugging in dev
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as Record<string, unknown>).gsap = gsap;
  (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger };

/**
 * Check if user prefers reduced motion.
 * Use this to skip heavy animations.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns true if viewport is mobile or device is a mobile/tablet (iOS/Android).
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

/**
 * Check if a text contains Arabic Unicode characters.
 * Arabic requires connected ligatures and must NOT be split into isolated characters.
 */
export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * React 19 SSR-safe isomorphic layout effect.
 * Runs useLayoutEffect on the client and useEffect during SSR to prevent hydration warnings.
 */
import { useEffect, useLayoutEffect } from "react";
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Curated editorial motion presets matching HyperFrames/Kinetic sports style.
 */
export const MOTION_PRESETS = {
  easeEditorial: "power3.out",
  easeSharp: "power4.out",
  easeCinematic: "expo.out",
  easeSmooth: "power2.out",
  easeInEditorial: "power3.in",
  durationMicro: 0.25,
  durationUI: 0.55,
  durationTypography: 0.85,
  durationImage: 1.05,
};
