"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Activity, 
  Mountain, 
  Zap, 
  Compass, 
  Shield, 
  Sparkles,
  Flame
} from "lucide-react";

export type DisciplineCategory = "parkour" | "climbing" | "slackline" | "hiking" | "crest";

interface CategoryMeta {
  id: DisciplineCategory;
  name: string;
  tagline: string;
  code: string;
  icon: React.ElementType;
  desc: string;
  highlights: string[];
  metrics: { label: string; value: number }[];
  targetSection: string;
  heroImage: string;
  accentColor: string;
  angleDeg: number;
}

const CATEGORIES: Record<DisciplineCategory, CategoryMeta> = {
  parkour: {
    id: "parkour",
    name: "Parkour & ADD",
    tagline: "URBAN FLIGHT & NATURAL MOVEMENT",
    code: "SECTOR // 01",
    icon: Zap,
    desc: "L'Art Du Déplacement : franchir chaque obstacle architectural avec fluidité, explosivité et maîtrise totale de son corps dans l'espace urbain.",
    highlights: ["Franchissements & Sauts", "Précision & Réception", "Fluidité du Mouvement"],
    metrics: [
      { label: "Agilité", value: 98 },
      { label: "Explosivité", value: 92 },
      { label: "Créativité", value: 95 }
    ],
    targetSection: "#disciplines",
    heroImage: "/images/disciplines/discipline-parkour.jpg",
    accentColor: "#E52421",
    angleDeg: 0 // Right quadrant
  },
  climbing: {
    id: "climbing",
    name: "Escalade & Bloc",
    tagline: "VERTICAL CONQUEST & TACTICAL FOCUS",
    code: "SECTOR // 02",
    icon: Mountain,
    desc: "Gravir les parois naturelles et voies artificielles. Maîtrise de la verticalité, force de préhension et lecture tactique de chaque prise.",
    highlights: ["Voies & Blocs Techniques", "Force Digitale", "Gestion du Vide & Sécurité"],
    metrics: [
      { label: "Force Relative", value: 94 },
      { label: "Résistance Mentale", value: 96 },
      { label: "Équilibre", value: 90 }
    ],
    targetSection: "#disciplines",
    heroImage: "/images/disciplines/discipline-climbing.jpg",
    accentColor: "#E52421",
    angleDeg: 180 // Left quadrant
  },
  slackline: {
    id: "slackline",
    name: "Slackline & Équilibre",
    tagline: "MASTERY OF THE TENSION LINE",
    code: "SECTOR // 03",
    icon: Activity,
    desc: "Évoluer sur une sangle élastique tendue au-dessus du sol. Développez une proprioception chirurgicale, un gainage profond et un calme intérieur absolu.",
    highlights: ["Waterline & Highline", "Posture & Alignement", "Contrôle Proprioceptif"],
    metrics: [
      { label: "Proprioception", value: 99 },
      { label: "Gainage Profond", value: 95 },
      { label: "Concentration", value: 97 }
    ],
    targetSection: "#disciplines",
    heroImage: "/images/hero/hero-trail.jpg",
    accentColor: "#E52421",
    angleDeg: 270 // Top quadrant
  },
  hiking: {
    id: "hiking",
    name: "Randonnée & Trail",
    tagline: "WILD ENDURANCE & MOUNTAIN TREK",
    code: "SECTOR // 04",
    icon: Compass,
    desc: "Explorer les reliefs sauvages de l'Oranie et au-delà. Bivouacs en autonomie, dépassement d'endurance et communion totale avec la nature.",
    highlights: ["Treks en Autonomie", "Orientation & Survie", "Endurance Tout-Terrain"],
    metrics: [
      { label: "Endurance Cardiaque", value: 96 },
      { label: "Résilience", value: 94 },
      { label: "Esprit d'Équipe", value: 98 }
    ],
    targetSection: "#disciplines",
    heroImage: "/images/disciplines/discipline-trail.jpg",
    accentColor: "#E52421",
    angleDeg: 90 // Bottom quadrant
  },
  crest: {
    id: "crest",
    name: "ADD Oran Club",
    tagline: "ESPIRIT DE CORPS & HÉRITAGE ATHLÉTIQUE",
    code: "CORE // EMBLEM",
    icon: Shield,
    desc: "Association Art Du Déplacement Oran. Fondée sur les valeurs du dépassement, de l'entraide et de la formation des athlètes complets depuis 2018.",
    highlights: ["Communauté Unie", "Coaching Certifié", "Événements & Compétitions"],
    metrics: [
      { label: "Engagement", value: 100 },
      { label: "Cohésion", value: 100 },
      { label: "Excellence", value: 98 }
    ],
    targetSection: "#disciplines",
    heroImage: "/images/hero/hero-parkour.jpg",
    accentColor: "#E52421",
    angleDeg: 0
  }
};

export function CategoryLogoHub() {
  const [activeCategory, setActiveCategory] = useState<DisciplineCategory>("parkour");
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  // Auto-cycle through categories every 6 seconds unless paused by user interaction
  useEffect(() => {
    if (!isAutoCycling) return;

    const cycleOrder: DisciplineCategory[] = ["parkour", "climbing", "slackline", "hiking"];
    const interval = setInterval(() => {
      setActiveCategory((prev) => {
        const nextIdx = (cycleOrder.indexOf(prev) + 1) % cycleOrder.length;
        return cycleOrder[nextIdx];
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const activeMeta = CATEGORIES[activeCategory];

  return (
    <section 
      className="relative min-h-[850px] w-full bg-[#0A0A0D] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none border-b border-white/10"
      onMouseEnter={() => setIsAutoCycling(false)}
      onMouseLeave={() => setIsAutoCycling(true)}
    >
      {/* ========================================================
          1. ANIMATED RED BACKGROUND AURA & KINETIC RADIAL WAVES
         ======================================================== */}
      {/* Central Pulsating Crimson Core */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(229, 36, 33, 0.22) 0%, rgba(229, 36, 33, 0.08) 45%, transparent 70%)`,
          filter: "blur(60px)",
          transform: `translate(-50%, -50%) scale(${activeCategory === "crest" ? 1.2 : 1.05})`
        }}
      />

      {/* Kinetic Red Shockwave Waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-[#E52421]/20 animate-ping [animation-duration:5s]" />
        <div className="absolute inset-16 rounded-full border border-[#E52421]/15 [animation-duration:8s] animate-pulse" />
        <div className="absolute inset-32 rounded-full border border-dashed border-[#E52421]/20 animate-[spin_60s_linear_infinite]" />
      </div>

      {/* Athletic Diamond Technical Grid Matrix */}
      <div className="absolute inset-0 sports-grid-pattern opacity-25 pointer-events-none" />

      {/* Kinetic Speed Lines Oriented Towards Active Sector */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-[#E52421]/40 to-transparent transition-transform duration-700 pointer-events-none"
        style={{ transform: `translate(-50%, -50%) rotate(${activeMeta.angleDeg}deg)` }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none"
        style={{ transform: `translate(-50%, -50%) rotate(${activeMeta.angleDeg + 90}deg)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52421]/10 border border-[#E52421]/30 text-[#E52421] font-mono text-xs uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 text-[#E52421] animate-pulse" />
            <span>ADD ORAN // ÉCOSYSTÈME ATHLÉTIQUE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-[#F5F5F2] uppercase">
            UN LOGO. <span className="text-[#E52421]">QUATRE MONDES.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9E9EA8] font-body">
            Survolez ou cliquez sur chaque quartier du logo pour illuminer la discipline correspondante et explorer notre univers.
          </p>
        </div>

        {/* ========================================================
            2. MAIN COMPOSITION: CENTRAL LOGO + DYNAMIC CATEGORY HUD
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ====================================================
              LEFT/CENTER: THE INTERACTIVE DIAMOND LOGO HUB
             ==================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* Ambient Red Glow Halo */}
            <div 
              className="absolute w-[420px] h-[420px] rounded-full pointer-events-none transition-all duration-700"
              style={{
                boxShadow: "0 0 100px 30px rgba(229, 36, 33, 0.35)",
                background: "radial-gradient(circle, rgba(229,36,33,0.3) 0%, transparent 70%)"
              }}
            />

            {/* The Central Diamond Interactive Frame */}
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
              
              {/* Outer Glowing Red Diamond Frame (45 deg) */}
              <div 
                className="absolute inset-0 rounded-[32px] border-2 border-[#E52421] transform rotate-45 transition-all duration-500 shadow-[0_0_35px_rgba(229,36,33,0.55)]"
                style={{
                  background: "linear-gradient(135deg, rgba(229,36,33,0.12) 0%, rgba(10,10,13,0.95) 50%, rgba(229,36,33,0.08) 100%)"
                }}
              />

              {/* Secondary Technical Hairline Diamond */}
              <div className="absolute inset-4 rounded-[26px] border border-white/20 transform rotate-45 pointer-events-none" />

              {/* The Enhanced Master Logo Visual */}
              <div className="relative z-10 w-full h-full p-6 flex items-center justify-center">
                <Image
                  src="/images/club/logo-enhanced-dark.png"
                  alt="ADD Oran Enhanced Athletic Crest"
                  fill
                  sizes="(max-width: 768px) 340px, 420px"
                  className="object-contain filter drop-shadow-[0_0_20px_rgba(229,36,33,0.45)] transition-transform duration-500"
                  priority
                />
              </div>

              {/* ========================================================
                  INTERACTIVE INVISIBLE TOUCH-TARGET WEDGES (4 QUADRANTS)
                 ======================================================== */}
              
              {/* TOP QUADRANT: SLACKLINE */}
              <button
                type="button"
                aria-label="Sélectionner Slackline"
                onClick={() => setActiveCategory("slackline")}
                onMouseEnter={() => setActiveCategory("slackline")}
                className={`group absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  activeCategory === "slackline" ? "scale-110" : "opacity-80 hover:opacity-100"
                }`}
              >
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                  activeCategory === "slackline"
                    ? "bg-[#E52421] border-[#E52421] text-white shadow-[0_0_15px_#E52421]"
                    : "bg-[#141419]/90 border-white/20 text-white/70 hover:border-[#E52421]"
                }`}>
                  SLACKLINE
                </span>
                <div className={`w-2 h-2 rounded-full transition-all ${
                  activeCategory === "slackline" ? "bg-[#E52421] shadow-[0_0_10px_#E52421]" : "bg-white/40"
                }`} />
              </button>

              {/* RIGHT QUADRANT: PARKOUR */}
              <button
                type="button"
                aria-label="Sélectionner Parkour"
                onClick={() => setActiveCategory("parkour")}
                onMouseEnter={() => setActiveCategory("parkour")}
                className={`group absolute top-1/2 right-0 translate-x-2 -translate-y-1/2 z-20 flex items-center gap-1.5 transition-all duration-300 ${
                  activeCategory === "parkour" ? "scale-110" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-all ${
                  activeCategory === "parkour" ? "bg-[#E52421] shadow-[0_0_10px_#E52421]" : "bg-white/40"
                }`} />
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                  activeCategory === "parkour"
                    ? "bg-[#E52421] border-[#E52421] text-white shadow-[0_0_15px_#E52421]"
                    : "bg-[#141419]/90 border-white/20 text-white/70 hover:border-[#E52421]"
                }`}>
                  PARKOUR
                </span>
              </button>

              {/* BOTTOM QUADRANT: HIKING */}
              <button
                type="button"
                aria-label="Sélectionner Randonnée"
                onClick={() => setActiveCategory("hiking")}
                onMouseEnter={() => setActiveCategory("hiking")}
                className={`group absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 z-20 flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  activeCategory === "hiking" ? "scale-110" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-all ${
                  activeCategory === "hiking" ? "bg-[#E52421] shadow-[0_0_10px_#E52421]" : "bg-white/40"
                }`} />
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                  activeCategory === "hiking"
                    ? "bg-[#E52421] border-[#E52421] text-white shadow-[0_0_15px_#E52421]"
                    : "bg-[#141419]/90 border-white/20 text-white/70 hover:border-[#E52421]"
                }`}>
                  RANDONNÉE
                </span>
              </button>

              {/* LEFT QUADRANT: CLIMBING */}
              <button
                type="button"
                aria-label="Sélectionner Escalade"
                onClick={() => setActiveCategory("climbing")}
                onMouseEnter={() => setActiveCategory("climbing")}
                className={`group absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2 z-20 flex items-center gap-1.5 transition-all duration-300 ${
                  activeCategory === "climbing" ? "scale-110" : "opacity-80 hover:opacity-100"
                }`}
              >
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                  activeCategory === "climbing"
                    ? "bg-[#E52421] border-[#E52421] text-white shadow-[0_0_15px_#E52421]"
                    : "bg-[#141419]/90 border-white/20 text-white/70 hover:border-[#E52421]"
                }`}>
                  ESCALADE
                </span>
                <div className={`w-2 h-2 rounded-full transition-all ${
                  activeCategory === "climbing" ? "bg-[#E52421] shadow-[0_0_10px_#E52421]" : "bg-white/40"
                }`} />
              </button>

              {/* CENTER CREST: ADD ORAN CORE */}
              <button
                type="button"
                aria-label="Sélectionner Club Core"
                onClick={() => setActiveCategory("crest")}
                onMouseEnter={() => setActiveCategory("crest")}
                className="absolute z-30 w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                title="ADD Oran Heraldic Shield"
              >
                <div className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeCategory === "crest"
                    ? "border-[#E52421] bg-[#E52421]/20 shadow-[0_0_20px_#E52421]"
                    : "border-white/20 bg-transparent hover:border-[#E52421]"
                }`}>
                  <Shield className="w-5 h-5 text-[#E52421]" />
                </div>
              </button>

            </div>

            {/* Quick-Switch Pill Navigation for Mobile / Tablet */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 z-20">
              {(["parkour", "climbing", "slackline", "hiking", "crest"] as DisciplineCategory[]).map((catId) => {
                const item = CATEGORIES[catId];
                const isActive = activeCategory === catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => setActiveCategory(catId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
                      isActive
                        ? "bg-[#E52421] text-white border-[#E52421] shadow-[0_0_15px_rgba(229,36,33,0.5)] scale-105"
                        : "bg-[#141419] text-[#9E9EA8] border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ====================================================
              RIGHT: EVOLVING DISCIPLINE SHOWCASE CARD (HUD)
             ==================================================== */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-[#E52421]/30 bg-gradient-to-br from-[#121217]/95 via-[#0A0A0D]/95 to-[#121217]/95 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-500">
              
              {/* Dynamic Crimson Accent Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E52421] to-transparent shadow-[0_0_12px_#E52421]" />

              {/* Watermark Code in Background */}
              <span className="absolute -bottom-4 right-4 font-display font-black text-6xl sm:text-7xl text-white/[0.03] select-none pointer-events-none">
                {activeMeta.id.toUpperCase()}
              </span>

              {/* Category Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E52421] animate-ping" />
                  <span className="font-mono text-xs text-[#E52421] tracking-widest uppercase font-bold">
                    {activeMeta.code}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-white/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#E52421]" />
                  <span>ACTIVE SECTOR</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-2xl sm:text-3xl font-display font-black text-[#F5F5F2] tracking-tight uppercase mb-1">
                {activeMeta.name}
              </h3>
              <p className="font-mono text-xs text-[#E52421] tracking-wider uppercase mb-4">
                {activeMeta.tagline}
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#9E9EA8] font-body leading-relaxed mb-6">
                {activeMeta.desc}
              </p>

              {/* Photo Preview & Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
                {/* Photo Thumbnail */}
                <div className="sm:col-span-5 relative h-36 rounded-xl overflow-hidden border border-white/10 group">
                  <Image
                    src={activeMeta.heroImage}
                    alt={activeMeta.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/80 uppercase tracking-widest">
                    ADD ORAN ARCHIVE
                  </span>
                </div>

                {/* Highlights List */}
                <div className="sm:col-span-7 flex flex-col justify-center space-y-2">
                  {activeMeta.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E52421]" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Athletic Metrics Bars */}
              <div className="space-y-2.5 mb-8 pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                  INDICES DE PERFORMANCE
                </span>
                {activeMeta.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white/70">{metric.label}</span>
                      <span className="text-[#E52421] font-bold">{metric.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#E52421] to-[#FF4545] rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_#E52421]"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(229,36,33,0.4)] hover:shadow-[0_0_28px_rgba(229,36,33,0.6)] hover:scale-[1.02] active:scale-95 group"
                >
                  <span>Rejoindre la section</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <a
                  href="#disciplines"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 hover:border-[#E52421] hover:text-[#E52421] text-white/80 font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <span>Explorer tout</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
