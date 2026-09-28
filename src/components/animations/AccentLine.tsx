"use client";

import React, { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
  MOTION_PRESETS,
} from "@/lib/animations/gsap-init";

interface AccentLineProps {
  orientation?: "horizontal" | "vertical" | "diagonal";
  color?: string;
  className?: string;
  delay?: number;
}

export function AccentLine({
  orientation = "horizontal",
  color = "#E52421",
  className = "",
  delay = 0.2,
}: AccentLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!lineRef.current) return;

    if (prefersReducedMotion()) {
      gsap.set(lineRef.current, { scaleX: 1, scaleY: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (orientation === "horizontal") {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left center", opacity: 0 },
          {
            scaleX: 1,
            opacity: 0.8,
            duration: 1.1,
            delay,
            ease: MOTION_PRESETS.easeEditorial,
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      } else if (orientation === "vertical") {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "bottom center", opacity: 0 },
          {
            scaleY: 1,
            opacity: 0.8,
            duration: 1.1,
            delay,
            ease: MOTION_PRESETS.easeEditorial,
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      } else {
        // Diagonal trajectory line
        gsap.fromTo(
          lineRef.current,
          { strokeDashoffset: 400, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 0.7,
            duration: 1.3,
            delay,
            ease: MOTION_PRESETS.easeEditorial,
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, lineRef);

    return () => ctx.revert();
  }, [orientation, delay]);

  if (orientation === "diagonal") {
    return (
      <svg
        ref={lineRef as unknown as React.RefObject<SVGSVGElement>}
        className={`pointer-events-none absolute select-none ${className}`}
        viewBox="0 0 300 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 110 L 180 50 L 290 10"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="400"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (orientation === "vertical") {
    return (
      <div
        ref={lineRef}
        className={`w-0.5 pointer-events-none select-none ${className}`}
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <div
      ref={lineRef}
      className={`h-0.5 w-full pointer-events-none select-none ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
