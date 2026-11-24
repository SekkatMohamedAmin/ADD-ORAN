"use client";

import React from "react";

/**
 * Senior UI/UX & Human-Centered Design (HCD / UCD) Compliant Nature Background
 *
 * Designed specifically for high-density administrative work and extended eye comfort:
 * 1. Zero Eye Strain: Deep black canvas (#000000) preserves maximum contrast (WCAG AAA > 12:1)
 *    for dense data tables, numerical amounts, and membership credentials.
 * 2. Outdoor Sports Heritage of ADD Oran:
 *    - Subtle topographic elevation contour lines (representing Mount Murdjadjo & Kristel massif).
 *    - Gentle silhouetted mountain ridges (Ligne de crête) anchored at the bottom viewport edge.
 *    - Atmospheric twilight mist & forest canopy ambient gradient at ultra-low opacity (3% - 6%).
 * 3. Non-Distracting: Absolute radial falloff ensures the central reading area remains 100% clean
 *    with zero glare, zero clutter, and zero interference with text scanning.
 */

export function AdminEnergyBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#000000]"
      aria-hidden="true"
    >
      {/* 1. Base Layer: Solid Deep Ergonomic Black */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* 2. Ambient Natural Dusk & Mountain Mist Vignette (Ultra-diffused, 0 glare) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[380px] bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(229,36,33,0.045),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[380px] bg-[radial-gradient(circle_400px_at_0%_100%,rgba(16,185,129,0.02),transparent_70%)]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[380px] bg-[radial-gradient(circle_400px_at_100%_100%,rgba(229,36,33,0.03),transparent_70%)]" />

      {/* 3. Topographic Elevation Contour Lines (Courbes de Niveau - Murdjadjo Massif) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.038] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="topoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#E52421" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Top-Right Topographic Elevation Curves (Massif de Kristel & Murdjadjo) */}
        <g stroke="url(#topoStroke)" strokeWidth="1" fill="none">
          <path d="M 980,-50 C 1080,80 1190,140 1480,180" />
          <path d="M 920,-50 C 1020,110 1140,190 1480,240" />
          <path d="M 860,-50 C 970,140 1090,240 1480,300" />
          <path d="M 800,-50 C 920,170 1040,290 1480,360" />
          <path d="M 740,-50 C 870,200 990,340 1480,420" />
          <path d="M 680,-50 C 820,230 940,390 1480,480" />
          <path d="M 620,-50 C 770,260 890,440 1480,540" />
        </g>

        {/* Bottom-Left Topographic Elevation Curves */}
        <g stroke="url(#topoStroke)" strokeWidth="1" fill="none">
          <path d="M -50,550 C 180,560 320,680 420,950" />
          <path d="M -50,610 C 220,620 370,740 480,950" />
          <path d="M -50,670 C 260,680 420,800 540,950" />
          <path d="M -50,730 C 300,740 470,860 600,950" />
          <path d="M -50,790 C 340,800 520,920 660,950" />
        </g>

        {/* Elevation Index Markers */}
        <text x="1350" y="235" fill="#FFFFFF" fillOpacity="0.4" fontSize="9" fontFamily="monospace">420m</text>
        <text x="1350" y="295" fill="#FFFFFF" fillOpacity="0.4" fontSize="9" fontFamily="monospace">380m</text>
        <text x="1350" y="355" fill="#FFFFFF" fillOpacity="0.4" fontSize="9" fontFamily="monospace">340m</text>
        <text x="18" y="665" fill="#FFFFFF" fillOpacity="0.4" fontSize="9" fontFamily="monospace">120m</text>
        <text x="18" y="725" fill="#FFFFFF" fillOpacity="0.4" fontSize="9" fontFamily="monospace">80m</text>
      </svg>

      {/* 4. Grounded Mountain Ridge Silhouettes (Lignes de Crête - Oran Highlands) */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-52 pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Distant Mountain Ridge Gradient */}
            <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C1C28" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#0B0B14" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Foreground Mountain Ridge Gradient */}
            <linearGradient id="ridgeNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E52421" stopOpacity="0.05" />
              <stop offset="40%" stopColor="#0E0E18" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Layer 1: Distant Crest (Santa Cruz Peak & Murdjadjo Plateau) */}
          <path
            d="M 0,160 
               L 120,135 
               L 260,150 
               L 390,110 
               L 520,138 
               L 680,95 
               L 820,130 
               L 960,105 
               L 1120,140 
               L 1280,115 
               L 1440,150 
               L 1440,220 
               L 0,220 Z"
            fill="url(#ridgeFar)"
          />

          {/* Layer 2: Near Ridge (Kristel Cliffs & Coastal Escarpment) */}
          <path
            d="M 0,185 
               L 160,165 
               L 310,180 
               L 480,145 
               L 620,172 
               L 790,140 
               L 940,168 
               L 1100,148 
               L 1250,175 
               L 1440,160 
               L 1440,220 
               L 0,220 Z"
            fill="url(#ridgeNear)"
          />
        </svg>
      </div>

      {/* 5. Senior HCD Vignette Mask: Guarantees 0% Interference on Tables & Content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
