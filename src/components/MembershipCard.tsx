"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { getClubRoleDefinition } from "@/lib/clubRoles";
import {
  CreditCard,
  RotateCw,
  Printer,
  Heart,
  CheckCircle2,
  X,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";

export interface MembershipCardProps {
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    bloodType?: string | null;
    isMinor: boolean;
    phone: string;
    emergencyPhone?: string | null;
    membershipCardNumber?: string | null;
    rfidCardId?: string | null;
    clubRole?: string | null;
    isStaff?: boolean;
  };
  registration?: {
    reference: string;
    status: string;
    type?: string;
    season: {
      code: string;
      label?: string;
      name?: string;
    };
    disciplines?: Array<{
      discipline: {
        id: string;
        nameFr?: string;
        nameAr?: string;
        slug?: string;
      };
    }>;
  };
  photoDocId?: string | null;
  onClose?: () => void;
}

/**
 * Real, Fully Functional ISO/IEC 18004 QR Code Generator.
 * Encodes verifiable URL/text with error correction level M.
 * Scannable by all smartphones and QR hardware readers.
 */
function RealQrCodeSvg({
  value,
  size = 38,
}: {
  value: string;
  size?: number;
}) {
  const qr = useMemo(() => {
    try {
      return QRCode.create(value || "https://registration.addpkoran.com", {
        errorCorrectionLevel: "M",
      });
    } catch {
      return null;
    }
  }, [value]);

  if (!qr) return null;
  const modSize = qr.modules.size;
  const margin = 2; // standard quiet zone
  const total = modSize + margin * 2;

  let path = "";
  for (let r = 0; r < modSize; r++) {
    for (let c = 0; c < modSize; c++) {
      if (qr.modules.get(r, c)) {
        path += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      className="bg-white p-0.5 rounded shadow-sm shrink-0"
    >
      <rect width={total} height={total} fill="#FFFFFF" />
      <path d={path} fill="#0E0E12" />
    </svg>
  );
}

/**
 * Standard professional cutting crop marks for CR80 card borders.
 */
export function CropMarks() {

  return (
    <>
      <div className="absolute -top-[5mm] -left-[5mm] w-[5mm] h-[5mm] pointer-events-none">
        <div className="absolute top-[4.75mm] left-0 w-[4.75mm] h-[0.25mm] bg-black/70" />
        <div className="absolute top-0 left-[4.75mm] w-[0.25mm] h-[4.75mm] bg-black/70" />
      </div>
      <div className="absolute -top-[5mm] -right-[5mm] w-[5mm] h-[5mm] pointer-events-none">
        <div className="absolute top-[4.75mm] right-0 w-[4.75mm] h-[0.25mm] bg-black/70" />
        <div className="absolute top-0 right-[4.75mm] w-[0.25mm] h-[4.75mm] bg-black/70" />
      </div>
      <div className="absolute -bottom-[5mm] -left-[5mm] w-[5mm] h-[5mm] pointer-events-none">
        <div className="absolute bottom-[4.75mm] left-0 w-[4.75mm] h-[0.25mm] bg-black/70" />
        <div className="absolute bottom-0 left-[4.75mm] w-[0.25mm] h-[4.75mm] bg-black/70" />
      </div>
      <div className="absolute -bottom-[5mm] -right-[5mm] w-[5mm] h-[5mm] pointer-events-none">
        <div className="absolute bottom-[4.75mm] right-0 w-[4.75mm] h-[0.25mm] bg-black/70" />
        <div className="absolute bottom-0 right-[4.75mm] w-[0.25mm] h-[4.75mm] bg-black/70" />
      </div>
    </>
  );
}

/**
 * Real, Fully Functional ISO/IEC 15417 Code 128 (Subset B) Barcode Generator.
 * Encodes alphanumeric characters with standard 10-module quiet zones,
 * modulo-103 checksum, and standard stop character.
 * Scannable by all standard 1D laser/CCD hardware barcode readers and smartphone cameras.
 */
const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

export function RealBarcodeCode128({
  value,
  isPrintVersion = false,
}: {
  value: string;
  isPrintVersion?: boolean;
}) {
  const clean = (value || "ADD-2026-000001").replace(/[^\x20-\x7E]/g, "");
  let sum = 104; // Start Code B
  const codes = [104];

  for (let i = 0; i < clean.length; i++) {
    const val = clean.charCodeAt(i) - 32;
    codes.push(val);
    sum += val * (i + 1);
  }
  codes.push(sum % 103); // Checksum
  codes.push(106); // Stop Code

  const rects: Array<{ x: number; width: number }> = [];
  let currentX = 10; // 10-module quiet zone

  for (const c of codes) {
    const pat = CODE128_PATTERNS[c];
    if (!pat) continue;
    for (let p = 0; p < pat.length; p++) {
      const width = parseInt(pat[p], 10);
      const isBar = p % 2 === 0;
      if (isBar) {
        rects.push({ x: currentX, width });
      }
      currentX += width;
    }
  }

  const totalWidth = currentX + 10; // Right quiet zone

  return (
    <div className="flex flex-col items-start bg-[#121217] border border-white/10 px-1.5 py-0.5 rounded shadow-inner">
      <svg
        viewBox={`0 0 ${totalWidth} 34`}
        preserveAspectRatio="none"
        className={isPrintVersion ? "h-[3.2mm] w-32" : "h-3.5 sm:h-4 w-32 sm:w-40"}
      >
        <rect x="0" y="0" width={totalWidth} height="34" fill="transparent" />
        {rects.map((bar, i) => (
          <rect key={i} x={bar.x} y="0" width={bar.width} height="34" fill="#FFFFFF" />
        ))}
      </svg>
      <span
        className={`font-mono text-gray-300 font-medium tracking-wider block text-center w-full ${
          isPrintVersion ? "text-[4.2pt] leading-none mt-[0.3mm]" : "text-[7px] leading-tight"
        }`}
      >
        {clean}
      </span>
    </div>
  );
}

/**
 * Condenses discipline names uniformly for physical CR80 cards and digital badges.
 * Maps verbose database labels ("Escalade & sports de montagne", "Trail Running", etc.)
 * to crisp, standardized badges ("ESCALADE", "TRAIL", "PARKOUR") so all cards remain
 * strictly uniform and never overflow vertically.
 */
export function condenseDisciplineName(nameOrSlug?: string | null): string {
  if (!nameOrSlug) return "PARKOUR";
  const s = String(nameOrSlug).trim();
  const lower = s.toLowerCase();

  if (
    lower.includes("parkour") ||
    lower.includes("freerun") ||
    lower.includes("déplacement") ||
    lower.includes("deplacement") ||
    lower === "pk"
  ) {
    return "PARKOUR";
  }
  if (
    lower.includes("escalade") ||
    lower.includes("montagne") ||
    lower.includes("climb")
  ) {
    return "ESCALADE";
  }
  if (
    lower.includes("trail") ||
    lower.includes("course") ||
    lower.includes("running")
  ) {
    return "TRAIL";
  }

  // Fallback: extract the first token and limit length
  const firstWord = s.split(/[\s&/_-]+/)[0] || s;
  return firstWord.length > 9 ? firstWord.slice(0, 9).toUpperCase() : firstWord.toUpperCase();
}

/**
 * RECTO CARD FACE
 */
export function CardRectoFace({
  participant,
  cardNumber,
  seasonLabel,
  birthDateFormatted,
  photoUrl,
  disciplines,
  registration,
  isPrintVersion = false,
}: {
  participant: MembershipCardProps["participant"];
  cardNumber: string;
  seasonLabel: string;
  birthDateFormatted: string;
  photoUrl: string | null;
  disciplines: string[];
  registration?: MembershipCardProps["registration"];
  isPrintVersion?: boolean;
}) {
  const roleDef = getClubRoleDefinition(participant.clubRole);
  const isStaff = Boolean(participant.isStaff || participant.clubRole || registration?.type === "STAFF");

  // Always sanitize, condense, and deduplicate disciplines uniformly
  const condensedDisciplines = useMemo(() => {
    if (!disciplines || disciplines.length === 0) return ["PARKOUR"];
    return Array.from(new Set(disciplines.map(condenseDisciplineName)));
  }, [disciplines]);

  const fullName = `${participant.firstName || ""} ${participant.lastName || ""}`.trim();

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden ${
        isStaff
          ? "bg-gradient-to-br from-[#18120D] via-[#0E0E12] to-[#20180F] border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
          : "bg-gradient-to-br from-[#121217] via-[#0E0E12] to-[#181820] border border-white/20 shadow-2xl"
      } flex flex-col justify-between select-none text-white ${
        isPrintVersion
          ? "p-[3.5mm] rounded-[3.18mm] text-[7.5pt] leading-tight"
          : "p-4 sm:p-5"
      }`}
      style={{
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Holographic foil line along top */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          isStaff
            ? "bg-gradient-to-r from-amber-400 via-[#E52421] to-yellow-300 opacity-100"
            : "bg-gradient-to-r from-[#FFD21F] via-[#E52421] to-[#00D4FF] opacity-90"
        }`}
      />

      {/* CARD TOP HEADER: ENLARGED LOGO & CLUB IDENTITY */}
      <div className="relative z-10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`relative shrink-0 bg-black/60 border border-white/15 rounded-xl p-1 backdrop-blur-md shadow-md flex items-center justify-center ${
              isPrintVersion ? "w-[11mm] h-[11mm]" : "w-13 h-13 sm:w-14 sm:h-14"
            }`}
          >
            <Image
              src="/images/club/logo.svg"
              alt="Logo Club ADD Oran"
              width={isPrintVersion ? 38 : 48}
              height={isPrintVersion ? 38 : 48}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <div>
            <h4
              className={`text-white font-bold uppercase tracking-tight leading-tight ${
                isPrintVersion ? "text-[6.8pt]" : "text-[10px] sm:text-[11px]"
              }`}
            >
              Club Art Du Déplacement
            </h4>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[#E52421] font-extrabold uppercase tracking-wider ${
                  isPrintVersion ? "text-[6pt]" : "text-[9px] sm:text-[9.5px]"
                }`}
              >
                Parkour Oran
              </span>
            </div>
          </div>
        </div>

        {/* Season & Staff Header Badges */}
        <div className="flex flex-col items-end gap-1">
          {isStaff && (
            <span
              className={`bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 ${
                isPrintVersion
                  ? "px-[2.5mm] py-[0.8mm] text-[5pt]"
                  : "px-3 py-1 text-[8.5px]"
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
              {roleDef?.cardHeaderBadge || "BUREAU EXÉCUTIF"}
            </span>
          )}
          <span
            className={`bg-[#E52421]/20 border border-[#E52421]/40 text-[#FFD21F] font-mono font-bold rounded-lg uppercase tracking-wider inline-flex items-center justify-center ${
              isPrintVersion
                ? "px-[2.5mm] py-[0.8mm] text-[5pt]"
                : "px-3.5 py-1 text-[9px]"
            }`}
          >
            {seasonLabel}
          </span>
        </div>
      </div>

      {/* CARD MIDDLE BODY: PHOTO + ATHLETE DETAILS */}
      <div className="relative z-10 grid grid-cols-12 gap-3 items-center my-auto min-h-0 overflow-hidden">
        {/* Photo Frame (4 cols) */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div
            className={`relative rounded-xl overflow-hidden bg-[#1C1C24] border-2 ${
              isStaff ? "border-amber-400/70 shadow-amber-500/20" : "border-white/20"
            } shadow-lg shrink-0 ${
              isPrintVersion
                ? "w-[18mm] h-[22mm] rounded-[2mm]"
                : "w-24 h-28"
            }`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1C1C24] to-[#121217] text-gray-400 p-1 text-center">
                <span className="font-bold text-xl text-white/80">
                  {participant.firstName.charAt(0)}
                  {participant.lastName.charAt(0)}
                </span>
                <span className="text-[7px] uppercase tracking-wider text-gray-400 font-mono">
                  Photo
                </span>
              </div>
            )}
          </div>

          {/* Category Pill */}
          <span
            className={`mt-1 font-bold uppercase rounded tracking-wider border shadow-inner shrink-0 ${
              isStaff
                ? "border-amber-400/40 bg-amber-500/15 text-amber-300"
                : "border-white/15 bg-[#14141B] text-gray-200"
            } ${
              isPrintVersion
                ? "px-[1.2mm] py-[0.2mm] text-[3.8pt]"
                : "px-1.5 py-0.5 text-[7px]"
            }`}
          >
            {isStaff ? "★ DIRIGEANT" : (participant.isMinor ? "MINEUR" : "MAJEUR")}
          </span>
        </div>

        {/* Member Details (8 cols) */}
        <div className={`col-span-8 ${isPrintVersion ? "space-y-1.5" : "space-y-2"} pl-1 min-w-0`}>
          {/* Member Full Name - displayed completely, wraps gracefully without truncation */}
          <div className="min-w-0">
            <span
              className={`uppercase tracking-wider block font-bold text-gray-300 ${
                isStaff ? "text-amber-400" : "text-gray-300"
              } ${
                isPrintVersion ? "text-[4.2pt] mb-[0.8mm]" : "text-[7.5px] mb-1.5"
              }`}
            >
              {isStaff ? (roleDef ? `★ ${roleDef.labelFr}` : "★ Cadre / Dirigeant") : "Adhérent(e)"}
            </span>
            <div
              className={`text-white font-extrabold uppercase tracking-tight break-words leading-tight ${
                fullName.length > 28
                  ? isPrintVersion ? "text-[4.8pt]" : "text-[8.5px]"
                  : fullName.length > 20
                  ? isPrintVersion ? "text-[5.2pt]" : "text-[9.5px]"
                  : isPrintVersion ? "text-[5.8pt]" : "text-[10.5px]"
              }`}
              title={fullName}
            >
              {fullName}
            </div>
          </div>

          {/* Details Grid: Birth Date, Blood Type, Phone */}
          {/* KEYS ARE BOLD, VALUES ARE SMALLER & NON-BOLD */}
          <div className={`grid grid-cols-2 gap-x-2 ${isPrintVersion ? "gap-y-1" : "gap-y-1.5"} pt-0.5`}>
            <div>
              <span
                className={`text-gray-300 uppercase font-bold tracking-wider block ${
                  isPrintVersion ? "text-[3.8pt]" : "text-[7.5px]"
                }`}
              >
                Né(e) le
              </span>
              <span
                className={`text-gray-300 font-normal tracking-normal ${
                  isPrintVersion ? "text-[4.6pt]" : "text-[8px]"
                }`}
              >
                {birthDateFormatted}
              </span>
            </div>

            <div>
              <span
                className={`text-gray-300 uppercase font-bold tracking-wider block ${
                  isPrintVersion ? "text-[3.8pt]" : "text-[7.5px]"
                }`}
              >
                Groupe Sanguin
              </span>
              <span
                className={`inline-flex items-center gap-1 font-normal text-red-400 tracking-normal ${
                  isPrintVersion ? "text-[4.6pt]" : "text-[8px]"
                }`}
              >
                <Heart className="w-2 h-2 fill-red-500 text-red-500" />
                {participant.bloodType || "N/R"}
              </span>
            </div>

            <div className="col-span-2">
              <span
                className={`text-gray-300 uppercase font-bold tracking-wider block ${
                  isPrintVersion ? "text-[3.8pt]" : "text-[7.5px]"
                }`}
              >
                Téléphone
              </span>
              <span
                className={`text-gray-300 font-normal tracking-normal ${
                  isPrintVersion ? "text-[4.6pt]" : "text-[8px]"
                }`}
              >
                {participant.phone}
              </span>
            </div>
          </div>

          {/* Disciplines / Role pills - Strict Single Row & Adaptive Condensation */}
          <div className="pt-0.5 shrink-0 min-w-0">
            <div className="flex flex-nowrap items-center gap-1 overflow-hidden">
              {isStaff ? (
                <span
                  className={`bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold rounded tracking-wider uppercase flex items-center gap-1 shrink-0 ${
                    isPrintVersion
                      ? "px-[1.2mm] py-[0.2mm] text-[4.2pt]"
                      : "px-1.5 py-0.5 text-[7.5px]"
                  }`}
                >
                  <Sparkles className="w-2 h-2 text-amber-300 shrink-0" />
                  {roleDef ? `${roleDef.cardBadgeTitle}` : "BUREAU CLUB"}
                </span>
              ) : (
                condensedDisciplines.map((disc, idx) => (
                  <span
                    key={idx}
                    className={`shrink-0 font-semibold tracking-wider uppercase rounded border bg-white/5 border-white/15 text-gray-200 ${
                      condensedDisciplines.length >= 3
                        ? isPrintVersion
                          ? "px-[1.2mm] py-[0.2mm] text-[3.8pt]"
                          : "px-1.5 py-0.5 text-[7px]"
                        : condensedDisciplines.length === 2
                        ? isPrintVersion
                          ? "px-[1.4mm] py-[0.22mm] text-[4.2pt]"
                          : "px-2 py-0.5 text-[7.5px]"
                        : isPrintVersion
                        ? "px-[1.6mm] py-[0.25mm] text-[4.5pt]"
                        : "px-2 py-0.5 text-[8px]"
                    }`}
                  >
                    {disc}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Front Separator Line */}
      <div
        className={`relative z-10 ${
          isPrintVersion ? "pt-1 border-t border-white/10" : "pt-1.5 border-t border-white/10"
        } flex items-center justify-between text-gray-500 font-mono shrink-0`}
      >
        <span className={isPrintVersion ? "text-[3.2pt] tracking-widest uppercase" : "text-[6.5px] tracking-widest uppercase"}>
          C.S.A ADD PARKOUR ORAN
        </span>
        <span className={isPrintVersion ? "text-[3.2pt] tracking-wider uppercase" : "text-[6.5px] tracking-wider uppercase"}>
          CARTE OFFICIELLE
        </span>
      </div>
    </div>
  );
}

/**
 * VERSO CARD FACE
 * Clean, official back with the QR code verification on the right,
 * and the club emblem, motto, accreditation, and validity notice on the left.
 */
export function CardVersoFace({
  participant,
  registration,
  cardNumber,
  seasonLabel,
  isPrintVersion = false,
}: {
  participant?: MembershipCardProps["participant"];
  registration?: MembershipCardProps["registration"];
  cardNumber?: string;
  seasonLabel?: string;
  isPrintVersion?: boolean;
}) {
  const roleDef = getClubRoleDefinition(participant?.clubRole);
  const isStaff = Boolean(participant?.isStaff || participant?.clubRole || registration?.type === "STAFF");
  const cardRef = cardNumber || participant?.membershipCardNumber || registration?.reference || "ADD-CARD-2026";
  const verifyRef = registration?.reference || cardNumber || participant?.membershipCardNumber || "";
  const verifyUrl = `https://registration.addpkoran.com/card/${encodeURIComponent(verifyRef)}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden ${
        isStaff
          ? "bg-gradient-to-br from-[#18120D] via-[#0E0E12] to-[#20180F] border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
          : "bg-gradient-to-br from-[#121217] via-[#0D0D11] to-[#16161D] border border-white/20 shadow-2xl"
      } flex flex-col justify-between select-none text-white ${
        isPrintVersion
          ? "p-[3.5mm] rounded-[3.18mm] text-[7pt] leading-tight"
          : "p-4 sm:p-5"
      }`}
      style={{
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2.5px] ${
          isStaff
            ? "bg-gradient-to-r from-amber-400 via-[#E52421] to-yellow-300 opacity-90"
            : "bg-gradient-to-r from-[#FFD21F] via-[#E52421] to-[#00D4FF] opacity-80"
        }`}
      />

      {/* Main Verso Body: Left Identity & Right QR Code */}
      <div className="relative z-10 flex-1 flex items-center justify-between gap-3 my-auto min-h-0">
        {/* Left Side: Authentic Club Identity, Motto, & Official Notice */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <div
              className={`relative shrink-0 bg-black/60 border border-white/15 rounded-xl p-1 backdrop-blur-md shadow-md flex items-center justify-center ${
                isPrintVersion ? "w-[9mm] h-[9mm]" : "w-11 h-11"
              }`}
            >
              <Image
                src="/images/club/logo.svg"
                alt="Club ADD Oran"
                width={isPrintVersion ? 30 : 40}
                height={isPrintVersion ? 30 : 40}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h4
                className={`text-white font-bold uppercase tracking-tight leading-tight ${
                  isPrintVersion ? "text-[5.8pt]" : "text-[9.5px]"
                }`}
              >
                Club Art Du Déplacement
              </h4>
              <span
                className={`text-[#E52421] font-bold uppercase tracking-wider block ${
                  isPrintVersion ? "text-[5.2pt]" : "text-[8.5px]"
                }`}
              >
                Parkour Oran
              </span>
            </div>
          </div>

          <div
            className={`font-bold tracking-wide uppercase ${
              isPrintVersion ? "text-[5pt]" : "text-[8.5px]"
            }`}
          >
            <span className="text-[#F5F5F2]">Être </span>
            <span className="text-[#E52421] font-extrabold">fort</span>
            <span className="text-[#F5F5F2]"> pour être </span>
            <span className="text-[#E52421] font-extrabold">utile</span>
          </div>

          {isStaff && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/50 text-amber-300 font-bold text-[6.5px] uppercase tracking-wider w-fit">
              <Sparkles className="w-2 h-2 text-amber-300 shrink-0" />
              <span>ACCRÉDITATION • {roleDef ? roleDef.cardBadgeTitle : "DIRIGEANT"}</span>
            </div>
          )}

          <p
            className={`text-gray-400 leading-tight font-medium ${
              isPrintVersion ? "text-[3.8pt]" : "text-[7px]"
            }`}
          >
            Carte d&apos;adhésion strictement personnelle et incessible. Scannez le QR code pour vérification officielle.
          </p>
        </div>

        {/* Right Side: QR Code Verification Box */}
        <div className="flex flex-col items-center justify-center shrink-0 pl-2 border-l border-white/10">
          <Link
            href={verifyUrl}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            title="Vérifier la carte en ligne"
            className="hover:scale-105 transition-transform"
          >
            <div className="p-1 bg-white rounded-lg shadow-lg border border-white/20 flex items-center justify-center">
              <RealQrCodeSvg
                value={verifyUrl}
                size={isPrintVersion ? 32 : 44}
              />
            </div>
          </Link>
          <span
            className={`font-mono text-gray-200 font-bold tracking-wider uppercase mt-1 ${
              isPrintVersion ? "text-[4.2pt]" : "text-[7.5px]"
            }`}
          >
            {cardRef}
          </span>
          <span
            className={`text-[#00D4FF] uppercase tracking-wider font-extrabold ${
              isPrintVersion ? "text-[3.8pt]" : "text-[7px]"
            }`}
          >
            SCAN POUR VÉRIFIER
          </span>
        </div>
      </div>

      {/* Verso Footer: Location, Instagram, and Website URL */}
      <div
        className={`pt-1.5 pb-0.5 border-t border-white/10 flex items-center justify-between text-gray-400 font-mono ${
          isPrintVersion ? "text-[3.8pt]" : "text-[6.8px]"
        }`}
      >
        <div className="flex items-center gap-1 text-gray-300">
          <MapPin className={isPrintVersion ? "w-[2.2mm] h-[2.2mm] text-[#E52421] shrink-0" : "w-2.5 h-2.5 text-[#E52421] shrink-0"} />
          <span className="font-semibold tracking-wide translate-y-[0.5px]">Oran, Algérie</span>
        </div>

        {/* Instagram */}
        <div className="flex items-center gap-1 text-gray-300">
          <svg
            viewBox="0 0 24 24"
            width={isPrintVersion ? "8" : "10"}
            height={isPrintVersion ? "8" : "10"}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#E1306C] shrink-0"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span className="text-gray-200 font-semibold tracking-wide translate-y-[0.5px]">@add_club_oran</span>
        </div>

        <div className="flex items-center gap-1">
          <Globe className={isPrintVersion ? "w-[2.2mm] h-[2.2mm] text-[#00D4FF] shrink-0" : "w-2.5 h-2.5 text-[#00D4FF] shrink-0"} />
          <span className="text-[#00D4FF] font-bold tracking-wider hover:underline translate-y-[0.5px]">
            www.addpkoran.com
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MembershipCard({
  participant,
  registration,
  photoDocId,
  onClose,
}: MembershipCardProps) {
  // 3D Screen State
  const [rotationY, setRotationY] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRot, setDragStartRot] = useState(0);

  const cardNumber =
    participant.membershipCardNumber ||
    `ADD-CARD-${registration?.season?.code || "2026"}-PENDING`;

  const seasonLabel =
    registration?.season?.label ||
    (registration?.season?.code ? `Saison ${registration.season.code}` : "Saison 2026-2027");

  const birthDateFormatted = participant.dateOfBirth
    ? new Date(participant.dateOfBirth).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const photoUrl = photoDocId ? `/api/documents/${photoDocId}` : null;

  const rawDisciplines = registration?.disciplines?.map(
    (d) => d.discipline.nameFr || d.discipline.slug?.toUpperCase() || "PARKOUR"
  ) || ["PARKOUR"];

  const disciplines: string[] = Array.from(new Set(rawDisciplines.map(condenseDisciplineName)));

  // Full 360 spin animation
  const handleSpin360 = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRotationY((prev) => prev + 360);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1050);
  };

  // Quick flip to Recto (0)
  const handleShowRecto = () => {
    setIsSpinning(false);
    const normalized = Math.round(rotationY / 360) * 360;
    setRotationY(normalized);
  };

  // Quick flip to Verso (180)
  const handleShowVerso = () => {
    setIsSpinning(false);
    const normalized = Math.floor(rotationY / 360) * 360 + 180;
    setRotationY(normalized);
  };

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartRot(rotationY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      setRotationY(dragStartRot + deltaX * 0.8);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltX(-relativeY * 12);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTiltX(0);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setDragStartRot(rotationY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStartX;
      setRotationY(dragStartRot + deltaX * 0.8);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePrint = () => {
    const printUrl = `/card/${participant.id}/print?autoprint=1`;
    window.open(printUrl, "_blank");
  };

  const normalizedDegrees = Math.round(((rotationY % 360) + 360) % 360);
  const isFacingVerso = normalizedDegrees > 90 && normalizedDegrees < 270;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SCREEN VIEW: Sleek Dark Athletic 3D Interactive Card                    */}
      {/* ========================================================================= */}
      <div className="pvc-screen-layout flex flex-col items-center justify-center gap-5 w-full max-w-xl mx-auto">
        {/* Action Header / Toolbar */}
        <div className="flex flex-wrap items-center justify-between w-full max-w-[500px] gap-2.5 bg-[#141419]/90 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#E52421]" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Carte d&apos;adhérent
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#FFD21F]">
              360° 3D
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Spin 360 Button */}
            <button
              type="button"
              onClick={handleSpin360}
              disabled={isSpinning}
              className="px-3 py-1.5 bg-[#FFD21F] hover:bg-[#FFE066] text-[#0A0A0D] text-xs font-mono font-black rounded-xl flex items-center gap-1.5 transition shadow-md shadow-[#FFD21F]/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Faire tourner la carte à 360 degrés"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
              <span>Tourner 360°</span>
            </button>

            {/* Quick Recto / Verso Button */}
            <button
              type="button"
              onClick={isFacingVerso ? handleShowRecto : handleShowVerso}
              className="px-3 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 hover:text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
              title="Inverser Recto / Verso"
            >
              {isFacingVerso ? "Voir Recto" : "Voir Verso"}
            </button>

            {/* Direct Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md shadow-[#E52421]/20 cursor-pointer active:scale-95"
              title="Imprimer au format carte PVC (CR80)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 bg-[#1C1C24] hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition cursor-pointer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3D Card Stage */}
        <div
          id="membership-card-interactive-stage"
          className="relative w-[460px] h-[290px] max-w-[94vw] max-h-[60vw] sm:max-h-[290px] select-none cursor-grab active:cursor-grabbing touch-none"
          style={{ perspective: "1400px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`relative w-full h-full rounded-2xl shadow-2xl ${
              isSpinning
                ? "transition-transform duration-1000 ease-in-out"
                : isDragging
                ? "transition-none"
                : "transition-transform duration-200 ease-out"
            }`}
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transform: `rotateY(${rotationY}deg) rotateX(${tiltX}deg)`,
            }}
          >
            {/* RECTO FACE (Screen) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <CardRectoFace
                participant={participant}
                cardNumber={cardNumber}
                seasonLabel={seasonLabel}
                birthDateFormatted={birthDateFormatted}
                photoUrl={photoUrl}
                disciplines={disciplines}
                registration={registration}
              />
            </div>

            {/* VERSO FACE (Screen) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardVersoFace
                participant={participant}
                registration={registration}
                cardNumber={cardNumber}
                seasonLabel={seasonLabel}
              />
            </div>
          </div>
        </div>

        {/* 360° Interactive Angle Control */}
        <div className="w-full max-w-[460px] bg-[#141419]/90 border border-white/10 rounded-2xl p-3.5 space-y-2 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-[#FFD21F]" />
              Angle 3D :{" "}
              <strong className="text-[#FFD21F] font-bold">
                {normalizedDegrees}°
              </strong>
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
              {normalizedDegrees >= 315 || normalizedDegrees < 45
                ? "Face : Recto"
                : normalizedDegrees >= 45 && normalizedDegrees < 135
                ? "Tranche : Profil Gauche"
                : normalizedDegrees >= 135 && normalizedDegrees < 225
                ? "Face : Verso"
                : "Tranche : Profil Droit"}
            </span>
          </div>

          {/* 360 Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500">0°</span>
            <input
              type="range"
              min={0}
              max={360}
              value={normalizedDegrees}
              onChange={(e) => {
                setIsSpinning(false);
                const val = Number(e.target.value);
                setRotationY(val);
              }}
              className="w-full accent-[#FFD21F] bg-[#1C1C24] h-2 rounded-lg cursor-pointer appearance-none"
              title="Faire pivoter la carte de 0° à 360°"
            />
            <span className="text-[10px] font-mono text-gray-500">360°</span>
          </div>

          {/* Preset quick buttons */}
          <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
            <button
              type="button"
              onClick={handleShowRecto}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              0° Recto
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSpinning(false);
                setRotationY(90);
              }}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              90° Tranche
            </button>
            <button
              type="button"
              onClick={handleShowVerso}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              180° Verso
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSpinning(false);
                setRotationY(270);
              }}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              270° Tranche
            </button>
            <button
              type="button"
              onClick={handleSpin360}
              className="text-[#FFD21F] font-bold hover:underline transition cursor-pointer"
            >
              ⚡ 360° Spin
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center text-xs text-gray-400 max-w-sm space-y-1">
          <p>
            Glissez sur la carte ou utilisez le curseur pour explorer en 3D à <strong>360°</strong>.
          </p>
          <p className="text-[11px] text-gray-500">
            Format physique officiel : <strong className="text-gray-300">ISO/IEC 7810 CR80 (85.6 × 54 mm)</strong>.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRINT-ONLY VIEW: Flat High-Res ISO CR80 PVC Output (Clean - 0 Extra Text)*/}
      {/* ========================================================================= */}
      <div className="pvc-print-layout">
        <div className="w-[210mm] min-h-[297mm] p-[12mm] mx-auto bg-white text-black flex flex-col items-center justify-center">
          {/* Cards Pair: Recto & Verso (Zero Extra Text for PVC Card Machine) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12mm] py-[4mm]">
            {/* RECTO */}
            <div className="relative">
              <div className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-sm">
                <CardRectoFace
                  participant={participant}
                  cardNumber={cardNumber}
                  seasonLabel={seasonLabel}
                  birthDateFormatted={birthDateFormatted}
                  photoUrl={photoUrl}
                  disciplines={disciplines}
                  registration={registration}
                  isPrintVersion
                />
              </div>
            </div>

            {/* VERSO */}
            <div className="relative">
              <div className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-sm">
                <CardVersoFace
                  participant={participant}
                  registration={registration}
                  cardNumber={cardNumber}
                  seasonLabel={seasonLabel}
                  isPrintVersion
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
