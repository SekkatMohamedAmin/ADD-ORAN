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
  duration = 750,
  threshold = 0.12,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
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
          hidden: "opacity-0 scale-95",
          visible: "opacity-100 scale-100",
        };
      case "slide-left":
        return {
          hidden: "opacity-0 -translate-x-12",
          visible: "opacity-100 translate-x-0",
        };
      case "slide-right":
        return {
          hidden: "opacity-0 translate-x-12",
          visible: "opacity-100 translate-x-0",
        };
      case "fade-up":
      default:
        return {
          hidden: "opacity-0 translate-y-10",
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
