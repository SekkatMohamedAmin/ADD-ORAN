"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CreditCard,
  RotateCw,
  Printer,
  Heart,
  CheckCircle2,
  X,
  Phone,
  MapPin,
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
 * Generates an SVG pseudo QR code pattern based on the string for crisp vector rendering.
 */
function DynamicQrCodeSvg({ value, size = 40 }: { value: string; size?: number }) {
  const hash = Array.from(value).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
  const gridSize = 17;
  const cells: boolean[][] = [];

  for (let r = 0; r < gridSize; r++) {
    cells[r] = [];
    for (let c = 0; c < gridSize; c++) {
      const isTopLeft = r < 5 && c < 5;
      const isTopRight = r < 5 && c >= gridSize - 5;
      const isBottomLeft = r >= gridSize - 5 && c < 5;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const localR = isBottomLeft ? r - (gridSize - 5) : r;
        const localC = isTopRight ? c - (gridSize - 5) : c;
        const isBorder = localR === 0 || localR === 4 || localC === 0 || localC === 4;
        const isCenter = localR >= 1 && localR <= 3 && localC >= 1 && localC <= 3;
        cells[r][c] = isBorder || isCenter;
      } else {
        const bitVal = Math.sin(hash * 0.13 + r * 13 + c * 37) > 0;
        cells[r][c] = bitVal;
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      className="bg-white p-0.5 rounded shrink-0 shadow-sm"
    >
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0E0E12" /> : null
        )
      )}
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
            className={`bg-[#E52421]/20 border border-[#E52421]/40 text-[#FFD21F] font-mono font-bold rounded-lg uppercase tracking-wider ${
              isPrintVersion
                ? "px-[2mm] py-[0.5mm] text-[6.5pt]"
                : "px-2.5 py-0.5 text-[10px]"
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
            className={`mt-1 font-mono font-extrabold uppercase rounded ${
              isPrintVersion
                ? "px-[1.5mm] py-[0.25mm] text-[5.5pt]"
                : "px-2 py-0.5 text-[9px]"
            } ${
              participant.isMinor
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {participant.isMinor ? "Mineur (<18)" : "Majeur (18+)"}
          </span>
        </div>

        {/* Member Details (8 cols) */}
        <div className="col-span-8 space-y-1 pl-1">
          {/* Member Full Name */}
          <div>
            <span
              className={`text-gray-400 uppercase font-mono tracking-wider block ${
                isPrintVersion ? "text-[5.5pt]" : "text-[9px]"
              }`}
            >
              Adhérent(e)
            </span>
            <div
              className={`text-white font-extrabold uppercase font-display tracking-tight truncate ${
                isPrintVersion ? "text-[11pt] leading-tight" : "text-base sm:text-lg"
              }`}
            >
              {participant.firstName} {participant.lastName}
            </div>
          </div>

          {/* Details Grid: Card Number, Birth, Blood */}
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[5pt]" : "text-[9px]"
                }`}
              >
                N° Carte
              </span>
              <span
                className={`font-mono font-black text-[#FFD21F] tracking-wider ${
                  isPrintVersion ? "text-[7pt]" : "text-[11px]"
                }`}
              >
                {cardNumber}
              </span>
            </div>

            <div>
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[5pt]" : "text-[9px]"
                }`}
              >
                Né(e) le
              </span>
              <span
                className={`font-mono text-gray-200 font-semibold ${
                  isPrintVersion ? "text-[7pt]" : "text-[11px]"
                }`}
              >
                {birthDateFormatted}
              </span>
            </div>

            <div>
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[5pt]" : "text-[9px]"
                }`}
              >
                Groupe Sanguin
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono font-bold text-red-400 ${
                  isPrintVersion ? "text-[7pt]" : "text-[11px]"
                }`}
              >
                <Heart className="w-2 h-2 fill-red-500 text-red-500" />
                {participant.bloodType || "N/R"}
              </span>
            </div>

            <div>
              <span
                className={`text-gray-400 uppercase font-mono block ${
                  isPrintVersion ? "text-[5pt]" : "text-[9px]"
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
                      ? "px-[1.5mm] py-[0.25mm] text-[5.5pt]"
                      : "px-1.5 py-0.5 text-[9px]"
                  }`}
                >
                  {disc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CARD BOTTOM BAR: BARCODE & QR VALIDATION */}
      <div className="relative z-10 pt-1.5 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
        {/* Electronic Barcode Simulation */}
        <div className="flex flex-col">
          <div
            className={`flex items-center gap-[2px] opacity-80 ${
              isPrintVersion ? "h-[3mm]" : "h-4"
            }`}
          >
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`h-full bg-white ${
                  (i * 7) % 3 === 0 ? "w-[2px]" : (i * 5) % 4 === 0 ? "w-[3px]" : "w-[1px]"
                }`}
              />
            ))}
          </div>
          <span
            className={`font-mono text-gray-400 tracking-wider ${
              isPrintVersion ? "text-[5pt]" : "text-[8px]"
            }`}
          >
            {registration?.reference || cardNumber}
          </span>
        </div>

        {/* Club Brand Tag */}
        <div className="flex items-center">
          <div className="text-right">
            <span
              className={`text-white/80 font-bold font-display uppercase tracking-wider block ${
                isPrintVersion ? "text-[6.5pt]" : "text-[10px]"
              }`}
            >
              ADD ORAN
            </span>
            <span
              className={`text-gray-500 block font-mono ${
                isPrintVersion ? "text-[5pt]" : "text-[8px]"
              }`}
            >
              Carte Officielle
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * VERSO CARD FACE
 */
export function CardVersoFace({
  participant,
  seasonLabel,
  isPrintVersion = false,
}: {
  participant: MembershipCardProps["participant"];
  seasonLabel: string;
  isPrintVersion?: boolean;
}) {
  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121217] via-[#0D0D11] to-[#16161D] border border-white/20 flex flex-col justify-between shadow-2xl select-none text-white ${
        isPrintVersion
          ? "p-[3.5mm] rounded-[3.18mm] text-[7pt] leading-tight"
          : "p-4"
      }`}
      style={{
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Magnetic Stripe Bar */}
      <div
        className={`absolute left-0 right-0 bg-black/95 border-y border-white/10 flex items-center justify-end pr-3 ${
          isPrintVersion ? "top-[3.5mm] h-[8mm]" : "top-5 h-9"
        }`}
      >
        <span
          className={`font-mono text-gray-500 tracking-widest ${
            isPrintVersion ? "text-[5pt]" : "text-[8px]"
          }`}
        >
          ADD-MAGNETIC-PASS-SECURE
        </span>
      </div>

      {/* Verso Content */}
      <div
        className={`space-y-2 ${
          isPrintVersion ? "pt-[10mm]" : "pt-12"
        }`}
      >
        {/* Conditions */}
        <div className="p-2 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
          <span
            className={`font-bold uppercase text-[#FFD21F] flex items-center gap-1 font-mono ${
              isPrintVersion ? "text-[6pt]" : "text-[9px]"
            }`}
          >
            <ShieldCheck className="w-2.5 h-2.5 text-[#FFD21F]" />
            Conditions Officielles & Validité ({seasonLabel})
          </span>
          <p
            className={`text-gray-400 leading-tight ${
              isPrintVersion ? "text-[5.5pt]" : "text-[9px]"
            }`}
          >
            Cette carte d&apos;adhérent est strictement personnelle et incessible. Elle donne
            accès aux entraînements, ateliers et événements officiels de l&apos;Académie ADD Oran
            sous réserve du respect du règlement intérieur.
          </p>
        </div>

        {/* Signatures & Stamp */}
        <div className="grid grid-cols-2 gap-3 pt-0.5">
          {/* Signature Member */}
          <div className="border-b border-dashed border-gray-600 pb-1">
            <span
              className={`text-gray-500 uppercase font-mono block ${
                isPrintVersion ? "text-[5pt]" : "text-[8px]"
              }`}
            >
              Signature du titulaire
            </span>
            <div
              className={`font-display italic text-gray-300 flex items-center ${
                isPrintVersion ? "h-[5mm] text-[8pt]" : "h-6 text-xs"
              }`}
            >
              {participant.firstName} {participant.lastName}
            </div>
          </div>

          {/* Club Stamp */}
          <div className="border border-red-500/30 bg-red-500/[0.05] rounded-lg p-1 text-center flex flex-col items-center justify-center">
            <span
              className={`font-bold text-[#E52421] uppercase font-display ${
                isPrintVersion ? "text-[6pt]" : "text-[8px]"
              }`}
            >
              CLUB ADD ORAN
            </span>
            <span
              className={`text-gray-400 font-mono ${
                isPrintVersion ? "text-[5pt]" : "text-[7px]"
              }`}
            >
              CACHET OFFICIEL
            </span>
          </div>
        </div>
      </div>

      {/* Verso Footer: Club Contacts */}
      <div
        className={`pt-1.5 border-t border-white/10 flex items-center justify-between text-gray-400 font-mono ${
          isPrintVersion ? "text-[5.5pt]" : "text-[9px]"
        }`}
      >
        <div className="flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-[#E52421]" />
          <span>Oran, Algérie</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-2.5 h-2.5 text-[#FFD21F]" />
          <span>+213 555 00 00 00</span>
        </div>
        <span className="text-[#00D4FF] font-bold">registration.addpkoran.com</span>
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
