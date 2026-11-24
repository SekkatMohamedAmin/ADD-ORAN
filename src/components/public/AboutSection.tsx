"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// ============================================================================
// Professional Flaticon-Style Bespoke Vector Icons
// ============================================================================

function FlaticonMovement({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Obstacle / Platform */}
      <rect x="6" y="44" width="22" height="14" rx="3" fill="#E52421" fillOpacity="0.25" stroke="#E52421" strokeWidth="2.5" />
      <line x1="12" y1="51" x2="22" y2="51" stroke="#E52421" strokeWidth="2" strokeLinecap="round" />
      {/* Kinetic Speed Lines */}
      <path d="M4 32C10 32 16 28 20 22" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M8 24C12 24 16 20 19 16" stroke="#E52421" strokeWidth="2" strokeLinecap="round" />
      {/* Dynamic Leaping Athlete Silhouette */}
      <circle cx="44" cy="14" r="5" fill="#FFFFFF" />
      <path d="M36 24L43 19L50 25L57 22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43 19L39 33L47 38L53 49" stroke="#E52421" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M39 33L31 38L24 33" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Energy Spark */}
      <circle cx="58" cy="12" r="2" fill="#E52421" />
    </svg>
  );
}

function FlaticonSecurity({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Shield Frame */}
      <path d="M32 6L49 13C49 28 43 45 32 54C21 45 15 28 15 13L32 6Z" fill="#E52421" fillOpacity="0.15" stroke="#E52421" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Inner Shield Contour */}
      <path d="M32 13L43 18C43 28 38 40 32 46C26 40 21 28 21 18L32 13Z" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.5" />
      {/* Central Certified Checkmark */}
      <path d="M26 31L31 36L40 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Ribbon / Star Accent */}
      <circle cx="32" cy="20" r="2" fill="#E52421" />
      <path d="M29 55L24 60L26 53" stroke="#E52421" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 55L40 60L38 53" stroke="#E52421" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlaticonCommunity({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mentor / Adult Athlete (Center) */}
      <circle cx="32" cy="15" r="5" fill="#E52421" />
      <path d="M23 31C23 26 27 23 32 23C37 23 41 26 41 31V37H23V31Z" fill="#E52421" fillOpacity="0.25" stroke="#E52421" strokeWidth="2" />
      {/* Junior Athlete (Right - "À partir de 6 ans") */}
      <circle cx="48" cy="23" r="4" fill="#FFFFFF" />
      <path d="M41 37C41 33 44 31 48 31C52 31 55 33 55 37V42H41V37Z" stroke="#FFFFFF" strokeWidth="2" />
      {/* Companion Athlete (Left) */}
      <circle cx="16" cy="23" r="4" fill="#FFFFFF" fillOpacity="0.8" />
      <path d="M9 37C9 33 12 31 16 31C20 31 23 33 23 37V42H9V37Z" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="2" />
      {/* Solidarity Base Arch */}
      <path d="M12 50C24 45 40 45 52 50" stroke="#E52421" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="46" r="2" fill="#FFFFFF" />
    </svg>
  );
}

function FlaticonNature({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun / Aura over Oran massifs */}
      <circle cx="44" cy="18" r="6" fill="#E52421" fillOpacity="0.2" stroke="#E52421" strokeWidth="2" />
      {/* Back Mountain Ridge */}
      <path d="M25 21L43 47H7L25 21Z" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" strokeLinejoin="round" />
      {/* Forefront Mountain Peak */}
      <path d="M38 27L57 53H19L38 27Z" fill="#E52421" fillOpacity="0.2" stroke="#E52421" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Snow / Light Ridge on Peak */}
      <path d="M38 27L43 35L38 38L33 35L38 27Z" fill="#FFFFFF" />
      {/* Wilderness Trail */}
      <path d="M33 53C33 49 39 46 41 43" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
    </svg>
  );
}

// ============================================================================
// Trilingual Content Dictionaries (FR, EN, AR)
// ============================================================================

const CONTENT = {
  fr: {
    badge: "NOTRE HISTOIRE & IDENTITÉ",
    titlePart1: "QUI SOMMES-",
    titlePart2: "NOUS ?",
    description:
      "Fondé en 2018 à Oran, le collectif ADD Oran est l'organisation sportive pionnière dédiée à l'Art du Déplacement, au Parkour, à l'Escalade, à la Slackline et au Trail en Algérie. Nous transformons l'environnement urbain et naturel en écoles de courage, de rigueur et d'entraide.",
    pillars: [
      {
        icon: FlaticonMovement,
        title: "Philosophie & Mouvement",
        subtitle: "Être fort pour être utile",
        desc: "Héritiers directs de la Méthode Naturelle et du Parkour originel, nous cultivons la maîtrise du corps dans l'espace : franchir les obstacles physiques et mentaux avec fluidité, humilité et efficacité.",
      },
      {
        icon: FlaticonSecurity,
        title: "Encadrement Certifié",
        subtitle: "Sécurité & Longévité",
        desc: "Chaque entraînement est structuré selon des protocoles rigoureux : renforcement tendineux, biomécanique de réception, gestion progressive de la hauteur et échauffement articulaire méthodique.",
      },
      {
        icon: FlaticonCommunity,
        title: "Communauté & Esprit de Famille",
        subtitle: "À partir de 6 ans",
        desc: "Dès l'âge de 6 ans et jusqu'aux adultes, chacun progresse à son rythme au sein d'une communauté soudée où le succès d'un athlète est célébré par l'ensemble du groupe.",
      },
      {
        icon: FlaticonNature,
        title: "Territoire & Éco-Responsabilité",
        subtitle: "Oran & Massifs d'Algérie",
        desc: "De la promenade Ibn Badis aux falaises du Murdjadjo et aux sentiers sauvages de l'Ouest algérien, nous promouvons un respect absolu des sites urbains et naturels que nous foulons.",
      },
    ],
    metrics: [
      { value: "+500", label: "Athlètes & Pratiquants formés" },
      { value: "05", label: "Disciplines unifiées" },
      { value: "2018", label: "Fondation pionnière à Oran" },
      { value: "100%", label: "Encadrement sécurisé & certifié" },
    ],
    cta: "Rejoindre notre académie",
  },
  en: {
    badge: "OUR STORY & IDENTITY",
    titlePart1: "WHO ARE ",
    titlePart2: "WE?",
    description:
      "Founded in 2018 in Oran, ADD Oran is the pioneer collective dedicated to the Art du Déplacement, Parkour, Climbing, Slacklining, and Trail Running in Algeria. We turn urban and natural landscapes into schools of courage, discipline, and solidarity.",
    pillars: [
      {
        icon: FlaticonMovement,
        title: "Philosophy & Movement",
        subtitle: "Be strong to be useful",
        desc: "Direct heirs of the Natural Method and original Parkour, we cultivate mastery of the body in space: overcoming physical and mental obstacles with fluidity, humility, and purpose.",
      },
      {
        icon: FlaticonSecurity,
        title: "Certified Coaching",
        subtitle: "Safety & Longevity",
        desc: "Every training session follows strict athletic protocols: tendon strengthening, landing biomechanics, progressive height conditioning, and systematic joint warmups.",
      },
      {
        icon: FlaticonCommunity,
        title: "Community & Family Spirit",
        subtitle: "From 6 years old",
        desc: "From 6 years old to adults, everyone progresses at their own pace in a supportive community where every athlete's achievement is celebrated by the whole team.",
      },
      {
        icon: FlaticonNature,
        title: "Heritage & Eco-Responsibility",
        subtitle: "Oran & Algerian Peaks",
        desc: "From the Ibn Badis promenade to the Murdjadjo cliffs and untamed trails of Western Algeria, we champion absolute respect for every urban and wilderness ground we tread.",
      },
    ],
    metrics: [
      { value: "+500", label: "Athletes & Members Trained" },
      { value: "05", label: "Unified Disciplines" },
      { value: "2018", label: "Founded in Oran" },
      { value: "100%", label: "Certified & Safe Coaching" },
    ],
    cta: "Join Our Academy",
  },
  ar: {
    badge: "تاريخنا وهويتنا الأصيلة",
    titlePart1: "مَن ",
    titlePart2: "نحن؟",
    description:
      "تأسس نادي فن الانتقال باركور وهران سنة 2018، ليكون المنظومة الرياضية الرائدة في الجزائر المكرسة لرياضات الباركور، التسلق، السلاكلاين، الركض الجبلي والتجوال. نحول الفضاءات الحضرية والطبيعية إلى مدارس للشجاعة، الانضباط والتضامن.",
    pillars: [
      {
        icon: FlaticonMovement,
        title: "الفلسفة والتحكم الحركي",
        subtitle: "كُن قوياً لتكون نافعاً",
        desc: "استمراراً للمنهج الطبيعي الأصيل، نربي في ممارسينا السيطرة الكاملة على الجسد في الفضاء، وتخطي الحواجز المادية والنفسية بمرونة وتواضع.",
      },
      {
        icon: FlaticonSecurity,
        title: "تأطير بيداغوجي معتمد",
        subtitle: "الأمان واستدامة اللياقة",
        desc: "تخضع حصصنا لبروتوكولات علمية صارمة: تقوية الأربطة والمفاصل، ميكانيكا الهبوط الآمن، والتدرج الحذر في مواجهة الارتفاعات.",
      },
      {
        icon: FlaticonCommunity,
        title: "عائلة رياضية جامعة",
        subtitle: "ابتداءً من 6 سنوات",
        desc: "مفتوح للأطفال ابتداءً من سن السادسة وحتى الكبار، حيث يتقدم كل منخرط وفق وتيرته الخاصة داخل بيئة أخوية تحتفي بنجاح الجميع.",
      },
      {
        icon: FlaticonNature,
        title: "احترام البيئة والمحيط",
        subtitle: "وهران وسلاسل الجزائر",
        desc: "من واجهة البحر وممشى ابن باديس إلى سفوح المرجاجو ومسارات الغرب الجزائري، نغرس ثقافة الحفاظ على الطبيعة ونظافة مواقع التمرين.",
      },
    ],
    metrics: [
      { value: "+500", label: "رياضي ومنخرط تكون معنا" },
      { value: "05", label: "تخصصات رياضية متكاملة" },
      { value: "2018", label: "سنة التأسيس في وهران" },
      { value: "100%", label: "تدريب مؤطر ومحمي" },
    ],
    cta: "انضم إلى أكاديميتنا",
  },
};

export function AboutSection() {
  const { locale, isRtl } = useLanguage();
  const content = CONTENT[locale as keyof typeof CONTENT] || CONTENT.fr;

  return (
    <section
      id="about"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#000000] text-[#F5F5F2] overflow-hidden border-t border-white/10"
    >
      {/* Ambient Multi-Tone Glow Accents (Casse le rouge avec Cyan & Or Solaire) */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#06B6D4]/[0.08] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[#FFD21F]/[0.06] blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16 sm:space-y-24">
        {/* ========================================================
            1. SECTION HEADER
           ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs uppercase tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E52421] animate-ping" />
            <span>{content.badge}</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none">
            {content.titlePart1}
            <span className="text-[#E52421]">{content.titlePart2}</span>
          </h2>

          <p className="font-body text-sm sm:text-base text-[#A0A0AB] leading-relaxed pt-2">
            {content.description}
          </p>
        </div>

        {/* ========================================================
            2. THE 4 PILLARS WITH BESPOKE FLATICON ICONS
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {content.pillars.map((pillar) => {
            const IconComponent = pillar.icon;

            return (
              <div
                key={pillar.title}
                className="group relative rounded-2xl bg-[#0E0E14] border border-white/10 p-6 sm:p-8 hover:border-[#E52421]/70 transition-all duration-500 shadow-xl overflow-hidden hover:-translate-y-1"
              >
                {/* Subtle Hover Gradient Core */}
                <div className="absolute inset-0 bg-radial from-[#E52421]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* Flaticon Icon & Subtitle Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 group-hover:bg-[#E52421]/15 group-hover:border-[#E52421]/50 transition-all duration-300 shadow-md">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <span className="font-mono text-[10px] sm:text-xs text-[#E52421] uppercase tracking-wider font-semibold">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight group-hover:text-[#E52421] transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-xs sm:text-sm text-[#A0A0AB] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            3. KEY METRICS BAR
           ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 py-8 px-6 sm:px-10 rounded-2xl bg-[#0A0A0E] border border-white/10 text-center">
          {content.metrics.map((metric) => (
            <div key={metric.label} className="space-y-1.5">
              <span className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-none block">
                {metric.value.includes("+") ? (
                  <>
                    <span className="text-[#E52421]">+</span>
                    {metric.value.replace("+", "")}
                  </>
                ) : (
                  metric.value
                )}
              </span>
              <span className="font-mono text-[11px] sm:text-xs text-[#A0A0AB] uppercase tracking-wider block">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* ========================================================
            4. ACTION LINK
           ======================================================== */}
        <div className="text-center pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#E52421] hover:bg-[#FF3030] text-white shadow-[0_0_25px_rgba(229,36,33,0.45)] hover:scale-105 active:scale-95 transition-all group"
          >
            <span>{content.cta}</span>
            <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
