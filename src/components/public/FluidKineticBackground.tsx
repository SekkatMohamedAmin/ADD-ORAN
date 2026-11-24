"use client";

import React, { useMemo } from "react";

/**
 * FluidKineticBackground: Luxury Multi-Chromatic Kinetic Background
 *
 * Breaks the monochrome red monotony by orchestrating a cohesive, athletic color harmony:
 * 1. Mediterranean Glacier Cyan (#06B6D4 / #0EA5E9) - Mediterranean sea breeze & rock cliff freshness
 * 2. Athletic Solar Gold (#FFD21F / #F59E0B) - Club heraldry, warmth, and prestige
 * 3. Alpine Emerald (#10B981) - Djebel Murdjadjo mountain flora & outdoor trail resilience
 * 4. Kinetic Crimson (#E52421) - Signature passion & speed, refined to an accent rather than overwhelming
 *
 * 100% GPU-accelerated CSS animations, 60+ FPS, zero CPU overhead, and deep black reading contrast.
 */

export function FluidKineticBackground() {
  // Pre-generate deterministic floating particles to prevent hydration mismatches
  const particles = useMemo(() => {
    return [
      { id: 1, left: "8%", top: "15%", size: 3, delay: "0s", duration: "16s", color: "#06B6D4" },
      { id: 2, left: "18%", top: "45%", size: 2, delay: "3s", duration: "20s", color: "#FFD21F" },
      { id: 3, left: "28%", top: "75%", size: 3, delay: "1.5s", duration: "18s", color: "#38BDF8" },
      { id: 4, left: "38%", top: "25%", size: 2.5, delay: "4s", duration: "22s", color: "#10B981" },
      { id: 5, left: "48%", top: "60%", size: 2, delay: "2s", duration: "19s", color: "#FFD21F" },
      { id: 6, left: "58%", top: "18%", size: 3, delay: "5s", duration: "21s", color: "#E52421" },
      { id: 7, left: "68%", top: "82%", size: 2.5, delay: "0.5s", duration: "17s", color: "#06B6D4" },
      { id: 8, left: "78%", top: "35%", size: 3, delay: "3.5s", duration: "23s", color: "#FFD21F" },
      { id: 9, left: "88%", top: "65%", size: 2, delay: "2.5s", duration: "20s", color: "#38BDF8" },
      { id: 10, left: "94%", top: "20%", size: 3, delay: "4.5s", duration: "18s", color: "#10B981" },
      { id: 11, left: "12%", top: "85%", size: 2.5, delay: "1s", duration: "24s", color: "#FFD21F" },
      { id: 12, left: "82%", top: "10%", size: 2, delay: "6s", duration: "19s", color: "#06B6D4" },
    ];
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#030306]"
      aria-hidden="true"
    >
      {/* ========================================================
          1. GPU-ACCELERATED KEYFRAMES (SMOOTH FLUID MOTION)
         ======================================================== */}
      <style>{`
        @keyframes driftCyan {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.22;
          }
          33% {
            transform: translate3d(80px, 40px, 0) scale(1.15);
            opacity: 0.32;
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
            opacity: 0.14;
          }
          50% {
            transform: translate3d(60px, -40px, 0) scale(1.12);
            opacity: 0.24;
          }
        }

        @keyframes driftCrimson {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(-50px, 60px, 0) scale(1.1);
            opacity: 0.25;
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(30px, -140px, 0);
            opacity: 0;
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
          2. CHROMATIC AURORA BLOOMS (BREAKING THE MONOCHROME RED)
         ======================================================== */}
      {/* A. Top-Left Mediterranean Azure / Glacier Cyan Aura */}
      <div
        className="absolute -top-32 -left-32 w-[580px] sm:w-[780px] h-[580px] sm:h-[780px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.28) 0%, rgba(2,132,199,0.18) 45%, transparent 70%)",
          animation: "driftCyan 22s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* B. Top-Right Athletic Solar Gold / Amber Bloom */}
      <div
        className="absolute -top-24 -right-28 w-[500px] sm:w-[720px] h-[500px] sm:h-[720px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,31,0.22) 0%, rgba(245,158,11,0.14) 40%, transparent 70%)",
          animation: "driftGold 26s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* C. Center-Bottom Alpine Emerald / Pine Mist Aura (Murdjadjo Outdoor Flora) */}
      <div
        className="absolute top-1/2 -left-40 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(13,148,136,0.12) 45%, transparent 70%)",
          animation: "driftEmerald 28s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* D. Center Balanced Kinetic Crimson Pulse (Controlled Accent, NOT Overwhelming) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[460px] sm:w-[620px] h-[460px] sm:h-[620px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(229,36,33,0.18) 0%, rgba(185,28,28,0.08) 50%, transparent 70%)",
          animation: "driftCrimson 24s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* E. Lower-Right Glacier Cyan & Electric Indigo Pool */}
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

        {/* Dynamic Fluid Topographic Flow Ribbons */}
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
          4. TACTILE ATHLETIC TECHNICAL MICRO-GRID
         ======================================================== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ========================================================
          5. KINETIC FLOATING ENERGY MOTE PARTICLES (ALIVE MOTION)
         ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
              animation: `particleFloat ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* ========================================================
          6. HIGH-CONTRAST VIGNETTE MASK (ENSURES TEXT READABILITY)
         ======================================================== */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(3,3,6,0.85)_85%,#000000_100%)] pointer-events-none" />
    </div>
  );
}
