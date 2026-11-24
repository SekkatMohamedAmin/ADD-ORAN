"use client";

import React, { useMemo } from "react";

/**
 * FluidKineticBackground: Luxury Cosmic Starfield & Multi-Chromatic Aurora
 *
 * 1. Realistic Twinkling Starfield:
 *    - Replaces artificial dot-grids with natural celestial stars across 3 optical depth tiers.
 *    - Delicate scintillation keyframes (organic twinkle cycles between 2.2s and 6.5s).
 *    - Realistic star hues: diamond white, faint glacier cyan, and warm solar amber.
 * 2. Multi-Chromatic Aurora Blooms:
 *    - Glacier Cyan (#06B6D4) + Solar Gold (#FFD21F) + Alpine Emerald (#10B981) + Subtle Crimson (#E52421).
 * 3. 100% GPU-accelerated CSS animations, 60+ FPS, zero CPU overhead, and deep black reading contrast.
 */

interface StarData {
  id: number;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  size: number; // px (0.8 - 3.2)
  opacity: number; // base opacity
  twinkleDuration: string; // e.g. "3.5s"
  twinkleDelay: string; // e.g. "1.2s"
  color: string; // #FFFFFF, #E0F2FE, #FEF08A
  hasHalo?: boolean;
}

export function FluidKineticBackground() {
  // Deterministic, realistic starfield distribution (fixed seed to ensure SSR/hydration consistency)
  const stars: StarData[] = useMemo(() => {
    return [
      // Upper quadrant (Hero & Emblem sky)
      { id: 1,  x: 5,   y: 8,   size: 1.2, opacity: 0.65, twinkleDuration: "3.2s", twinkleDelay: "0.2s", color: "#FFFFFF" },
      { id: 2,  x: 12,  y: 16,  size: 2.2, opacity: 0.85, twinkleDuration: "4.5s", twinkleDelay: "1.1s", color: "#E0F2FE", hasHalo: true },
      { id: 3,  x: 19,  y: 6,   size: 0.9, opacity: 0.45, twinkleDuration: "2.8s", twinkleDelay: "2.4s", color: "#FFFFFF" },
      { id: 4,  x: 27,  y: 19,  size: 1.5, opacity: 0.70, twinkleDuration: "5.1s", twinkleDelay: "0.8s", color: "#FEF08A" },
      { id: 5,  x: 34,  y: 9,   size: 1.0, opacity: 0.50, twinkleDuration: "3.8s", twinkleDelay: "1.9s", color: "#FFFFFF" },
      { id: 6,  x: 42,  y: 14,  size: 2.5, opacity: 0.90, twinkleDuration: "4.2s", twinkleDelay: "0.4s", color: "#FFFFFF", hasHalo: true },
      { id: 7,  x: 48,  y: 5,   size: 0.8, opacity: 0.40, twinkleDuration: "2.6s", twinkleDelay: "3.1s", color: "#E0F2FE" },
      { id: 8,  x: 56,  y: 18,  size: 1.6, opacity: 0.75, twinkleDuration: "5.4s", twinkleDelay: "1.5s", color: "#FFFFFF" },
      { id: 9,  x: 64,  y: 7,   size: 1.1, opacity: 0.60, twinkleDuration: "3.4s", twinkleDelay: "2.0s", color: "#FEF08A" },
      { id: 10, x: 72,  y: 15,  size: 2.4, opacity: 0.85, twinkleDuration: "4.8s", twinkleDelay: "0.7s", color: "#E0F2FE", hasHalo: true },
      { id: 11, x: 81,  y: 8,   size: 1.0, opacity: 0.55, twinkleDuration: "3.1s", twinkleDelay: "1.3s", color: "#FFFFFF" },
      { id: 12, x: 89,  y: 17,  size: 1.8, opacity: 0.80, twinkleDuration: "4.1s", twinkleDelay: "2.2s", color: "#FFFFFF" },
      { id: 13, x: 96,  y: 11,  size: 1.2, opacity: 0.60, twinkleDuration: "3.6s", twinkleDelay: "0.9s", color: "#FEF08A" },

      // Mid-upper quadrant (Disciplines 1 & 2)
      { id: 14, x: 7,   y: 28,  size: 1.4, opacity: 0.65, twinkleDuration: "4.0s", twinkleDelay: "1.7s", color: "#E0F2FE" },
      { id: 15, x: 15,  y: 35,  size: 0.9, opacity: 0.45, twinkleDuration: "2.9s", twinkleDelay: "0.5s", color: "#FFFFFF" },
      { id: 16, x: 23,  y: 26,  size: 2.8, opacity: 0.95, twinkleDuration: "5.8s", twinkleDelay: "2.6s", color: "#FFFFFF", hasHalo: true },
      { id: 17, x: 31,  y: 38,  size: 1.1, opacity: 0.55, twinkleDuration: "3.3s", twinkleDelay: "1.2s", color: "#FEF08A" },
      { id: 18, x: 39,  y: 29,  size: 1.5, opacity: 0.70, twinkleDuration: "4.4s", twinkleDelay: "3.0s", color: "#FFFFFF" },
      { id: 19, x: 49,  y: 34,  size: 1.0, opacity: 0.50, twinkleDuration: "3.7s", twinkleDelay: "0.3s", color: "#E0F2FE" },
      { id: 20, x: 58,  y: 27,  size: 2.0, opacity: 0.80, twinkleDuration: "4.9s", twinkleDelay: "1.8s", color: "#FFFFFF", hasHalo: true },
      { id: 21, x: 67,  y: 36,  size: 1.2, opacity: 0.60, twinkleDuration: "3.2s", twinkleDelay: "2.5s", color: "#FEF08A" },
      { id: 22, x: 76,  y: 29,  size: 0.9, opacity: 0.40, twinkleDuration: "2.7s", twinkleDelay: "0.9s", color: "#FFFFFF" },
      { id: 23, x: 84,  y: 37,  size: 2.2, opacity: 0.85, twinkleDuration: "5.2s", twinkleDelay: "1.4s", color: "#E0F2FE", hasHalo: true },
      { id: 24, x: 92,  y: 31,  size: 1.3, opacity: 0.65, twinkleDuration: "3.5s", twinkleDelay: "2.1s", color: "#FFFFFF" },

      // Mid quadrant (Disciplines 3 & 4)
      { id: 25, x: 4,   y: 48,  size: 1.1, opacity: 0.55, twinkleDuration: "3.9s", twinkleDelay: "0.6s", color: "#FEF08A" },
      { id: 26, x: 13,  y: 56,  size: 2.4, opacity: 0.90, twinkleDuration: "4.7s", twinkleDelay: "2.3s", color: "#FFFFFF", hasHalo: true },
      { id: 27, x: 21,  y: 46,  size: 0.8, opacity: 0.40, twinkleDuration: "2.5s", twinkleDelay: "1.0s", color: "#E0F2FE" },
      { id: 28, x: 29,  y: 54,  size: 1.6, opacity: 0.70, twinkleDuration: "4.3s", twinkleDelay: "1.6s", color: "#FFFFFF" },
      { id: 29, x: 38,  y: 49,  size: 1.0, opacity: 0.50, twinkleDuration: "3.6s", twinkleDelay: "2.9s", color: "#FEF08A" },
      { id: 30, x: 46,  y: 57,  size: 2.1, opacity: 0.80, twinkleDuration: "5.0s", twinkleDelay: "0.8s", color: "#FFFFFF", hasHalo: true },
      { id: 31, x: 55,  y: 47,  size: 1.3, opacity: 0.60, twinkleDuration: "3.4s", twinkleDelay: "2.2s", color: "#E0F2FE" },
      { id: 32, x: 63,  y: 55,  size: 0.9, opacity: 0.45, twinkleDuration: "2.8s", twinkleDelay: "1.1s", color: "#FFFFFF" },
      { id: 33, x: 73,  y: 48,  size: 2.6, opacity: 0.90, twinkleDuration: "5.5s", twinkleDelay: "0.4s", color: "#FEF08A", hasHalo: true },
      { id: 34, x: 82,  y: 56,  size: 1.2, opacity: 0.65, twinkleDuration: "3.8s", twinkleDelay: "1.9s", color: "#FFFFFF" },
      { id: 35, x: 91,  y: 49,  size: 1.7, opacity: 0.75, twinkleDuration: "4.2s", twinkleDelay: "2.7s", color: "#E0F2FE" },
      { id: 36, x: 97,  y: 58,  size: 0.8, opacity: 0.40, twinkleDuration: "2.6s", twinkleDelay: "0.5s", color: "#FFFFFF" },

      // Mid-lower quadrant (Discipline 5 & About section)
      { id: 37, x: 6,   y: 69,  size: 1.8, opacity: 0.75, twinkleDuration: "4.6s", twinkleDelay: "1.3s", color: "#FFFFFF" },
      { id: 38, x: 16,  y: 77,  size: 1.1, opacity: 0.55, twinkleDuration: "3.2s", twinkleDelay: "2.4s", color: "#FEF08A" },
      { id: 39, x: 24,  y: 66,  size: 2.3, opacity: 0.85, twinkleDuration: "5.3s", twinkleDelay: "0.7s", color: "#E0F2FE", hasHalo: true },
      { id: 40, x: 33,  y: 74,  size: 0.9, opacity: 0.45, twinkleDuration: "2.9s", twinkleDelay: "1.8s", color: "#FFFFFF" },
      { id: 41, x: 41,  y: 68,  size: 1.4, opacity: 0.65, twinkleDuration: "4.1s", twinkleDelay: "3.2s", color: "#FFFFFF" },
      { id: 42, x: 50,  y: 76,  size: 2.0, opacity: 0.80, twinkleDuration: "4.9s", twinkleDelay: "0.9s", color: "#FEF08A", hasHalo: true },
      { id: 43, x: 60,  y: 67,  size: 1.0, opacity: 0.50, twinkleDuration: "3.5s", twinkleDelay: "2.1s", color: "#E0F2FE" },
      { id: 44, x: 69,  y: 75,  size: 1.5, opacity: 0.70, twinkleDuration: "4.4s", twinkleDelay: "1.5s", color: "#FFFFFF" },
      { id: 45, x: 77,  y: 66,  size: 0.8, opacity: 0.40, twinkleDuration: "2.7s", twinkleDelay: "0.6s", color: "#FEF08A" },
      { id: 46, x: 86,  y: 78,  size: 2.5, opacity: 0.90, twinkleDuration: "5.6s", twinkleDelay: "2.0s", color: "#FFFFFF", hasHalo: true },
      { id: 47, x: 94,  y: 69,  size: 1.2, opacity: 0.60, twinkleDuration: "3.7s", twinkleDelay: "1.1s", color: "#E0F2FE" },

      // Lower quadrant (Archives & Footer sky)
      { id: 48, x: 8,   y: 88,  size: 1.3, opacity: 0.65, twinkleDuration: "3.8s", twinkleDelay: "1.9s", color: "#FFFFFF" },
      { id: 49, x: 18,  y: 94,  size: 2.2, opacity: 0.85, twinkleDuration: "4.9s", twinkleDelay: "0.8s", color: "#E0F2FE", hasHalo: true },
      { id: 50, x: 26,  y: 85,  size: 1.0, opacity: 0.50, twinkleDuration: "3.1s", twinkleDelay: "2.3s", color: "#FEF08A" },
      { id: 51, x: 35,  y: 92,  size: 1.6, opacity: 0.70, twinkleDuration: "4.5s", twinkleDelay: "1.4s", color: "#FFFFFF" },
      { id: 52, x: 44,  y: 87,  size: 0.9, opacity: 0.45, twinkleDuration: "2.8s", twinkleDelay: "0.5s", color: "#E0F2FE" },
      { id: 53, x: 53,  y: 95,  size: 2.7, opacity: 0.95, twinkleDuration: "5.7s", twinkleDelay: "2.6s", color: "#FFFFFF", hasHalo: true },
      { id: 54, x: 62,  y: 86,  size: 1.2, opacity: 0.60, twinkleDuration: "3.6s", twinkleDelay: "1.7s", color: "#FEF08A" },
      { id: 55, x: 71,  y: 93,  size: 1.5, opacity: 0.75, twinkleDuration: "4.3s", twinkleDelay: "0.3s", color: "#FFFFFF" },
      { id: 56, x: 80,  y: 85,  size: 0.8, opacity: 0.40, twinkleDuration: "2.6s", twinkleDelay: "2.2s", color: "#E0F2FE" },
      { id: 57, x: 88,  y: 94,  size: 2.1, opacity: 0.80, twinkleDuration: "5.1s", twinkleDelay: "1.0s", color: "#FFFFFF", hasHalo: true },
      { id: 58, x: 95,  y: 87,  size: 1.4, opacity: 0.65, twinkleDuration: "3.9s", twinkleDelay: "1.8s", color: "#FEF08A" },
    ];
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#030306]"
      aria-hidden="true"
    >
      {/* ========================================================
          1. GPU-ACCELERATED KEYFRAMES (TWINKLE & COSMIC AURORA)
         ======================================================== */}
      <style>{`
        @keyframes starTwinkle {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes driftCyan {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.24;
          }
          33% {
            transform: translate3d(80px, 40px, 0) scale(1.15);
            opacity: 0.34;
          }
          66% {
            transform: translate3d(-40px, 70px, 0) scale(0.92);
            opacity: 0.18;
          }
        }

        @keyframes driftGold {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.20;
          }
          33% {
            transform: translate3d(-70px, -50px, 0) scale(1.18);
            opacity: 0.30;
          }
          66% {
            transform: translate3d(50px, -30px, 0) scale(0.95);
            opacity: 0.15;
          }
        }

        @keyframes driftEmerald {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(60px, -40px, 0) scale(1.12);
            opacity: 0.26;
          }
        }

        @keyframes driftCrimson {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(-50px, 60px, 0) scale(1.1);
            opacity: 0.24;
          }
        }

        @keyframes waveSway {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(0.8deg);
          }
        }
      `}</style>

      {/* ========================================================
          2. CHROMATIC AURORA BLOOMS (CYAN, GOLD, EMERALD, CRIMSON)
         ======================================================== */}
      {/* Top-Left Mediterranean Azure / Glacier Cyan Aura */}
      <div
        className="absolute -top-32 -left-32 w-[580px] sm:w-[780px] h-[580px] sm:h-[780px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.28) 0%, rgba(2,132,199,0.18) 45%, transparent 70%)",
          animation: "driftCyan 22s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Top-Right Athletic Solar Gold / Amber Bloom */}
      <div
        className="absolute -top-24 -right-28 w-[500px] sm:w-[720px] h-[500px] sm:h-[720px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,31,0.22) 0%, rgba(245,158,11,0.14) 40%, transparent 70%)",
          animation: "driftGold 26s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Center-Bottom Alpine Emerald / Pine Mist Aura */}
      <div
        className="absolute top-1/2 -left-40 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(13,148,136,0.12) 45%, transparent 70%)",
          animation: "driftEmerald 28s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Center Balanced Kinetic Crimson Pulse */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[460px] sm:w-[620px] h-[460px] sm:h-[620px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(229,36,33,0.18) 0%, rgba(185,28,28,0.08) 50%, transparent 70%)",
          animation: "driftCrimson 24s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Lower-Right Glacier Cyan & Electric Indigo Pool */}
      <div
        className="absolute bottom-10 -right-40 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.20) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)",
          animation: "driftCyan 30s ease-in-out infinite reverse",
          willChange: "transform, opacity",
        }}
      />

      {/* ========================================================
          3. KINETIC TOPOGRAPHIC SPLINES (MULTI-STOP GRADIENT)
         ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] sm:opacity-[0.065] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ animation: "waveSway 20s ease-in-out infinite" }}
      >
        <defs>
          <linearGradient id="multiChromaticFluidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#FFD21F" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#E52421" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="cyanGoldGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD21F" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <g fill="none" strokeWidth="1.5">
          <path
            d="M -100,180 C 320,80 640,320 1020,160 C 1240,70 1400,220 1600,150"
            stroke="url(#multiChromaticFluidGrad)"
          />
          <path
            d="M -100,260 C 300,150 620,400 980,240 C 1220,140 1380,310 1600,230"
            stroke="url(#multiChromaticFluidGrad)"
          />
          <path
            d="M -100,340 C 280,220 600,480 940,320 C 1200,210 1360,400 1600,310"
            stroke="url(#cyanGoldGrad)"
          />
          <path
            d="M -100,620 C 350,520 720,780 1100,580 C 1300,480 1450,660 1600,590"
            stroke="url(#multiChromaticFluidGrad)"
          />
          <path
            d="M -100,700 C 320,600 680,860 1060,660 C 1280,560 1420,740 1600,670"
            stroke="url(#cyanGoldGrad)"
          />
        </g>
      </svg>

      {/* ========================================================
          4. REALISTIC TWINKLING COSMIC STARFIELD
         ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.hasHalo
                ? `0 0 4px ${star.color}, 0 0 10px ${star.color}, 0 0 16px rgba(255,255,255,0.7)`
                : `0 0 2px ${star.color}, 0 0 5px rgba(255,255,255,0.5)`,
              animation: `starTwinkle ${star.twinkleDuration} ease-in-out infinite`,
              animationDelay: star.twinkleDelay,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* ========================================================
          5. HIGH-CONTRAST VIGNETTE MASK (ENSURES TEXT READABILITY)
         ======================================================== */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(3,3,6,0.85)_85%,#000000_100%)] pointer-events-none" />
    </div>
  );
}
