export type ClubRoleKey =
  | "PRESIDENT"
  | "VICE_PRESIDENT"
  | "SG"
  | "TRESORIER"
  | "MEMBRE_BUREAU"
  | "RESPONSABLE_PARKOUR"
  | "RESPONSABLE_TRAIL"
  | "RESPONSABLE_ESCALADE"
  | "COACH";

export interface ClubRoleDefinition {
  key: ClubRoleKey;
  labelFr: string;
  labelAr: string;
  labelEn: string;
  category: "BUREAU" | "SECTION" | "COACH";
  cardBadgeTitle: string; // Used on the special card
  cardHeaderBadge: string; // e.g. "BUREAU EXÉCUTIF" or "DIRECTION TECHNIQUE"
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    gradient: string;
  };
}

export const CLUB_ROLES: Record<ClubRoleKey, ClubRoleDefinition> = {
  PRESIDENT: {
    key: "PRESIDENT",
    labelFr: "Président",
    labelAr: "رئيس النادي",
    labelEn: "President",
    category: "BUREAU",
    cardBadgeTitle: "PRÉSIDENT",
    cardHeaderBadge: "BUREAU EXÉCUTIF",
    colorTheme: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/40",
      text: "text-amber-400",
      gradient: "from-amber-400 via-amber-200 to-yellow-500",
    },
  },
  VICE_PRESIDENT: {
    key: "VICE_PRESIDENT",
    labelFr: "Vice-Président",
    labelAr: "نائب الرئيس",
    labelEn: "Vice-President",
    category: "BUREAU",
    cardBadgeTitle: "VICE-PRÉSIDENT",
    cardHeaderBadge: "BUREAU EXÉCUTIF",
    colorTheme: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/40",
      text: "text-amber-400",
      gradient: "from-amber-400 via-yellow-200 to-amber-500",
    },
  },
  SG: {
    key: "SG",
    labelFr: "Secrétaire Général (SG)",
    labelAr: "الأمين العام",
    labelEn: "General Secretary",
    category: "BUREAU",
    cardBadgeTitle: "SECRÉTAIRE GÉNÉRAL",
    cardHeaderBadge: "BUREAU EXÉCUTIF",
    colorTheme: {
      bg: "bg-sky-500/15",
      border: "border-sky-500/40",
      text: "text-sky-400",
      gradient: "from-sky-400 via-cyan-200 to-blue-500",
    },
  },
  TRESORIER: {
    key: "TRESORIER",
    labelFr: "Trésorier",
    labelAr: "أمين المال",
    labelEn: "Treasurer",
    category: "BUREAU",
    cardBadgeTitle: "TRÉSORIER",
    cardHeaderBadge: "BUREAU EXÉCUTIF",
    colorTheme: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      gradient: "from-emerald-400 via-teal-200 to-emerald-500",
    },
  },
  MEMBRE_BUREAU: {
    key: "MEMBRE_BUREAU",
    labelFr: "Membre de Bureau",
    labelAr: "عضو مكتب",
    labelEn: "Board Member",
    category: "BUREAU",
    cardBadgeTitle: "MEMBRE DU BUREAU",
    cardHeaderBadge: "BUREAU EXÉCUTIF",
    colorTheme: {
      bg: "bg-purple-500/15",
      border: "border-purple-500/40",
      text: "text-purple-400",
      gradient: "from-purple-400 via-pink-200 to-purple-500",
    },
  },
  RESPONSABLE_PARKOUR: {
    key: "RESPONSABLE_PARKOUR",
    labelFr: "Responsable Section (Parkour)",
    labelAr: "مسؤول فرع الباركور",
    labelEn: "Head of Parkour Section",
    category: "SECTION",
    cardBadgeTitle: "RESPONSABLE PARKOUR",
    cardHeaderBadge: "RESPONSABLE DE SECTION",
    colorTheme: {
      bg: "bg-red-500/15",
      border: "border-red-500/40",
      text: "text-[#E52421]",
      gradient: "from-red-500 via-rose-300 to-red-600",
    },
  },
  RESPONSABLE_TRAIL: {
    key: "RESPONSABLE_TRAIL",
    labelFr: "Responsable Section (Trail)",
    labelAr: "مسؤول فرع التريل",
    labelEn: "Head of Trail Section",
    category: "SECTION",
    cardBadgeTitle: "RESPONSABLE TRAIL",
    cardHeaderBadge: "RESPONSABLE DE SECTION",
    colorTheme: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      gradient: "from-emerald-500 via-teal-300 to-emerald-600",
    },
  },
  RESPONSABLE_ESCALADE: {
    key: "RESPONSABLE_ESCALADE",
    labelFr: "Responsable Section (Escalade)",
    labelAr: "مسؤول فرع التسلق",
    labelEn: "Head of Climbing Section",
    category: "SECTION",
    cardBadgeTitle: "RESPONSABLE ESCALADE",
    cardHeaderBadge: "RESPONSABLE DE SECTION",
    colorTheme: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/40",
      text: "text-amber-400",
      gradient: "from-amber-500 via-orange-300 to-amber-600",
    },
  },
  COACH: {
    key: "COACH",
    labelFr: "Coach / Entraîneur",
    labelAr: "مدرب رسمي",
    labelEn: "Coach / Trainer",
    category: "COACH",
    cardBadgeTitle: "COACH OFFICIEL",
    cardHeaderBadge: "DIRECTION TECHNIQUE",
    colorTheme: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/40",
      text: "text-blue-400",
      gradient: "from-blue-500 via-cyan-300 to-blue-600",
    },
  },
};

export const CLUB_ROLES_LIST = Object.values(CLUB_ROLES);

export function getClubRoleDefinition(roleKey?: string | null): ClubRoleDefinition | null {
  if (!roleKey) return null;
  return CLUB_ROLES[roleKey as ClubRoleKey] || null;
}
