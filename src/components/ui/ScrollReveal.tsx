"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade-up" | "fade-in" | "scale-up" | "slide-left" | "slide-right";
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 650,
  threshold = 0.05,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preferences or immediate mobile rendering
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }
    }

    // Safety fallback: Ensure content is ALWAYS visible on mobile/Safari
    // even if IntersectionObserver is delayed or throttled by low power mode.
    const safetyTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            clearTimeout(safetyTimeout);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: typeof window !== "undefined" && window.innerWidth < 768 ? 0.01 : threshold,
        rootMargin: "0px 0px 50px 0px", // Generous margin so it reveals slightly ahead on mobile
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(safetyTimeout);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  // Initial and revealed transformation states per variant
  const getVariantStyles = (): { hidden: string; visible: string } => {
    switch (variant) {
      case "fade-in":
        return {
          hidden: "opacity-0",
          visible: "opacity-100",
        };
      case "scale-up":
        return {
          hidden: "opacity-0 scale-[0.98]",
          visible: "opacity-100 scale-100",
        };
      case "slide-left":
        return {
          hidden: "opacity-0 -translate-x-6",
          visible: "opacity-100 translate-x-0",
        };
      case "slide-right":
        return {
          hidden: "opacity-0 translate-x-6",
          visible: "opacity-100 translate-x-0",
        };
      case "fade-up":
      default:
        return {
          hidden: "opacity-0 translate-y-6",
          visible: "opacity-100 translate-y-0",
        };
    }
  };

  const { hidden, visible } = getVariantStyles();

  return (
    <div
      ref={domRef}
      className={`transition-all ${isVisible ? visible : hidden} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
