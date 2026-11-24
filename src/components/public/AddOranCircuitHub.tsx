"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";

export function AddOranCircuitHub() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[920px] w-full bg-[#07070A] text-[#F5F5F2] overflow-hidden select-none border-b border-white/10">
      
      {/* ========================================================
          1. BACKGROUND: ATMOSPHERIC ROCKY MOUNTAINS & RED EMBERS
         ======================================================== */}
      {/* Base Mountain Landscape Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/club/hero-circuit-bg.jpg"
          alt="ADD Oran Mountain Landscape"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-luminosity filter contrast-125"
          priority
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/80 to-[#07070A]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07070A_75%)]" />
      </div>

      {/* Floating Red Energy Sparks & Dust Embers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-[#E52421] shadow-[0_0_12px_#E52421] animate-ping [animation-duration:3s]" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#FF3030] shadow-[0_0_15px_#FF3030] animate-pulse [animation-duration:4s]" />
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 rounded-full bg-[#E52421] shadow-[0_0_10px_#E52421] animate-ping [animation-duration:5s]" />
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#E52421] shadow-[0_0_12px_#E52421] animate-pulse [animation-duration:3.5s]" />
      </div>

      {/* ========================================================
          2. TOP HEADER HUD / CLUB BRANDING BAR
         ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between">
        {/* Club Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-[#E52421]/60 bg-black/60 p-1 shadow-[0_0_15px_rgba(229,36,33,0.4)] flex items-center justify-center">
            <Image
              src="/images/club/category-crest.png"
              alt="ADD Oran Crest"
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display font-black text-lg sm:text-xl tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>ADD</span>
              <span className="text-[#E52421] drop-shadow-[0_0_8px_#E52421]">ORAN HUB</span>
            </span>
            <span className="block font-mono text-[9px] tracking-widest text-[#9E9EA8] uppercase">
              ART DU DÉPLACEMENT • SPORTS EXTRÊMES
            </span>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-[#9E9EA8]">
          <button 
            type="button" 
            onClick={() => scrollToSection("circuit-hub")} 
            className="hover:text-white transition-colors text-white"
          >
            Hub
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection("parkour")} 
            className="hover:text-[#E52421] transition-colors"
          >
            Parkour
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection("climbing")} 
            className="hover:text-[#E52421] transition-colors"
          >
            Escalade
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection("slackline")} 
            className="hover:text-[#E52421] transition-colors"
          >
            Slackline
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection("trekking")} 
            className="hover:text-[#E52421] transition-colors"
          >
            Randonnée
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection("last-season")} 
            className="hover:text-[#E52421] transition-colors"
          >
            Archives
          </button>
        </div>

        {/* Register CTA */}
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,36,33,0.4)] hover:scale-105 active:scale-95"
        >
          <span>Rejoindre</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ========================================================
          3. MAIN INTERACTIVE CIRCUIT DIAGRAM (DESKTOP WIDESCREEN)
         ======================================================== */}
      <div id="circuit-hub" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center">
        
        {/* Large Interactive Circuit Container */}
        <div className="relative w-full max-w-[1100px] h-[640px] hidden md:block">
          
          {/* ====================================================
              GLOWING RED CIRCUIT LINES & ARROWS SVG LAYER
             ==================================================== */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-10" 
            viewBox="0 0 1100 640" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="hub-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur1" />
                <feGaussianBlur stdDeviation="10" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main Rounded Circuit Loop (Connecting the 4 pods) */}
            <rect 
              x="280" 
              y="140" 
              width="540" 
              height="360" 
              rx="40" 
              stroke="#E52421" 
              strokeWidth="2.5" 
              filter="url(#hub-glow)" 
              strokeOpacity="0.85"
            />
            {/* Inner secondary precision hairline */}
            <rect 
              x="280" 
              y="140" 
              width="540" 
              height="360" 
              rx="40" 
              stroke="#FFFFFF" 
              strokeWidth="1" 
              strokeOpacity="0.3"
            />

            {/* Left Outward Bus Line (Towards Trail Running flank) */}
            <path 
              d="M 280 320 L 160 320 Q 140 320 140 340 L 140 400" 
              stroke="#E52421" 
              strokeWidth="2" 
              filter="url(#hub-glow)"
              strokeOpacity="0.8" 
            />
            <path 
              d="M 140 320 L 20 320" 
              stroke="#E52421" 
              strokeWidth="2" 
              filter="url(#hub-glow)"
              strokeOpacity="0.7" 
            />

            {/* Right Outward Bus Line (Towards Running flank) */}
            <path 
              d="M 820 320 L 940 320 Q 960 320 960 340 L 960 400" 
              stroke="#E52421" 
              strokeWidth="2" 
              filter="url(#hub-glow)"
              strokeOpacity="0.8" 
            />
            <path 
              d="M 940 320 L 1080 320" 
              stroke="#E52421" 
              strokeWidth="2" 
              filter="url(#hub-glow)"
              strokeOpacity="0.7" 
            />

            {/* Central Inward Arrow Lines (Flowing from the 4 pods into center) */}
            {/* Top -> Center */}
            <line x1="550" y1="215" x2="550" y2="260" stroke="#E52421" strokeWidth="2.5" filter="url(#hub-glow)"/>
            <polygon points="550,270 544,258 556,258" fill="#E52421" filter="url(#hub-glow)"/>

            {/* Bottom -> Center */}
            <line x1="550" y1="425" x2="550" y2="380" stroke="#E52421" strokeWidth="2.5" filter="url(#hub-glow)"/>
            <polygon points="550,370 544,382 556,382" fill="#E52421" filter="url(#hub-glow)"/>

            {/* Left -> Center */}
            <line x1="360" y1="320" x2="435" y2="320" stroke="#E52421" strokeWidth="2.5" filter="url(#hub-glow)"/>
            <polygon points="445,320 433,314 433,326" fill="#E52421" filter="url(#hub-glow)"/>

            {/* Right -> Center */}
            <line x1="740" y1="320" x2="665" y2="320" stroke="#E52421" strokeWidth="2.5" filter="url(#hub-glow)"/>
            <polygon points="655,320 667,314 667,326" fill="#E52421" filter="url(#hub-glow)"/>
          </svg>

          {/* ====================================================
              CENTER CORE: ADD ORAN HERALDIC SHIELD EMBLEM
             ==================================================== */}
          <div className="absolute top-[320px] left-[550px] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
            {/* Glowing Red Aura */}
            <div className="absolute w-36 h-36 rounded-full bg-[#E52421]/25 blur-xl pointer-events-none animate-pulse" />
            
            {/* Shield Graphic */}
            <div className="relative w-28 h-28 flex items-center justify-center p-2 rounded-2xl transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/club/category-crest.png"
                alt="ADD Oran Central Shield"
                width={100}
                height={100}
                className="object-contain filter drop-shadow-[0_0_18px_rgba(229,36,33,0.8)]"
              />
            </div>

            {/* Center Hub Label */}
            <div className="text-center mt-1">
              <span className="block font-display font-black text-xl tracking-tight text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                ADD <span className="text-[#E52421]">ORAN</span>
              </span>
              <span className="block font-mono text-[10px] tracking-widest text-[#9E9EA8] uppercase">
                L'Élite du Mouvement
              </span>
            </div>
          </div>

          {/* ====================================================
              TOP NODE: SLACKLINING POD
             ==================================================== */}
          <div 
            className="absolute top-[60px] left-[550px] -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer group"
            onClick={() => scrollToSection("slackline")}
            onMouseEnter={() => setHoveredNode("slackline")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Diamond Pod */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-2 border-[#E52421] bg-[#0E0E14]/90 backdrop-blur-md rotate-45 transition-all duration-300 shadow-[0_0_20px_rgba(229,36,33,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_#E52421]" />
              <div className="relative z-10 w-20 h-20 p-1">
                <Image
                  src="/images/club/category-slackline.png"
                  alt="Slackline ADD Oran"
                  width={80}
                  height={80}
                  className="object-contain filter brightness-110"
                />
              </div>
            </div>
            {/* Pod Label */}
            <span className="mt-2 font-display font-black text-xs uppercase tracking-wider text-white group-hover:text-[#E52421] transition-colors">
              SLACKLINING
            </span>
          </div>

          {/* TOP-RIGHT CALLOUT CARD: SLACKLINING */}
          <div className="absolute top-[50px] right-[280px] z-20 w-56 text-left">
            <span className="block font-display font-black text-sm uppercase text-white tracking-wider">
              SLACKLINING
            </span>
            <p className="font-body text-[11px] text-[#9E9EA8] leading-relaxed mt-0.5">
              Évoluez au-dessus du sol et maîtrisez l'équilibre absolu sur la sangle.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("slackline")}
              className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#E52421] hover:text-[#FF4545] font-bold flex items-center gap-1 transition-colors group"
            >
              <span>Découvrir</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* ====================================================
              LEFT NODE: CLIMBING / ESCALADE POD
             ==================================================== */}
          <div 
            className="absolute top-[320px] left-[280px] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer group"
            onClick={() => scrollToSection("climbing")}
            onMouseEnter={() => setHoveredNode("climbing")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Diamond Pod */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-2 border-[#E52421] bg-[#0E0E14]/90 backdrop-blur-md rotate-45 transition-all duration-300 shadow-[0_0_20px_rgba(229,36,33,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_#E52421]" />
              <div className="relative z-10 w-20 h-20 p-1">
                <Image
                  src="/images/club/category-climbing.png"
                  alt="Escalade ADD Oran"
                  width={80}
                  height={80}
                  className="object-contain filter brightness-110"
                />
              </div>
            </div>
            {/* Pod Label */}
            <span className="mt-2 font-display font-black text-xs uppercase tracking-wider text-white group-hover:text-[#E52421] transition-colors">
              ESCALADE
            </span>
          </div>

          {/* TOP-LEFT CALLOUT CARD: CLIMBING */}
          <div className="absolute top-[120px] left-[100px] z-20 w-52 p-4 rounded-2xl border border-white/10 bg-[#121218]/80 backdrop-blur-md shadow-xl text-left">
            <span className="block font-display font-black text-sm uppercase text-white tracking-wider">
              ESCALADE
            </span>
            <p className="font-body text-[11px] text-[#9E9EA8] leading-relaxed mt-1">
              Défiez la verticalité et repoussez vos limites sur les falaises oranaises.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("climbing")}
              className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#E52421] hover:text-[#FF4545] font-bold flex items-center gap-1 transition-colors group"
            >
              <span>Découvrir</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* ====================================================
              RIGHT NODE: PARKOUR & JUMPING POD
             ==================================================== */}
          <div 
            className="absolute top-[320px] left-[820px] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer group"
            onClick={() => scrollToSection("parkour")}
            onMouseEnter={() => setHoveredNode("parkour")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Diamond Pod */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-2 border-[#E52421] bg-[#0E0E14]/90 backdrop-blur-md rotate-45 transition-all duration-300 shadow-[0_0_20px_rgba(229,36,33,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_#E52421]" />
              <div className="relative z-10 w-20 h-20 p-1">
                <Image
                  src="/images/club/category-parkour.png"
                  alt="Parkour ADD Oran"
                  width={80}
                  height={80}
                  className="object-contain filter brightness-110"
                />
              </div>
            </div>
            {/* Pod Label */}
            <span className="mt-2 font-display font-black text-xs uppercase tracking-wider text-white group-hover:text-[#E52421] transition-colors">
              PARKOUR & ADD
            </span>
          </div>

          {/* RIGHT CALLOUT CARD: PARKOUR */}
          <div className="absolute top-[120px] right-[100px] z-20 w-52 p-4 rounded-2xl border border-white/10 bg-[#121218]/80 backdrop-blur-md shadow-xl text-left">
            <span className="block font-display font-black text-sm uppercase text-white tracking-wider">
              PARKOUR
            </span>
            <p className="font-body text-[11px] text-[#9E9EA8] leading-relaxed mt-1">
              Maîtrisez les obstacles urbains et naturels avec style, puissance et sécurité.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("parkour")}
              className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#E52421] hover:text-[#FF4545] font-bold flex items-center gap-1 transition-colors group"
            >
              <span>Découvrir</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* ====================================================
              BOTTOM NODE: TREKKING & RANDONNÉE POD
             ==================================================== */}
          <div 
            className="absolute top-[480px] left-[550px] -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer group"
            onClick={() => scrollToSection("trekking")}
            onMouseEnter={() => setHoveredNode("trekking")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Diamond Pod */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-2 border-[#E52421] bg-[#0E0E14]/90 backdrop-blur-md rotate-45 transition-all duration-300 shadow-[0_0_20px_rgba(229,36,33,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_#E52421]" />
              <div className="relative z-10 w-20 h-20 p-1">
                <Image
                  src="/images/club/category-hiking.png"
                  alt="Randonnée ADD Oran"
                  width={80}
                  height={80}
                  className="object-contain filter brightness-110"
                />
              </div>
            </div>
            {/* Pod Label */}
            <span className="mt-2 font-display font-black text-xs uppercase tracking-wider text-white group-hover:text-[#E52421] transition-colors">
              RANDONNÉE
            </span>
          </div>

          {/* BOTTOM CALLOUT CARD: TREKKING */}
          <div className="absolute bottom-[30px] right-[280px] z-20 w-60 text-left">
            <span className="block font-display font-black text-sm uppercase text-white tracking-wider">
              TREKKING & NATURE
            </span>
            <p className="font-body text-[11px] text-[#9E9EA8] leading-relaxed mt-0.5">
              Embarquez pour des expéditions sauvages et bivouacs en autonomie.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("trekking")}
              className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#E52421] hover:text-[#FF4545] font-bold flex items-center gap-1 transition-colors group"
            >
              <span>Découvrir</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* ====================================================
              OUTER FLANK 1: TRAIL RUNNING (FAR LEFT)
             ==================================================== */}
          <div className="absolute bottom-[40px] left-[40px] z-20 w-44 rounded-2xl border border-white/10 bg-[#0E0E14]/85 backdrop-blur-md overflow-hidden shadow-xl text-left">
            <div className="relative h-24 w-full bg-gradient-to-t from-black to-transparent">
              <Image
                src="/images/disciplines/discipline-trail.jpg"
                alt="Trail Running Oran"
                fill
                sizes="180px"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent" />
            </div>
            <div className="p-3 pt-0">
              <span className="block font-display font-black text-xs uppercase text-white tracking-wider">
                TRAIL NATURE
              </span>
              <p className="font-body text-[10px] text-[#9E9EA8] mt-0.5">
                Parcourez les dénivelés de Murdjadjo.
              </p>
              <button
                type="button"
                onClick={() => scrollToSection("trekking")}
                className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-[#E52421] hover:text-white flex items-center gap-1"
              >
                <span>Explorer</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* ====================================================
              OUTER FLANK 2: RUNNING & TRAINING (FAR RIGHT)
             ==================================================== */}
          <div className="absolute bottom-[40px] right-[40px] z-20 w-44 rounded-2xl border border-white/10 bg-[#0E0E14]/85 backdrop-blur-md overflow-hidden shadow-xl text-left">
            <div className="relative h-24 w-full bg-gradient-to-t from-black to-transparent">
              <Image
                src="/images/hero/hero-parkour.jpg"
                alt="Conditioning ADD Oran"
                fill
                sizes="180px"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent" />
            </div>
            <div className="p-3 pt-0">
              <span className="block font-display font-black text-xs uppercase text-white tracking-wider">
                PRÉPARATION
              </span>
              <p className="font-body text-[10px] text-[#9E9EA8] mt-0.5">
                Conditionnement physique et explosivité.
              </p>
              <button
                type="button"
                onClick={() => scrollToSection("parkour")}
                className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-[#E52421] hover:text-white flex items-center gap-1"
              >
                <span>Explorer</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================
            4. MOBILE / TABLET ADAPTIVE CIRCUIT CARD STACK
           ======================================================== */}
        <div className="w-full flex flex-col items-center gap-6 md:hidden z-20">
          {/* Central Crest on Mobile */}
          <div className="relative flex flex-col items-center text-center py-4">
            <div className="w-24 h-24 rounded-2xl border-2 border-[#E52421] bg-black/60 p-2 shadow-[0_0_25px_rgba(229,36,33,0.5)] flex items-center justify-center mb-3">
              <Image
                src="/images/club/category-crest.png"
                alt="ADD Oran Crest"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
            <h1 className="font-display font-black text-2xl uppercase tracking-tight text-white">
              ADD <span className="text-[#E52421]">ORAN HUB</span>
            </h1>
            <p className="font-mono text-xs text-[#9E9EA8] mt-1 max-w-xs">
              L'écosystème officiel des sports d'action et d'aventure à Oran.
            </p>
          </div>

          {/* 4 Interactive Category Cards for Mobile */}
          <div className="w-full grid grid-cols-2 gap-3">
            {[
              { id: "parkour", name: "Parkour & ADD", icon: "/images/club/category-parkour.png", desc: "Urban Flight" },
              { id: "climbing", name: "Escalade", icon: "/images/club/category-climbing.png", desc: "Vertical Conquest" },
              { id: "slackline", name: "Slackline", icon: "/images/club/category-slackline.png", desc: "Balance Mastery" },
              { id: "trekking", name: "Randonnée", icon: "/images/club/category-hiking.png", desc: "Wild Treks" }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => scrollToSection(cat.id)}
                className="flex flex-col items-center p-4 rounded-2xl border border-white/10 bg-[#121218]/90 backdrop-blur-md shadow-lg hover:border-[#E52421] active:scale-95 transition-all text-center"
              >
                <div className="w-16 h-16 relative mb-2">
                  <Image src={cat.icon} alt={cat.name} fill className="object-contain" />
                </div>
                <span className="font-display font-bold text-xs uppercase text-white tracking-wide">
                  {cat.name}
                </span>
                <span className="font-mono text-[9px] text-[#E52421] uppercase mt-0.5">
                  {cat.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="mt-8 flex flex-col items-center gap-1.5 font-mono text-[10px] tracking-widest text-white/40 uppercase animate-bounce cursor-pointer" onClick={() => scrollToSection("parkour")}>
          <span>DÉCOUVRIR LES DISCIPLINES</span>
          <ChevronDown className="w-4 h-4 text-[#E52421]" />
        </div>

      </div>

    </section>
  );
}
