"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Mountain,
  Zap,
  Activity,
  Compass,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DisciplineImageItem } from "@/lib/homeImagesClient";

interface FluidDisciplineShowcaseProps {
  parkourImages?: (string | DisciplineImageItem)[];
  climbingImages?: (string | DisciplineImageItem)[];
  trailImages?: (string | DisciplineImageItem)[];
}

const getSrc = (img?: string | DisciplineImageItem) => {
  if (!img) return "";
  return typeof img === "string" ? img : img.src;
};

export function FluidDisciplineShowcase({
  parkourImages = [
    "/images/homePage/parkour/5893075819293249589.jpg",
    "/images/homePage/parkour/5893075819293249591.jpg",
    "/images/disciplines/discipline-parkour.jpg"
  ],
  climbingImages = [
    "/images/homePage/escalade/733127115_18036290213816291_5589127572874927298_n.jpg",
    "/images/homePage/escalade/744088777_18604132903044482_6608679076356787624_n.jpg",
    "/images/homePage/escalade/744821683_18604132933044482_8092442562257906338_n.jpg",
    "/images/disciplines/discipline-climbing.jpg"
  ],
  trailImages = [
    "/images/disciplines/discipline-trail.jpg",
    "/images/hero/hero-trail.jpg"
  ]
}: FluidDisciplineShowcaseProps) {
  const { isRtl } = useLanguage();

  // Active photo indices for carousels
  const [parkourIdx, setParkourIdx] = useState(0);
  const [climbingIdx, setClimbingIdx] = useState(0);

  return (
    <div className="relative bg-[#07070A] text-[#F5F5F2] overflow-hidden">

      {/* Continuous Glowing Red Circuit Spine Running Down the Center */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#E52421] via-[#E52421]/60 to-[#E52421]/20 pointer-events-none hidden lg:block"
        style={{ filter: "drop-shadow(0 0 6px #E52421)" }}
      />

      {/* ========================================================
          DISCIPLINE 01: PARKOUR & ART DU DÉPLACEMENT
         ======================================================== */}
      <section id="parkour" className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">

        {/* Technical Circuit Node Marker */}
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 font-mono text-xs text-[#E52421] tracking-widest uppercase">
            <span className="w-3 h-3 rounded-full bg-[#E52421] shadow-[0_0_12px_#E52421] animate-ping" />
            <span className="px-3 py-1 rounded bg-[#E52421]/10 border border-[#E52421]/30">
              CIRCUIT NODE // 01 : URBAN FLIGHT
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Narrative & In-Depth Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#E52421] tracking-widest uppercase font-bold">
                L'ART DU DÉPLACEMENT • DISCIPLINE CARDINALE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
                PARKOUR <span className="text-[#E52421]">& FLUIDITÉ</span>
              </h2>
              <p className="font-mono text-xs text-[#9E9EA8] tracking-wider uppercase">
                FRANCHISSEMENT D'OBSTACLES • PRÉCISION • EXPLOSIVITÉ
              </p>
            </div>

            <p className="font-body text-base text-[#9E9EA8] leading-relaxed">
              Fondé sur la philosophie originelle de l'Art Du Déplacement (« Être et Durer »), le parkour chez ADD Oran transforme l'environnement architectural en un terrain d'expression et d'agilité totale. Chaque mur, garde-corps ou dénivelé devient une opportunité de maîtriser son corps dans l'espace avec fluidité et sécurité absolue.
            </p>

            {/* Core Modules Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-white/10 bg-[#121218]/80">
                <span className="block font-display font-bold text-sm text-white uppercase mb-1">
                  1. Franchissements Fluides
                </span>
                <span className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                  Sauts de chat, passe-murailles, dash et lazy vaults exécutés en pleine course sans rupture d'élan.
                </span>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-[#121218]/80">
                <span className="block font-display font-bold text-sm text-white uppercase mb-1">
                  2. Réceptions & Roulades
                </span>
                <span className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                  Absorption cinétique chirurgicale pour préserver les articulations sur tout type de sol urbain.
                </span>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/70">AGILITÉ & EXPLOSIVITÉ</span>
                <span className="text-[#E52421] font-bold">98%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#E52421] rounded-full w-[98%] shadow-[0_0_8px_#E52421]" />
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(229,36,33,0.4)] hover:scale-105 active:scale-95 group"
              >
                <span>Rejoindre la section Parkour</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Photo Gallery Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#E52421]/30 shadow-2xl bg-black/40 group">
              <Image
                src={getSrc(parkourImages[parkourIdx % parkourImages.length]) || "/images/disciplines/discipline-parkour.jpg"}
                alt="Parkour ADD Oran Action"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Carousel Navigation Buttons */}
              {parkourImages.length > 1 && (
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setParkourIdx((prev) => (prev - 1 + parkourImages.length) % parkourImages.length)}
                    className="p-2 rounded-lg bg-black/70 border border-white/20 text-white hover:border-[#E52421] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setParkourIdx((prev) => (prev + 1) % parkourImages.length)}
                    className="p-2 rounded-lg bg-black/70 border border-white/20 text-white hover:border-[#E52421] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="absolute bottom-4 left-4 font-mono text-xs text-white/80 uppercase tracking-widest">
                ADD ORAN // SESSION ARCHIVE {parkourIdx + 1}/{parkourImages.length}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          DISCIPLINE 02: ESCALADE SPORTIVE & BLOC (CLIMBING)
         ======================================================== */}
      <section id="climbing" className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0B0B10]">

        {/* Technical Circuit Node Marker */}
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 font-mono text-xs text-[#E52421] tracking-widest uppercase">
            <span className="w-3 h-3 rounded-full bg-[#E52421] shadow-[0_0_12px_#E52421]" />
            <span className="px-3 py-1 rounded bg-[#E52421]/10 border border-[#E52421]/30">
              CIRCUIT NODE // 02 : VERTICAL CONQUEST
            </span>
          </div>
          <span className="font-mono text-xs text-white/30 hidden sm:block">
            SANTA CRUZ CLIFFS • CANASTEL SECTOR
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Photo Gallery Visual (Left on desktop for fluid rhythm) */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#E52421]/30 shadow-2xl bg-black/40 group">
              <Image
                src={getSrc(climbingImages[climbingIdx % climbingImages.length]) || "/images/disciplines/discipline-climbing.jpg"}
                alt="Escalade ADD Oran Action"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Carousel Navigation Buttons */}
              {climbingImages.length > 1 && (
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setClimbingIdx((prev) => (prev - 1 + climbingImages.length) % climbingImages.length)}
                    className="p-2 rounded-lg bg-black/70 border border-white/20 text-white hover:border-[#E52421] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setClimbingIdx((prev) => (prev + 1) % climbingImages.length)}
                    className="p-2 rounded-lg bg-black/70 border border-white/20 text-white hover:border-[#E52421] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="absolute bottom-4 left-4 font-mono text-xs text-white/80 uppercase tracking-widest">
                FALAISE & BLOC // ARCHIVE {climbingIdx + 1}/{climbingImages.length}
              </span>
            </div>
          </div>

          {/* Narrative & In-Depth Explanation */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#E52421] tracking-widest uppercase font-bold">
                ESCALADE DE VOIE & DE BLOC
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
                DOMPTER <span className="text-[#E52421]">LE VIDE</span>
              </h2>
              <p className="font-mono text-xs text-[#9E9EA8] tracking-wider uppercase">
                FORCE DIGITALE • GESTION DU VIDE • LECTURE TACTIQUE
              </p>
            </div>

            <p className="font-body text-base text-[#9E9EA8] leading-relaxed">
              Des falaises calcaires surplombant la baie d'Oran jusqu'aux structures artificielles de bloc, la section Escalade vous apprend à lire le rocher, poser vos appuis avec une précision millimétrique et vaincre la gravité. Tout le matériel de sécurité répond aux normes internationales UIAA les plus strictes.
            </p>

            {/* Core Modules Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-white/10 bg-[#121218]/80">
                <span className="block font-display font-bold text-sm text-white uppercase mb-1">
                  Voie & Hauteur
                </span>
                <span className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                  Moulinette et grimpe en tête assurée par cordes dynamiques pour surmonter les grandes parois.
                </span>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-[#121218]/80">
                <span className="block font-display font-bold text-sm text-white uppercase mb-1">
                  Bloc & Puissance
                </span>
                <span className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                  Passages courts et intenses à faible hauteur protégés par crash-pads pour forger la force pure.
                </span>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/70">FORCE RELATIVE & CONCENTRATION</span>
                <span className="text-[#E52421] font-bold">96%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#E52421] rounded-full w-[96%] shadow-[0_0_8px_#E52421]" />
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(229,36,33,0.4)] hover:scale-105 active:scale-95 group"
              >
                <span>Rejoindre la section Escalade</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          DISCIPLINE 03: SLACKLINE & HIGHLINE (BALANCE)
         ======================================================== */}
      <section id="slackline" className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">

        {/* Technical Circuit Node Marker */}
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 font-mono text-xs text-[#E52421] tracking-widest uppercase">
            <span className="w-3 h-3 rounded-full bg-[#E52421] shadow-[0_0_12px_#E52421]" />
            <span className="px-3 py-1 rounded bg-[#E52421]/10 border border-[#E52421]/30">
              CIRCUIT NODE // 03 : TENSION LINE BALANCE
            </span>
          </div>
          <span className="font-mono text-xs text-white/30 hidden sm:block">
            PROPRIOCEPTION • FOCUS • HIGHLINE
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Narrative & In-Depth Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#E52421] tracking-widest uppercase font-bold">
                MAÎTRISE DE L'ÉQUILIBRE DYNAMIQUE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
                SLACKLINE <span className="text-[#E52421]">& HIGHLINE</span>
              </h2>
              <p className="font-mono text-xs text-[#9E9EA8] tracking-wider uppercase">
                SANGLE EN TENSION • GAINAGE PROFOND • SILENCE INTÉRIEUR
              </p>
            </div>

            <p className="font-body text-base text-[#9E9EA8] leading-relaxed">
              Marcher sur une sangle synthétique de 25 mm tendue entre deux ancrages est une véritable méditation active. La slackline développe les muscles stabilisateurs profonds de la cheville, du bassin et de la colonne, tout en apprenant à synchroniser sa respiration pour neutraliser les oscillations de la sangle.
            </p>

            {/* Core Modalities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#121218]/80 text-center">
                <span className="block font-display font-bold text-xs text-white uppercase mb-1">
                  Baseline
                </span>
                <span className="font-body text-[11px] text-[#9E9EA8]">
                  Initiation au sol dans les parcs d'Oran.
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#121218]/80 text-center">
                <span className="block font-display font-bold text-xs text-white uppercase mb-1">
                  Waterline
                </span>
                <span className="font-body text-[11px] text-[#9E9EA8]">
                  Sangle tendue au-dessus des criques marines.
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#121218]/80 text-center">
                <span className="block font-display font-bold text-xs text-[#E52421] uppercase mb-1">
                  Highline
                </span>
                <span className="font-body text-[11px] text-[#9E9EA8]">
                  Traversée du vide en falaise avec baudrier et leash.
                </span>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/70">PROPRIOCEPTION & MAÎTRISE NERVEUSE</span>
                <span className="text-[#E52421] font-bold">99%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#E52421] rounded-full w-[99%] shadow-[0_0_8px_#E52421]" />
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(229,36,33,0.4)] hover:scale-105 active:scale-95 group"
              >
                <span>Rejoindre la section Slackline</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Photo Gallery Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#E52421]/30 shadow-2xl bg-black/40 group">
              <Image
                src="/images/hero/hero-trail.jpg"
                alt="Slackline ADD Oran Action"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 font-mono text-xs text-white/80 uppercase tracking-widest">
                ADD ORAN // ÉQUILIBRE SUR SANGLE
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          DISCIPLINE 04: RANDONNÉE, TREKKING & TRAIL
         ======================================================== */}
      <section id="trekking" className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0B0B10]">

        {/* Technical Circuit Node Marker */}
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 font-mono text-xs text-[#E52421] tracking-widest uppercase">
            <span className="w-3 h-3 rounded-full bg-[#E52421] shadow-[0_0_12px_#E52421]" />
            <span className="px-3 py-1 rounded bg-[#E52421]/10 border border-[#E52421]/30">
              CIRCUIT NODE // 04 : WILD EXPEDITIONS
            </span>
          </div>
          <span className="font-mono text-xs text-white/30 hidden sm:block">
            MURDJADJO • SANTA CRUZ • MADAGH RIDGES
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Photo Gallery Visual (Left on desktop) */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#E52421]/30 shadow-2xl bg-black/40 group">
              <Image
                src={getSrc(trailImages[0]) || "/images/disciplines/discipline-trail.jpg"}
                alt="Randonnée ADD Oran Nature"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 font-mono text-xs text-white/80 uppercase tracking-widest">
                EXPÉDITIONS & BIVOUACS NATURE // ORAN
              </span>
            </div>
          </div>

          {/* Narrative & In-Depth Explanation */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#E52421] tracking-widest uppercase font-bold">
                EXPÉDITIONS NATURE & ENDURANCE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white uppercase leading-none">
                RANDONNÉE <span className="text-[#E52421]">& TRAIL</span>
              </h2>
              <p className="font-mono text-xs text-[#9E9EA8] tracking-wider uppercase">
                BIVOUACS EN AUTONOMIE • SENTIERS CÔTIERS • TOPOGRAPHIE
              </p>
            </div>

            <p className="font-body text-base text-[#9E9EA8] leading-relaxed">
              Quittez le bitume et partez à la conquête des massifs sauvages oranais. La section Trekking & Trail propose des sorties adaptées à tous les niveaux, des randonnées panoramiques le long des crêtes de Murdjadjo jusqu'aux treks engagés de plusieurs jours en autonomie avec bivouac sous les étoiles.
            </p>

            {/* Core Modalities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-white/10 bg-[#121218]/80">
                <span className="block font-display font-bold text-sm text-white uppercase mb-1">
                  Bivouacs & Autonomie
                </span>
                <span className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                  Apprentissage de l'orientation, gestion du sac à dos de trek, sécurité outdoor et nuits en pleine nature.
                </span>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-[#121218]/80">
                <span className="block font-display font-bold text-sm text-white uppercase mb-1">
                  Trail Running Tout-Terrain
                </span>
                <span className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                  Course sur sentiers accidentés et dénivelés côtiers pour forger un souffle et une endurance inépuisables.
                </span>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/70">ENDURANCE CARDIAQUE & RÉSILIENCE</span>
                <span className="text-[#E52421] font-bold">95%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#E52421] rounded-full w-[95%] shadow-[0_0_8px_#E52421]" />
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(229,36,33,0.4)] hover:scale-105 active:scale-95 group"
              >
                <span>Rejoindre la section Randonnée</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
