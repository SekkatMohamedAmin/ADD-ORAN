"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { CompositeDiamondEmblem } from "./CompositeDiamondEmblem";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// ============================================================================
// Trilingual Discipline Branch Content
// ============================================================================

interface DisciplineData {
  id: string;
  number: string;
  imageSrc: string;
  imageAlt: { fr: string; en: string; ar: string };
  href: string;
  title: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  tags: { fr: string[]; en: string[]; ar: string[] };
}

const DISCIPLINES_DATA: DisciplineData[] = [
  {
    id: "parkour",
    number: "01",
    imageSrc: "/images/disciplines/generated/discipline_parkour.png",
    imageAlt: {
      fr: "Silhouette Parkour ADD Oran",
      en: "ADD Oran Parkour Athlete Silhouette",
      ar: "شعار رياضة الباركور وهران",
    },
    href: "/register?discipline=parkour",
    title: {
      fr: "PARKOUR & ART DU DÉPLACEMENT",
      en: "PARKOUR & ART DU DÉPLACEMENT",
      ar: "باركور وفن الانتقال الحركي",
    },
    description: {
      fr: "Maîtrise du corps dans l'espace urbain et naturel. Franchissement d'obstacles, équilibre dynamique et puissance instinctive.",
      en: "Mastery of the body in urban and natural space. Obstacle crossing, dynamic balance, and instinctive power.",
      ar: "التحكم الكامل في حركة الجسد في البيئة الحضرية والطبيعية. تجاوز الموانع، التوازن الديناميكي والقوة الفطرية.",
    },
    tags: {
      fr: ["Franchissement", "Acrobatie", "Zone Urbaine"],
      en: ["Obstacle Vault", "Acrobatics", "Urban Space"],
      ar: ["تجاوز الموانع", "الحركات البهلوانية", "المحيط الحضري"],
    },
  },
  {
    id: "climbing",
    number: "02",
    imageSrc: "/images/disciplines/generated/discipline_climbing.png",
    imageAlt: {
      fr: "Silhouette Escalade ADD Oran",
      en: "ADD Oran Climbing Athlete Silhouette",
      ar: "شعار رياضة التسلق وهران",
    },
    href: "/register?discipline=climbing",
    title: {
      fr: "ESCALADE & BLOC",
      en: "CLIMBING & BOULDERING",
      ar: "التسلق وتسلق الكتل الصخرية",
    },
    description: {
      fr: "Progression verticale sur falaises naturelles et voies sportives. Renforcement musculaire ciblé, gestion du vide et maîtrise de cordée.",
      en: "Vertical progression across natural cliffs and sport routes. Targeted strength, height composure, and certified belay systems.",
      ar: "الارتقاء العمودي على الجروف الصخرية الطبيعية والمسارات الرياضية. بناء القوة العضلية، التحكم في الارتفاع والتأمين بالحبال.",
    },
    tags: {
      fr: ["Falaise Naturelle", "Voie & Bloc", "Matériel Certifié"],
      en: ["Natural Cliffs", "Bouldering", "Certified Gear"],
      ar: ["جروف طبيعية", "مسارات وكتل", "عتاد معتمد"],
    },
  },
  {
    id: "slackline",
    number: "03",
    imageSrc: "/images/disciplines/generated/discipline_slacklining.png",
    imageAlt: {
      fr: "Silhouette Slacklining ADD Oran",
      en: "ADD Oran Slacklining Athlete Silhouette",
      ar: "شعار رياضة السلاكلاين وهران",
    },
    href: "/register?discipline=slackline",
    title: {
      fr: "SLACKLINE & HIGHLINE",
      en: "SLACKLINE & HIGHLINE",
      ar: "سلاكلاين والمشي على الحبال",
    },
    description: {
      fr: "L'art de l'équilibre sur sangle suspendue. Développement de la proprioception, concentration profonde et travail postural continu.",
      en: "The art of equilibrium on suspended webbing. Core proprioception, laser concentration, and continuous postural mastery.",
      ar: "فن التوازن على الأشرطة المعلقة في الهواء. تعزيز الإدراك الحسي، التركيز الذهني العميق وضبط وضعية الجسد.",
    },
    tags: {
      fr: ["Sangle Tendue", "Highline", "Proprioception"],
      en: ["Suspended Webbing", "Highline", "Proprioception"],
      ar: ["أشرطة مشدودة", "هاي لاين", "توازن دقيق"],
    },
  },
  {
    id: "trekking",
    number: "04",
    imageSrc: "/images/disciplines/generated/discipline_trekking.png",
    imageAlt: {
      fr: "Silhouette Trekking ADD Oran",
      en: "ADD Oran Trekking Athlete Silhouette",
      ar: "شعار التجوال الجبلي وهران",
    },
    href: "/register?discipline=trekking",
    title: {
      fr: "TREKKING & EXPÉDITION",
      en: "TREKKING & EXPEDITIONS",
      ar: "التجوال والاستكشاف الجبلي",
    },
    description: {
      fr: "Exploration des reliefs sauvages et traversées en autonomie. Lecture de terrain, esprit d'équipe et immersion totale dans les massifs.",
      en: "Exploration of untamed mountains and self-sufficient crossings. Topographic reading, team spirit, and total mountain immersion.",
      ar: "استكشاف التضاريس الوعرة والمسارات الجبلية في استقلالية تامة. قراءة المسالك، العمل الجماعي والاندماج الكامل مع الطبيعة.",
    },
    tags: {
      fr: ["Traversée", "Orientation", "Massifs Sauvages"],
      en: ["Trail Crossing", "Navigation", "Wild Peaks"],
      ar: ["عبور المسالك", "الملاحة الجبلية", "قمم برية"],
    },
  },
  {
    id: "trail",
    number: "05",
    imageSrc: "/images/disciplines/generated/discipline_trail_running.png",
    imageAlt: {
      fr: "Silhouette Trail Running ADD Oran",
      en: "ADD Oran Trail Running Athlete Silhouette",
      ar: "شعار ركض المسارات وهران",
    },
    href: "/register?discipline=trail",
    title: {
      fr: "TRAIL RUNNING & COURSE NATURE",
      en: "TRAIL RUNNING & NATURE RACING",
      ar: "ركض المسارات الجبلية والطبيعية",
    },
    description: {
      fr: "Course à pied tout-terrain en milieu naturel. Gestion de l'effort en côte, vitesse en descente et dépassement de soi au fil des kilomètres.",
      en: "All-terrain trail running across wilderness courses. Uphill pacing, downhill momentum, and pushing physical limits with every mile.",
      ar: "الجري في المسالك الوعرة والطبيعة المفتوحة. إدارة الجهد في المرتفعات، السرعة في المنحدرات وتخطي الحدود مع كل كيلومتر.",
    },
    tags: {
      fr: ["Sentiers Tout-Terrain", "Dénivelé Positif", "Endurance Pure"],
      en: ["All-Terrain Trails", "Elevation Gain", "Pure Endurance"],
      ar: ["مسارات وعرة", "منحدرات جبلية", "قدرة تحمل"],
    },
  },
];

const STRINGS = {
  fr: {
    heroTag: "COLLECTIF DES SPORTS D'ACTION & DE NATURE",
    heroDesc:
      "Un écosystème unique où chaque discipline découle d'un même esprit : mouvement libre, maîtrise technique et dépassement de soi.",
    exploreCta: "Explorer les disciplines",
    joinCta: "Rejoindre la section",
    convergenceTag: "CONTINUITÉ NATURELLE",
    convergenceTitle: "LES DISCIPLINES EN ACTION",
    convergenceDesc:
      "Retrouvez nos athlètes, compétitions et rassemblements immortalisés sur le terrain.",
  },
  en: {
    heroTag: "ACTION & OUTDOOR SPORTS COLLECTIVE",
    heroDesc:
      "A unique ecosystem where every discipline shares the same ethos: free movement, technical mastery, and pushing personal limits.",
    exploreCta: "Explore disciplines",
    joinCta: "Join discipline",
    convergenceTag: "NATURAL CONTINUITY",
    convergenceTitle: "DISCIPLINES IN ACTION",
    convergenceDesc:
      "Discover our athletes, competitions, and gatherings captured live on the field.",
  },
  ar: {
    heroTag: "تجمع الرياضات الحركية والطبيعية في وهران",
    heroDesc:
      "بيئة رياضية متكاملة تنبع جميع تخصصاتها من روح واحدة: حرية الحركة، التمكن التقني، وتجاوز الحدود الشخصية.",
    exploreCta: "استكشف التخصصات",
    joinCta: "الانضمام للتخصص",
    convergenceTag: "امتداد طبيعي",
    convergenceTitle: "التخصصات في الميدان",
    convergenceDesc:
      "شاهد رياضيينا ومشاركاتهم في البطولات والتجمعات الميدانية الموثقة.",
  },
};

export function DisciplineBranchScroll() {
  const { locale, isRtl } = useLanguage();
  const strings = STRINGS[locale] || STRINGS.fr;
  const isArabic = locale === "ar";

  const containerRef = useRef<HTMLDivElement>(null);
  const branchesSectionRef = useRef<HTMLElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);

  // Progressive Zigzag Path States
  const [pathData, setPathData] = useState<string>("");
  const [totalLength, setTotalLength] = useState<number>(0);
  const [strokeOffset, setStrokeOffset] = useState<number>(0);
  const [headPos, setHeadPos] = useState<{ x: number; y: number } | null>(null);

  // Measure and compute the 3D-style progressive zigzag path
  // Strictly curves towards whichever side houses the Kite Image!
  const updateZigzagPath = useCallback(() => {
    const section = branchesSectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const isDesktop = width >= 1024;
    const points: { x: number; y: number }[] = [];

    // 0. Start Point (Top Center)
    points.push({ x: width * 0.5, y: 10 });

    // 1 to 5: Discipline Rows
    // On Desktop:
    // Section 1 (index 0): Image on LEFT  -> curves to LEFT (0.28)
    // Section 2 (index 1): Image on RIGHT -> curves to RIGHT (0.72)
    // Section 3 (index 2): Image on LEFT  -> curves to LEFT (0.28)
    // Section 4 (index 3): Image on RIGHT -> curves to RIGHT (0.72)
    // Section 5 (index 4): Image on LEFT  -> curves to LEFT (0.28)
    DISCIPLINES_DATA.forEach((disc, index) => {
      const el = document.getElementById(`discipline-branch-${disc.number}`);
      if (el) {
        const elRect = el.getBoundingClientRect();
        const y = elRect.top - rect.top + elRect.height * 0.5;
        const isImageOnLeftDesktop = index % 2 === 0;

        let x = width * 0.5;
        if (isDesktop) {
          x = isImageOnLeftDesktop ? width * 0.28 : width * 0.72;
        } else {
          // On mobile, gentle subtle wave
          x = isImageOnLeftDesktop ? width * 0.42 : width * 0.58;
        }

        points.push({ x, y });
      }
    });

    // 6. Convergence End Point (Bottom Center)
    const endEl = document.getElementById("convergence-bottom-node");
    if (endEl) {
      const endRect = endEl.getBoundingClientRect();
      const endY = endRect.top - rect.top + endRect.height * 0.5;
      points.push({ x: width * 0.5, y: endY });
    } else {
      points.push({ x: width * 0.5, y: height - 60 });
    }

    if (points.length < 2) return;

    // Construct smooth cubic bezier zigzag spline
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dy = p2.y - p1.y;
      const cp1x = p1.x;
      const cp1y = p1.y + dy * 0.5;
      const cp2x = p2.x;
      const cp2y = p2.y - dy * 0.5;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    setPathData(d);
  }, []);

  // Recalculate path on mount and resize
  useEffect(() => {
    updateZigzagPath();

    const handleResize = () => {
      updateZigzagPath();
    };

    window.addEventListener("resize", handleResize);
    const timeout = setTimeout(updateZigzagPath, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [updateZigzagPath]);

  // Compute length when pathData changes
  useEffect(() => {
    if (activePathRef.current && pathData) {
      const len = activePathRef.current.getTotalLength();
      setTotalLength(len);
      setStrokeOffset(len);
    }
  }, [pathData]);

  // Progressive scroll handler with requestAnimationFrame throttling for zero latency
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (branchesSectionRef.current && activePathRef.current && totalLength > 0) {
            const rect = branchesSectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const startTrigger = viewportHeight * 0.75;
            const progressDistance = startTrigger - rect.top;
            const totalScrollableDistance = rect.height * 0.88;

            let progress = progressDistance / totalScrollableDistance;
            progress = Math.max(0, Math.min(1, progress));

            const currentOffset = totalLength * (1 - progress);
            setStrokeOffset(currentOffset);

            try {
              const point = activePathRef.current.getPointAtLength(totalLength * progress);
              setHeadPos({ x: point.x, y: point.y });
            } catch {
              // SVG length fallback
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalLength]);

  const scrollToBranches = () => {
    const firstBranch = document.getElementById("discipline-branch-01");
    if (firstBranch) {
      firstBranch.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-10 select-none">
      {/* ========================================================
          1. HERO ORIGIN HUB: 5-SECTION COMPOSITE KITE EMBLEM
          (Bonded 5-discipline shape with 1-word side labels)
         ======================================================== */}
      <section className="relative pt-16 sm:pt-24 pb-14 sm:pb-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Ambient Multi-Chromatic Aura (Casse le rouge avec Cyan & Or Solaire) */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] bg-[#06B6D4]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] bg-[#FFD21F]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-[#E52421]/10 rounded-full blur-[130px] pointer-events-none" />

        {/* 5-Section Kite Emblem Component */}
        <CompositeDiamondEmblem />

        {/* Club Titles & Identity */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-3 mt-4">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tight text-white uppercase leading-none">
            ADD <span className="text-[#E52421]">ORAN</span>
          </h1>

          <p
            className={`text-xs sm:text-sm text-white/80 uppercase tracking-widest ${
              isArabic ? "font-arabic font-bold" : "font-mono"
            }`}
          >
            {strings.heroTag}
          </p>

          <p
            className={`text-sm sm:text-base text-[#9E9EA8] max-w-lg mx-auto pt-2 leading-relaxed ${
              isArabic ? "font-arabic" : "font-body"
            }`}
          >
            {strings.heroDesc}
          </p>
        </div>

        {/* Downward Pulse Trigger */}
        <div
          className="mt-8 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToBranches}
        >
          <span
            className={`text-[11px] uppercase tracking-widest text-[#E52421] group-hover:text-white transition-colors ${
              isArabic ? "font-arabic font-bold" : "font-mono"
            }`}
          >
            {strings.exploreCta}
          </span>
          <div className="w-8 h-8 rounded-full border border-[#E52421]/40 flex items-center justify-center text-[#E52421] group-hover:border-[#E52421] group-hover:bg-[#E52421]/15 group-hover:translate-y-1 transition-all">
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ========================================================
          2. PROGRESSIVE SCROLLABLE ZIGZAG CIRCUIT LINE & DISCIPLINES
          (Desktop: Alternating | Mobile: Always Image then Text)
         ======================================================== */}
      <section
        ref={branchesSectionRef}
        id="disciplines"
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 overflow-visible"
      >
        {/* ========================================================
            3D PROGRESSIVE ZIGZAG SVG CIRCUIT RAIL
           ======================================================== */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="zigzagProgressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#FFD21F" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#E52421" stopOpacity="1" />
              <stop offset="75%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF3030" stopOpacity="0.9" />
            </linearGradient>
            <filter id="neonRailGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dormant / Guide Zigzag Track (Subtle Dashed Multi-Tone Rail) */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="url(#zigzagProgressGrad)"
              strokeOpacity="0.22"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          )}

          {/* Active Progressive Glowing Zigzag Line */}
          {pathData && (
            <path
              ref={activePathRef}
              d={pathData}
              fill="none"
              stroke="url(#zigzagProgressGrad)"
              strokeWidth="3.5"
              filter="url(#neonRailGlow)"
              strokeDasharray={totalLength || 1000}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
          )}

          {/* Kinetic Energy Head Particle riding the progressive tip */}
          {headPos && strokeOffset < totalLength && (
            <g transform={`translate(${headPos.x}, ${headPos.y})`}>
              <circle r="11" fill="#06B6D4" opacity="0.35" className="animate-ping" />
              <circle r="5" fill="#FFFFFF" stroke="#FFD21F" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* ========================================================
            DISCIPLINE ROWS
            Mobile: Always Image first, then Text (no double-image)
            Desktop: Alternates Image Left / Text Left
           ======================================================== */}
        <div className="relative z-10 space-y-32 sm:space-y-48">
          {DISCIPLINES_DATA.map((discipline, index) => (
            <DisciplineBranchRow
              key={discipline.id}
              discipline={discipline}
              index={index}
              joinLabel={strings.joinCta}
            />
          ))}
        </div>

        {/* ========================================================
            BOTTOM CONVERGENCE NODE INTO ARCHIVES
           ======================================================== */}
        <div
          id="convergence-bottom-node"
          className="relative mt-28 sm:mt-36 flex flex-col items-center justify-center text-center z-10"
        >
          <div className="w-9 h-9 rounded-full bg-[#07070A] border-2 border-[#E52421] flex items-center justify-center shadow-[0_0_22px_#E52421] mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-[#E52421] animate-ping" />
          </div>
          <span
            className={`text-xs uppercase tracking-widest text-[#E52421] ${
              isArabic ? "font-arabic font-bold" : "font-mono"
            }`}
          >
            {strings.convergenceTag}
          </span>
          <h3
            className={`text-2xl sm:text-3xl text-white uppercase mt-1 ${
              isArabic ? "font-arabic font-black" : "font-display font-black"
            }`}
          >
            {strings.convergenceTitle}
          </h3>
          <p
            className={`text-xs sm:text-sm text-[#9E9EA8] max-w-md mx-auto mt-2 ${
              isArabic ? "font-arabic" : "font-body"
            }`}
          >
            {strings.convergenceDesc}
          </p>
          <div className="w-[2px] h-10 bg-gradient-to-b from-[#E52421] to-transparent shadow-[0_0_10px_#E52421] mt-3" />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Discipline Branch Row
// ---------------------------------------------------------------------------
function DisciplineBranchRow({
  discipline,
  index,
  joinLabel,
}: {
  discipline: DisciplineData;
  index: number;
  joinLabel: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isImageOnLeftDesktop = index % 2 === 0;

  return (
    <div
      ref={rowRef}
      id={`discipline-branch-${discipline.number}`}
      className="relative group"
    >
      {/* Node Vertex Accent on Zigzag Rail */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
        <div
          className={`w-6 h-6 rounded-full bg-[#07070A] border-2 transition-all duration-700 flex items-center justify-center ${
            isVisible
              ? "border-[#E52421] shadow-[0_0_18px_#E52421]"
              : "border-white/20"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-700 ${
              isVisible ? "bg-white" : "bg-white/30"
            }`}
          />
        </div>
      </div>

      {/* Main Grid:
          - Mobile: Flex column with Image first (order-1) & Text second (order-2)
          - Desktop: 12-col grid with alternating orders
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-14 items-center">
        {/* ========================================================
            DESKTOP COLUMN 1 (Left on Desktop | Controlled order on Mobile)
           ======================================================== */}
        <div
          className={`lg:col-span-5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            isImageOnLeftDesktop
              ? "order-1 lg:order-1" // Mobile: Image first. Desktop: Image on Left.
              : "order-2 lg:order-1 lg:text-right" // Mobile: Text second. Desktop: Text on Left.
          } ${
            isVisible
              ? "opacity-100 translate-x-0 scale-100 blur-0"
              : "opacity-0 -translate-x-28 sm:-translate-x-56 scale-90 blur-sm pointer-events-none"
          }`}
        >
          {isImageOnLeftDesktop ? (
            <DisciplineKiteCard discipline={discipline} />
          ) : (
            <DisciplineTextCard
              discipline={discipline}
              isLeft={true}
              joinLabel={joinLabel}
            />
          )}
        </div>

        {/* Center Spacer for the Glowing Zigzag Rail (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-2 relative h-10 order-2 lg:order-2" />

        {/* ========================================================
            DESKTOP COLUMN 3 (Right on Desktop | Controlled order on Mobile)
           ======================================================== */}
        <div
          className={`lg:col-span-5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            isImageOnLeftDesktop
              ? "order-2 lg:order-3 lg:text-left" // Mobile: Text second. Desktop: Text on Right.
              : "order-1 lg:order-3" // Mobile: Image first. Desktop: Image on Right.
          } ${
            isVisible
              ? "opacity-100 translate-x-0 scale-100 blur-0"
              : "opacity-0 translate-x-28 sm:translate-x-56 scale-90 blur-sm pointer-events-none"
          }`}
        >
          {isImageOnLeftDesktop ? (
            <DisciplineTextCard
              discipline={discipline}
              isLeft={false}
              joinLabel={joinLabel}
            />
          ) : (
            <DisciplineKiteCard discipline={discipline} />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Visual Badge Shaped as a "Premium Athletic Kite"
// ---------------------------------------------------------------------------
function DisciplineKiteCard({ discipline }: { discipline: DisciplineData }) {
  const { locale } = useLanguage();
  const altText = discipline.imageAlt[locale] || discipline.imageAlt.fr;

  return (
    <div className="relative flex justify-center py-6 select-none">
      <div className="relative group/kite">
        {/* 1. Ambient Red Glow Silhouette behind the Kite */}
        <div
          className="absolute -inset-4 bg-gradient-to-b from-[#E52421]/30 via-[#E52421]/10 to-transparent blur-2xl group-hover/kite:blur-3xl transition-all duration-700 pointer-events-none"
          style={{
            clipPath: "polygon(50% 0%, 100% 36%, 50% 100%, 0% 36%)",
          }}
        />

        {/* 2. Outer Kite Border Shell (Athletic Cerf-Volant Geometry) */}
        <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center transition-transform duration-700 group-hover/kite:scale-105 group-hover/kite:-translate-y-2">
          {/* SVG Frame with Crisp Kite Polygon Borders & Vertex Accent Nodes */}
          <svg
            viewBox="0 0 300 400"
            className="absolute inset-0 w-full h-full drop-shadow-2xl overflow-visible pointer-events-none"
          >
            <defs>
              <linearGradient id={`kiteGrad-${discipline.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFF2F1" />
              </linearGradient>
            </defs>

            {/* Ambient Outer Halo Path */}
            <polygon
              points="150,4 296,144 150,396 4,144"
              fill="none"
              stroke="#E52421"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Solid Pure-White Kite Body */}
            <polygon
              points="150,12 288,144 150,388 12,144"
              fill={`url(#kiteGrad-${discipline.id})`}
              stroke="#E52421"
              strokeWidth="3"
              className="group-hover/kite:stroke-[#FF3030] transition-colors duration-500"
            />

            {/* Internal Geometric Kite Spars */}
            <line x1="150" y1="12" x2="150" y2="388" stroke="#E52421" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="12"  y1="144" x2="288" y2="144" stroke="#E52421" strokeOpacity="0.25" strokeWidth="1.5" />

            {/* Vertex Accent Nodes (Top apex, side shoulders, bottom tail) */}
            <circle cx="150" cy="12"  r="4.5" fill="#E52421" />
            <circle cx="288" cy="144" r="4.5" fill="#E52421" />
            <circle cx="12"  cy="144" r="4.5" fill="#E52421" />
            <circle cx="150" cy="388" r="5"   fill="#E52421" />
          </svg>

          {/* Silhouette Image perfectly positioned inside the kite */}
          <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center p-2 group-hover/kite:scale-105 transition-transform duration-500">
            <Image
              src={discipline.imageSrc}
              alt={altText}
              width={260}
              height={260}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 180px, 260px"
              className="w-full h-full object-contain filter drop-shadow group-hover/kite:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Text Details Card (Trilingual & RTL Aware)
// ---------------------------------------------------------------------------
function DisciplineTextCard({
  discipline,
  isLeft,
  joinLabel,
}: {
  discipline: DisciplineData;
  isLeft: boolean;
  joinLabel: string;
}) {
  const { locale, isRtl } = useLanguage();
  const isArabic = locale === "ar";

  const title = discipline.title[locale] || discipline.title.fr;
  const description = discipline.description[locale] || discipline.description.fr;
  const tags = discipline.tags[locale] || discipline.tags.fr;

  return (
    <div
      className={`space-y-4 max-w-md ${
        isRtl
          ? isLeft
            ? "lg:mr-auto lg:text-left text-right"
            : "lg:ml-auto lg:text-right text-right"
          : isLeft
          ? "lg:ml-auto lg:text-right text-left"
          : "lg:mr-auto lg:text-left text-left"
      }`}
    >
      {/* Title */}
      <h3
        className={`text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight group-hover:text-[#E52421] transition-colors ${
          isArabic ? "font-arabic font-black" : "font-display font-black uppercase"
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`text-sm sm:text-base text-[#9E9EA8] leading-relaxed ${
          isArabic ? "font-arabic" : "font-body"
        }`}
      >
        {description}
      </p>

      {/* Athletic Tags */}
      <div
        className={`flex flex-wrap gap-2 pt-1 ${
          isRtl
            ? isLeft
              ? "lg:justify-start justify-end"
              : "lg:justify-end justify-end"
            : isLeft
            ? "lg:justify-end justify-start"
            : "lg:justify-start justify-start"
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/80 uppercase tracking-wider ${
              isArabic ? "font-arabic font-bold" : "font-mono"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Sleek CTA Button */}
      <div
        className={`pt-3 flex ${
          isRtl
            ? isLeft
              ? "lg:justify-start justify-end"
              : "lg:justify-end justify-end"
            : isLeft
            ? "lg:justify-end justify-start"
            : "lg:justify-start justify-start"
        }`}
      >
        <Link
          href={discipline.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-[#E52421] text-white font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-white/15 hover:border-transparent shadow-lg group/btn hover:scale-105 active:scale-95"
        >
          <span className={isArabic ? "font-arabic font-bold" : ""}>
            {joinLabel}
          </span>
          <ArrowUpRight
            className={`w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform ${
              isRtl ? "rotate-[-90deg]" : ""
            }`}
          />
        </Link>
      </div>
    </div>
  );
}
