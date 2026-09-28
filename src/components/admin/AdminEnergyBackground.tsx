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
        className="object-cover object-center opacity-[0.09] mix-blend-luminosity filter contrast-140 grayscale"
        priority={false}
      />

      {/* 2. Deep Night Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0D]/80 via-[#0A0A0D]/90 to-[#0A0A0D]" />

      {/* 3. High-Density Kinetic Grid Pattern with Red Micro-Nodes */}
      <div className="absolute inset-0 sports-grid-pattern opacity-60" />

      {/* 4. Large Atmospheric Red Energy Glow Orbs */}
      <div className="absolute -top-24 right-[15%] w-[650px] h-[650px] bg-[#E52421]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-[500px] h-[500px] bg-[#E52421]/12 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-[600px] h-[500px] bg-[#E52421]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-[350px] h-[350px] bg-[#FFD21F]/[0.06] blur-[100px] rounded-full pointer-events-none" />

      {/* ========================================================
          5. GEOMETRIC RED ENERGY SHAPES & ANGLED TILES
         ======================================================== */}

      {/* Tile A: Top-Right Heavy Angular Red Energy Polygon Plate */}
      <div className="absolute -top-16 -right-10 w-[540px] h-[400px] transform rotate-[-12deg] skew-x-[-14deg]">
        <div className="w-full h-full rounded-3xl border-2 border-[#E52421]/40 bg-gradient-to-br from-[#E52421]/25 via-[#E52421]/10 to-transparent backdrop-blur-[2px] relative overflow-hidden shadow-[0_0_80px_rgba(229,36,33,0.22)]">
          {/* Diagonal Red Velocity Stripes inside the tile */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(229,36,33,0.14)_0px,rgba(229,36,33,0.14)_3px,transparent_3px,transparent_18px)]" />
          {/* Laser-Sharp Glowing Red Blade Accent */}
          <div className="absolute top-0 right-0 w-48 h-1.5 bg-[#E52421] shadow-[0_0_18px_#E52421]" />
          <div className="absolute top-0 right-0 w-2 h-16 bg-[#E52421] shadow-[0_0_18px_#E52421]" />
          {/* Tile Tag */}
          <span className="absolute bottom-4 right-6 font-mono text-[9px] tracking-widest text-[#E52421]/70 uppercase">
            ENERGY_SLAB // 01
          </span>
        </div>
      </div>

      {/* Tile B: Mid-Left Floating Red Geometric Rhombus Tile */}
      <div className="absolute top-1/3 -left-20 w-[420px] h-[320px] transform rotate-[16deg] skew-y-[-8deg]">
        <div className="w-full h-full rounded-3xl border border-[#E52421]/35 bg-gradient-to-tr from-[#E52421]/20 via-[#E52421]/5 to-transparent relative overflow-hidden shadow-[0_0_60px_rgba(229,36,33,0.18)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(229,36,33,0.10)_0px,rgba(229,36,33,0.10)_2px,transparent_2px,transparent_14px)]" />
          <div className="absolute bottom-0 left-0 w-36 h-1 bg-[#FFD21F] shadow-[0_0_14px_#FFD21F]" />
          <div className="absolute top-0 left-12 w-20 h-1 bg-[#E52421] shadow-[0_0_12px_#E52421]" />
          <span className="absolute top-4 left-6 font-mono text-[9px] tracking-widest text-[#E52421]/60 uppercase">
            VECTOR_SECTOR // 02
          </span>
        </div>
      </div>

      {/* Tile C: Right Mid-Ground Angled Red Energy Shard */}
      <div className="absolute top-[55%] -right-16 w-[380px] h-[280px] transform rotate-[-8deg] skew-x-[15deg]">
        <div className="w-full h-full rounded-2xl border border-[#E52421]/30 bg-gradient-to-bl from-[#E52421]/20 via-transparent to-[#FFD21F]/10 relative overflow-hidden shadow-[0_0_50px_rgba(229,36,33,0.15)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(229,36,33,0.08)_0px,rgba(229,36,33,0.08)_2px,transparent_2px,transparent_12px)]" />
          <div className="absolute top-0 right-0 w-28 h-1 bg-[#E52421] shadow-[0_0_12px_#E52421]" />
        </div>
      </div>

      {/* Tile D: Bottom Center-Left Angular Plate */}
      <div className="absolute -bottom-14 left-[18%] w-[420px] h-[220px] transform rotate-[-6deg] skew-x-[-12deg]">
        <div className="w-full h-full rounded-2xl border border-[#E52421]/25 bg-gradient-to-t from-[#E52421]/15 via-[#FF3030]/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E52421] to-transparent shadow-[0_0_12px_#E52421]" />
        </div>
      </div>

      {/* ========================================================
          6. DIAGONAL VELOCITY SLASHES & ENERGY BEAMS
         ======================================================== */}
      {/* Primary Red Slashes */}
      <div className="absolute top-0 right-[28%] w-[2px] h-[750px] bg-gradient-to-b from-transparent via-[#E52421]/60 to-transparent transform rotate-[-38deg] shadow-[0_0_10px_#E52421]" />
      <div className="absolute top-20 right-[26%] w-[1px] h-[550px] bg-gradient-to-b from-transparent via-[#FF3030]/50 to-transparent transform rotate-[-38deg]" />
      <div className="absolute top-44 right-[32%] w-[1.5px] h-[650px] bg-gradient-to-b from-transparent via-[#FFD21F]/40 to-transparent transform rotate-[-38deg]" />

      {/* Left Slashes */}
      <div className="absolute bottom-10 left-[22%] w-[2px] h-[600px] bg-gradient-to-b from-transparent via-[#E52421]/50 to-transparent transform rotate-[-38deg] shadow-[0_0_8px_#E52421]" />
      <div className="absolute bottom-32 left-[25%] w-[1px] h-[450px] bg-gradient-to-b from-transparent via-[#FFD21F]/35 to-transparent transform rotate-[-38deg]" />

      {/* ========================================================
          7. TACTICAL SPATIAL HUD NODES & CROSSHAIRS
         ======================================================== */}
      <div className="absolute top-24 left-[14%] flex items-center gap-1.5 font-mono text-[10px] text-[#E52421]/60">
        <span className="font-bold text-xs">+</span>
        <span className="tracking-widest">ADD//GRID.35.69</span>
      </div>
      <div className="absolute top-40 right-[12%] flex items-center gap-1.5 font-mono text-[10px] text-[#FFD21F]/60">
        <span className="font-bold text-xs">+</span>
        <span className="tracking-widest">KINETIC.SECTOR//A</span>
      </div>
      <div className="absolute bottom-52 right-[20%] flex items-center gap-1.5 font-mono text-[10px] text-[#E52421]/50">
        <span className="font-bold text-xs">+</span>
        <span className="tracking-widest">FLOW_NODE//26</span>
      </div>
      <div className="absolute bottom-28 left-[18%] flex items-center gap-1.5 font-mono text-[10px] text-[#FFD21F]/50">
        <span className="font-bold text-xs">+</span>
        <span className="tracking-widest">VELOCITY//SYS</span>
      </div>
    </div>
  );
}
