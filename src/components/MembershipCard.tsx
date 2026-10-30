"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import QRCode from "qrcode";
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
  };
  registration?: {
    reference: string;
    status: string;
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
        className={`font-mono text-gray-200 font-bold tracking-wider block text-center w-full ${
          isPrintVersion ? "text-[4.5pt] leading-none mt-[0.3mm]" : "text-[7.5px] leading-tight"
        }`}
      >
        {clean}
      </span>
    </div>
  );
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
  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121217] via-[#0E0E12] to-[#181820] border border-white/20 flex flex-col justify-between shadow-2xl select-none text-white ${
        isPrintVersion
          ? "p-[3.5mm] rounded-[3.18mm] text-[7.5pt] leading-tight"
          : "p-5"
      }`}
      style={{
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Holographic foil line along top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FFD21F] via-[#E52421] to-[#00D4FF] opacity-90" />

      {/* CARD TOP HEADER: LOGO & CLUB IDENTITY */}
      <div className="relative z-10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`relative shrink-0 bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md shadow-inner flex items-center justify-center ${
              isPrintVersion ? "w-[8mm] h-[8mm]" : "w-11 h-11"
            }`}
          >
            <Image
              src="/images/club/logo.svg"
              alt="Logo Club ADD Oran"
              width={isPrintVersion ? 26 : 38}
              height={isPrintVersion ? 26 : 38}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <div>
            <h4
              className={`text-white font-extrabold uppercase font-display tracking-tight leading-tight ${
                isPrintVersion ? "text-[8pt]" : "text-[12px]"
              }`}
            >
              Club Art Du Déplacement
            </h4>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[#E52421] font-black uppercase font-display tracking-wider ${
                  isPrintVersion ? "text-[7.5pt]" : "text-[11px]"
                }`}
              >
                Parkour Oran
              </span>
            </div>
          </div>
        </div>

        {/* Season Badge */}
        <div className="flex flex-col items-end">
          <span
            className={`bg-[#E52421]/20 border border-[#E52421]/40 text-[#FFD21F] font-mono font-bold rounded-md uppercase tracking-wider ${
              isPrintVersion
                ? "px-[1.5mm] py-[0.3mm] text-[4.8pt]"
                : "px-2 py-0.5 text-[8px]"
            }`}
          >
            {seasonLabel}
          </span>
        </div>
      </div>

      {/* CARD MIDDLE BODY: PHOTO + ATHLETE DETAILS */}
      <div className="relative z-10 grid grid-cols-12 gap-2.5 items-center my-auto">
        {/* Photo Frame (4 cols) */}
        <div className="col-span-4 flex flex-col items-center">
          <div
            className={`relative rounded-xl overflow-hidden bg-[#1C1C24] border-2 border-white/20 shadow-lg ${
              isPrintVersion
                ? "w-[18mm] h-[22.5mm] rounded-[2mm]"
                : "w-24 h-28"
            }`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${participant.firstName} ${participant.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1C1C24] to-[#121217] text-gray-400 p-1 text-center">
                <span className="font-display font-black text-xl text-white/80">
                  {participant.firstName.charAt(0)}
                  {participant.lastName.charAt(0)}
                </span>
                <span className="text-[7px] uppercase tracking-wider text-gray-400 font-mono">
                  Photo
                </span>
              </div>
            )}

            {/* Security check tag overlay */}
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
              <CheckCircle2 className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Category Pill */}
          <span
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
            className={`mt-1 font-bold uppercase rounded tracking-wider border border-white/15 bg-[#14141B] text-gray-200 shadow-inner ${
              isPrintVersion
                ? "px-[1.5mm] py-[0.25mm] text-[4.8pt]"
                : "px-2 py-0.5 text-[8px]"
            }`}
          >
            {participant.isMinor ? "Mineur (<18)" : "Majeur (18+)"}
          </span>
        </div>

        {/* Member Details (8 cols) */}
        <div className="col-span-8 space-y-1.5 pl-1">
          {/* Member Full Name - reduced font, responsive, no truncation */}
          <div>
            <span
              className={`text-gray-400 uppercase font-mono tracking-wider block ${
                isPrintVersion ? "text-[5pt]" : "text-[8px]"
              }`}
            >
              Adhérent(e)
            </span>
            <div
              className={`text-white font-extrabold uppercase font-display tracking-tight break-words ${
                isPrintVersion
                  ? "text-[7.5pt] leading-tight"
                  : "text-xs sm:text-[13px] leading-snug"
              }`}
            >
              {participant.firstName} {participant.lastName}
            </div>
          </div>

          {/* Details Grid: Birth Date, Blood Type, Phone (N° Carte REMOVED) */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-0.5">
            <div>
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[4.5pt]" : "text-[8px]"
                }`}
              >
                Né(e) le
              </span>
              <span
                className={`font-mono text-gray-200 font-semibold ${
                  isPrintVersion ? "text-[6.5pt]" : "text-[10px]"
                }`}
              >
                {birthDateFormatted}
              </span>
            </div>

            <div>
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[4.5pt]" : "text-[8px]"
                }`}
              >
                Groupe Sanguin
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono font-bold text-red-400 ${
                  isPrintVersion ? "text-[6.5pt]" : "text-[10px]"
                }`}
              >
                <Heart className="w-2 h-2 fill-red-500 text-red-500" />
                {participant.bloodType || "N/R"}
              </span>
            </div>

            <div className="col-span-2">
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[4.5pt]" : "text-[8px]"
                }`}
              >
                Téléphone
              </span>
              <span
                className={`font-mono text-gray-300 ${
                  isPrintVersion ? "text-[6.5pt]" : "text-[10px]"
                }`}
              >
                {participant.phone}
              </span>
            </div>
          </div>

          {/* Disciplines pills */}
          <div className="pt-0.5">
            <div className="flex flex-wrap gap-1">
              {disciplines.slice(0, 3).map((disc, idx) => (
                <span
                  key={idx}
                  className={`bg-white/5 border border-white/10 text-gray-200 font-bold rounded tracking-wider uppercase font-display ${
                    isPrintVersion
                      ? "px-[1.5mm] py-[0.25mm] text-[5pt]"
                      : "px-1.5 py-0.5 text-[8.5px]"
                  }`}
                >
                  {disc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CARD BOTTOM BAR: REAL CODE 128 BARCODE & QR VALIDATION */}
      <div className="relative z-10 pt-1.5 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
        {/* Real Functional Code 128 Barcode */}
        <RealBarcodeCode128
          value={registration?.reference || cardNumber}
          isPrintVersion={isPrintVersion}
        />

        {/* Real QR Code */}
        <RealQrCodeSvg
          value={`https://registration.addpkoran.com/card/${registration?.reference || cardNumber}`}
          size={isPrintVersion ? 32 : 38}
        />
      </div>
    </div>
  );
}

/**
 * VERSO CARD FACE
 * Clean minimal back: agreement, signatures, stamps, and magnetic strip removed.
 * Only subtle monochrome club watermark in center, and footer with location & website URL.
 */
export function CardVersoFace({
  isPrintVersion = false,
}: {
  participant?: MembershipCardProps["participant"];
  seasonLabel?: string;
  isPrintVersion?: boolean;
}) {
  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121217] via-[#0D0D11] to-[#16161D] border border-white/20 flex flex-col justify-between shadow-2xl select-none text-white ${
        isPrintVersion
          ? "p-[4.5mm] rounded-[3.18mm] text-[7pt] leading-tight"
          : "p-6"
      }`}
      style={{
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E52421] to-transparent opacity-60" />

      {/* Center: Sleek minimalist club watermark */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto opacity-20 pointer-events-none select-none space-y-2">
        <Image
          src="/images/club/logo.svg"
          alt="Club ADD Oran"
          width={isPrintVersion ? 40 : 56}
          height={isPrintVersion ? 40 : 56}
          className="grayscale contrast-200"
        />
        <div className="text-center font-display font-black tracking-widest text-white uppercase text-[8px] sm:text-[10px]">
          Club Art Du Déplacement • Parkour Oran
        </div>
      </div>

      {/* Verso Footer: Only Location on left and Website URL on right */}
      <div
        className={`pt-2 border-t border-white/10 flex items-center justify-between text-gray-400 font-mono ${
          isPrintVersion ? "text-[6.5pt]" : "text-[10px]"
        }`}
      >
        <div className="flex items-center gap-1.5 text-gray-300">
          <MapPin className="w-3 h-3 text-[#E52421] shrink-0" />
          <span className="font-semibold tracking-wide">Oran, Algérie</span>
        </div>
        <div>
          <span className="text-[#00D4FF] font-bold tracking-wider hover:underline">
            registration.addpkoran.com
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

  const disciplines = registration?.disciplines?.map(
    (d) => d.discipline.nameFr || d.discipline.slug?.toUpperCase() || "PARKOUR"
  ) || ["PARKOUR", "FREERUN"];

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
      {/* 2. PRINT-ONLY VIEW: Flat High-Res ISO CR80 PVC Output                      */}
      {/* Completely hidden on screen; only rendered by the browser print engine    */}
      {/* ========================================================================= */}
      <div className="pvc-print-layout">
        <div className="w-[210mm] min-h-[297mm] p-[12mm] mx-auto bg-white text-black flex flex-col items-center justify-center space-y-[10mm]">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-gray-300 pb-3 w-full">
            <h2 className="text-[12pt] font-black uppercase font-display tracking-tight text-black">
              Académie ADD Oran // Carte d&apos;Adhérent Officielle
            </h2>
            <p className="text-[8pt] font-mono text-gray-600">
              Format standard ISO/IEC 7810 ID-1 (CR-80) • 85.60 mm × 53.98 mm • Échelle 100% (Taille réelle)
            </p>
            <p className="text-[7.5pt] font-mono text-gray-500">
              Adhérent : {participant.firstName} {participant.lastName} • Réf : {cardNumber}
            </p>
          </div>

          {/* Cards Pair: Recto & Verso with Crop Marks */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12mm] py-[4mm]">
            {/* RECTO */}
            <div className="relative">
              <CropMarks />
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
              <div className="text-center font-mono text-[7pt] text-gray-500 mt-2">
                ▲ FACE 1 : RECTO (85.60 × 53.98 mm)
              </div>
            </div>

            {/* VERSO */}
            <div className="relative">
              <CropMarks />
              <div className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-sm">
                <CardVersoFace
                  participant={participant}
                  seasonLabel={seasonLabel}
                  isPrintVersion
                />
              </div>
              <div className="text-center font-mono text-[7pt] text-gray-500 mt-2">
                ▲ FACE 2 : VERSO (85.60 × 53.98 mm)
              </div>
            </div>
          </div>

          {/* 50mm Calibration Ruler */}
          <div className="pt-4 border-t border-gray-200 flex flex-col items-center space-y-2">
            <div className="w-[50mm] border-b-2 border-black flex justify-between text-[7pt] font-mono font-bold">
              <span>| 0mm</span>
              <span className="text-[6.5pt] text-gray-600">50 mm (Règle d&apos;étalonnage 100%)</span>
              <span>50mm |</span>
            </div>
            <p className="text-[7pt] text-gray-500 font-mono text-center max-w-md">
              Pour une impression sur carte plastique ou badgeuse : vérifiez que la règle mesure 50 mm. Cochez l&apos;option « Graphismes d&apos;arrière-plan » dans la boîte de dialogue d&apos;impression.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
