/**
 * ADD PARKOUR ORAN — Centralized Image Asset System
 * 
 * High-end kinetic sports photography & authentic club photo archives.
 * Real authentic imagery: Parkour vaults, climbing conditioning, trail movement,
 * and genuine 2025/2026 club athletes, coaches, and youth medalists.
 */

export interface HeroSlide {
  id: string;
  src: string;
  fallbackSrc: string;
  alt: string;
  statement: string; // Artistic English campaign statement
  disciplineKey: "parkour" | "escalade" | "trail";
  accentColor: string; // Club color token
}

export interface DisciplinePoster {
  id: string;
  slug: string;
  name: string;
  statement: string;
  src: string;
  accentColor: string;
}

export interface SeasonPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "portrait" | "landscape";
  alt: string;
  caption: string;
  featured?: boolean;
}

export interface SeasonData {
  seasonKey: string;
  year: string;
  title: string;
  subtitle: string;
  heroFeatured: SeasonPhoto;
  highlights: SeasonPhoto[];
  gallery: SeasonPhoto[];
}

// 1. HERO SLIDES — Shifted to official Club Red + Athletic Yellow palette
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "parkour-gravity",
    src: "/images/hero/hero-parkour.jpg",
    fallbackSrc: "/images/hero/hero-parkour.jpg",
    alt: "Parkour Oran — Defy Gravity",
    statement: "DEFY GRAVITY.",
    disciplineKey: "parkour",
    accentColor: "#E52421", // Official Club Red
  },
  {
    id: "climbing-vertical",
    src: "/images/hero/hero-climbing.jpg",
    fallbackSrc: "/images/hero/hero-climbing.jpg",
    alt: "Escalade Murdjadjo — Move Higher",
    statement: "MOVE HIGHER.",
    disciplineKey: "escalade",
    accentColor: "#FFD21F", // Athletic Yellow
  },
  {
    id: "trail-expansion",
    src: "/images/hero/hero-trail.jpg",
    fallbackSrc: "/images/hero/hero-trail.jpg",
    alt: "Trail Oran — Run Further",
    statement: "RUN FURTHER.",
    disciplineKey: "trail",
    accentColor: "#FF3030", // Bright Red Accent
  },
];

// 2. DISCIPLINE POSTERS — Exactly 3 official disciplines
export const DISCIPLINE_POSTERS: Record<string, DisciplinePoster> = {
  parkour: {
    id: "pk",
    slug: "parkour",
    name: "PARKOUR",
    statement: "MOVE DIFFERENT.",
    src: "/images/disciplines/discipline-parkour.jpg",
    accentColor: "#E52421", // Club Red
  },
  escalade: {
    id: "esc",
    slug: "escalade",
    name: "ESCALADE",
    statement: "MOVE HIGHER.",
    src: "/images/disciplines/discipline-climbing.jpg",
    accentColor: "#FFD21F", // Athletic Yellow
  },
  trail: {
    id: "tr",
    slug: "trail",
    name: "TRAIL",
    statement: "RUN FURTHER.",
    src: "/images/disciplines/discipline-trail.jpg",
    accentColor: "#FF3030", // Bright Red
  },
};

// 3. REGISTRATION BACKGROUNDS — Subtle real club photos
export const REGISTRATION_BACKGROUNDS = [
  "/images/lastseason/5893075819293249614.jpg",
  "/images/lastseason/5893075819293249609.jpg",
  "/images/registration/reg-campaign.jpg",
  "/images/lastseason/5893075819293249589.jpg",
];

// 4. LAST SEASON 2025 / 2026 ARCHIVE — 27 Authentic Club Photographs
const ALL_LAST_SEASON_PHOTOS: SeasonPhoto[] = [
  {
    id: "ls-614",
    src: "/images/lastseason/5893075819293249614.jpg",
    width: 1280,
    height: 960,
    aspectRatio: 1.33,
    orientation: "landscape",
    alt: "ADD Parkour Oran — Équipe, éducateurs et jeunes médaillés 2025/2026",
    caption: "Cérémonie des médailles — L'ensemble des athlètes et entraîneurs réunis",
    featured: true,
  },
  {
    id: "ls-613",
    src: "/images/lastseason/5893075819293249613.jpg",
    width: 1280,
    height: 960,
    aspectRatio: 1.33,
    orientation: "landscape",
    alt: "Entraîneurs ADD et médaillé d'or au gymnase",
    caption: "Fierté collective — Éducateurs aux côtés d'un jeune champion",
  },
  {
    id: "ls-615",
    src: "/images/lastseason/5893075819293249615.jpg",
    width: 1280,
    height: 960,
    aspectRatio: 1.33,
    orientation: "landscape",
    alt: "Vue panoramique du groupe ADD Oran au gymnase",
    caption: "Promotion 2025 / 2026 au complet sur les tapis d'entraînement",
  },
  {
    id: "ls-589",
    src: "/images/lastseason/5893075819293249589.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Saut et franchissement par un adhérent en maillot jaune Parkour Oran Academy",
    caption: "Franchissement dynamique — Vitesse et précision sur module incliné",
  },
  {
    id: "ls-590",
    src: "/images/lastseason/5893075819293249590.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Glissade et appui sur plan incliné en salle",
    caption: "Technique de descente contrôlée sur plan incliné",
  },
  {
    id: "ls-591",
    src: "/images/lastseason/5893075819293249591.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Jeune athlète féminine en suspension et saut d'obstacle",
    caption: "Engagement athlétique féminin — Puissance et détente",
  },
  {
    id: "ls-592",
    src: "/images/lastseason/5893075819293249592.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Appui manuel et passage d'obstacle Parkour Oran Academy",
    caption: "Appui et propulsion — Coordination motrice globale",
  },
  {
    id: "ls-593",
    src: "/images/lastseason/5893075819293249593.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Enfant préparant son impulsion sous le regard du coach",
    caption: "Apprentissage précoce — Sécurité et écoute des consignes",
  },
  {
    id: "ls-594",
    src: "/images/lastseason/5893075819293249594.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Passement d'obstacle rapide devant le public et les familles",
    caption: "Démonstration devant les familles au gymnase municipal",
  },
  {
    id: "ls-595",
    src: "/images/lastseason/5893075819293249595.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Franchissement aérien au-dessus de la poutre en équilibre",
    caption: "Franchissement aérien d'un obstacle étroit en plein vol",
  },
  {
    id: "ls-596",
    src: "/images/lastseason/5893075819293249596.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Suspension bras tendus à la barre fixe",
    caption: "Renforcement du grip et suspension haute à la barre fixe",
  },
  {
    id: "ls-597",
    src: "/images/lastseason/5893075819293249597.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Réception basse sur poutre en mousse",
    caption: "Technique d'amorti et absorption d'impact au sol",
  },
  {
    id: "ls-598",
    src: "/images/lastseason/5893075819293249598.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Balancement dynamique guidé par l'éducateur",
    caption: "Impulsion avec tremplin et balancier contrôlé",
  },
  {
    id: "ls-599",
    src: "/images/lastseason/5893075819293249599.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Saut de chat parfait sur caisson en bois",
    caption: "Saut de chat (Monkey Vault) exécuté avec rigueur technique",
  },
  {
    id: "ls-600",
    src: "/images/lastseason/5893075819293249600.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Phase d'accroche manuelle sur caisson",
    caption: "Prise d'appui ferme et propulsion des jambes groupées",
  },
  {
    id: "ls-601",
    src: "/images/lastseason/5893075819293249601.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Extension dorsale sur table de saut",
    caption: "Phase de vol et extension vers la zone de réception",
  },
  {
    id: "ls-602",
    src: "/images/lastseason/5893075819293249602.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Préparation d'impact sur tapis",
    caption: "Répétition des schémas moteurs et travail de trajectoire",
  },
  {
    id: "ls-603",
    src: "/images/lastseason/5893075819293249603.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Plongeon contrôlé au-dessus du bloc Gymnova",
    caption: "Franchissement plongeant au-dessus d'un obstacle haut",
  },
  {
    id: "ls-604",
    src: "/images/lastseason/5893075819293249604.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Évaluation technique d'un pratiquant à la barre fixe par le jury",
    caption: "Passage de grade et validation des acquis moteurs par les coachs",
  },
  {
    id: "ls-605",
    src: "/images/lastseason/5893075819293249605.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Cat pass haut sur structure métallique et bois",
    caption: "Passage d'obstacle en vitesse sur structure surélevée",
  },
  {
    id: "ls-606",
    src: "/images/lastseason/5893075819293249606.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Atterrissage sécurisé sur tapis de réception",
    caption: "Amorti au sol et protection articulaire",
  },
  {
    id: "ls-607",
    src: "/images/lastseason/5893075819293249607.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Vérification de posture sur poutre d'équilibre avec l'éducateur",
    caption: "Alignement postural et équilibre sur poutre étroite",
  },
  {
    id: "ls-608",
    src: "/images/lastseason/5893075819293249608.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Saut vers la barre haute avec parade rapprochée de l'entraîneur",
    caption: "Parade active et confiance mutuelle élève-éducateur",
  },
  {
    id: "ls-609",
    src: "/images/lastseason/5893075819293249609.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Coach principal guidant un élève devant les spectateurs",
    caption: "Pédagogie bienveillante sous le regard bienveillant des familles",
  },
  {
    id: "ls-610",
    src: "/images/lastseason/5893075819293249610.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Explication de la fiche pédagogique par le formateur",
    caption: "Débriefing individuel et accompagnement personnalisé",
  },
  {
    id: "ls-611",
    src: "/images/lastseason/5893075819293249611.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Échange technique entre deux entraîneurs du club",
    caption: "Coordination de l'équipe pédagogique lors des épreuves",
  },
  {
    id: "ls-612",
    src: "/images/lastseason/5893075819293249612.jpg",
    width: 960,
    height: 1280,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Installation des agrès et consignes d'échauffement",
    caption: "Préparation des ateliers et vérification du matériel",
  },
];

export const SEASON_2025_2026: SeasonData = {
  seasonKey: "2025-2026",
  year: "2025 / 2026",
  title: "LAST SEASON.",
  subtitle: "Moments forts, stages d'entraînement et compétitions de la saison écoulée.",
  heroFeatured: ALL_LAST_SEASON_PHOTOS[0], // The grand group medal photo (ls-614)
  highlights: [
    ALL_LAST_SEASON_PHOTOS[1], // ls-613: Coaches & Medalist Selfie (landscape)
    ALL_LAST_SEASON_PHOTOS[3], // ls-589: Athlete vaulting in Parkour Academy yellow shirt (portrait)
    ALL_LAST_SEASON_PHOTOS[9], // ls-595: Flying beam leap (portrait)
    ALL_LAST_SEASON_PHOTOS[13], // ls-599: Cat pass vault (portrait)
    ALL_LAST_SEASON_PHOTOS[18], // ls-604: High bar jury evaluation (portrait)
    ALL_LAST_SEASON_PHOTOS[23], // ls-609: Head coach guiding youth with families (portrait)
  ],
  gallery: ALL_LAST_SEASON_PHOTOS,
};
