"use client";

import React from "react";
import Image from "next/image";

export function AdminEnergyBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Base Action Photography Watermark */}
      <Image
        src="/images/hero/hero-parkour.jpg"
        alt="ADD Oran Athletic Movement"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-[0.06] mix-blend-luminosity filter contrast-125 grayscale"
        priority={false}
      />

      {/* 2. Deep Night Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0D]/85 via-[#0A0A0D]/95 to-[#0A0A0D]" />

      {/* 3. Subtle Athletic Sports Micro-Grid */}
      <div className="absolute inset-0 sports-grid-pattern opacity-30" />

      {/* 4. Balanced Atmospheric Glow (Soft White + Gentle Red) */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -right-16 w-[450px] h-[450px] bg-[#E52421]/[0.06] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      {/* ========================================================
          5. BALANCED ARCHITECTURAL TILES (WHITE + RED ACCENT)
         ======================================================== */}

      {/* Primary Tile: Top-Right Frosted Architectural Slab with Crisp White Border & Red Detail */}
      <div className="absolute -top-12 -right-8 w-[460px] h-[340px] transform rotate-[-10deg] skew-x-[-12deg]">
        <div className="w-full h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent backdrop-blur-[2px] relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.02)]">
          {/* Subtle White Technical Hatch Lines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_18px)]" />
          {/* Crisp White Hairline Top Edge */}
          <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-white/5" />
          {/* Refined Athletic Red Corner Accent */}
          <div className="absolute top-0 right-0 w-24 h-[2px] bg-[#E52421] shadow-[0_0_10px_#E52421]" />
          <div className="absolute top-0 right-0 w-[2px] h-10 bg-[#E52421]" />
          {/* Clean White Technical Tag */}
          <span className="absolute bottom-4 right-6 font-mono text-[9px] tracking-widest text-white/30 uppercase">
            ADD // SECTOR_01
          </span>
        </div>
      </div>

      {/* Secondary Tile: Mid-Left Floating Minimal Frosted Angle */}
      <div className="absolute top-1/3 -left-16 w-[340px] h-[260px] transform rotate-[14deg] skew-y-[-6deg]">
        <div className="w-full h-full rounded-2xl border border-white/10 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_1px,transparent_1px,transparent_14px)]" />
          {/* Warm Athletic Gold Hairline Bottom */}
          <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-[#FFD21F]/60" />
          <span className="absolute top-4 left-6 font-mono text-[9px] tracking-widest text-white/25 uppercase">
            ORAN // MATRIX
          </span>
        </div>
      </div>

      {/* ========================================================
          6. CRISP WHITE & RED KINETIC SPEED LINES
         ======================================================== */}
      {/* Precision White Speed Lines */}
      <div className="absolute top-0 right-[25%] w-[1px] h-[700px] bg-gradient-to-b from-transparent via-white/15 to-transparent transform rotate-[-35deg]" />
      <div className="absolute top-24 right-[23%] w-[1px] h-[500px] bg-gradient-to-b from-transparent via-white/10 to-transparent transform rotate-[-35deg]" />

      {/* Single Kinetic Red Accent Line */}
      <div className="absolute top-10 right-[30%] w-[1.5px] h-[600px] bg-gradient-to-b from-transparent via-[#E52421]/35 to-transparent transform rotate-[-35deg]" />

      {/* Left Hairline */}
      <div className="absolute bottom-20 left-[20%] w-[1px] h-[500px] bg-gradient-to-b from-transparent via-white/10 to-transparent transform rotate-[-35deg]" />

      {/* ========================================================
          7. REFINED TACTICAL SPATIAL HUD NODES (WHITE / MONO)
         ======================================================== */}
      <div className="absolute top-24 left-[14%] flex items-center gap-1.5 font-mono text-[10px] text-white/35">
        <span className="font-bold text-xs text-white/50">+</span>
        <span className="tracking-widest">35.6987° N, 0.6349° W</span>
      </div>
      <div className="absolute top-36 right-[12%] flex items-center gap-1.5 font-mono text-[10px] text-[#FFD21F]/40">
        <span className="font-bold text-xs">+</span>
        <span className="tracking-widest">SYS // ONLINE</span>
      </div>
      <div className="absolute bottom-40 right-[18%] flex items-center gap-1.5 font-mono text-[10px] text-white/25">
        <span className="font-bold text-xs text-white/40">+</span>
        <span className="tracking-widest">ADD.PARKOUR.2026</span>
      </div>
    </div>
  );
}
