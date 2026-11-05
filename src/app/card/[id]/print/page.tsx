"use client";

import React, { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { CardRectoFace, CardVersoFace, CropMarks } from "@/components/MembershipCard";

export default function CardPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const autoprint = searchParams.get("autoprint");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Print Mode:
  // "cr80" = Exact CR80 2-Page output (Page 1 = Recto, Page 2 = Verso, 85.60 × 53.98 mm, 0 margin, 0 extra text)
  //          Optimized directly for PVC card printing machines (Evolis, Zebra, Magicard) and PDF upload.
  // "sheet" = Planche A4 (Side-by-side Recto + Verso) with zero extraneous text in print.
  const [printMode, setPrintMode] = useState<"cr80" | "sheet">("cr80");
  const [showCropMarks, setShowCropMarks] = useState(false);

  useEffect(() => {
    async function loadCardData() {
      try {
        const res = await fetch(`/api/card?id=${encodeURIComponent(id)}`);
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.error || "Carte ou adhérent introuvable");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadCardData();
  }, [id]);

  // Autoprint trigger once data is ready
  useEffect(() => {
    if (data && autoprint === "1") {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data, autoprint]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-2 border-[#E52421] border-t-transparent rounded-full animate-spin shadow-lg shadow-[#E52421]/20" />
        <p className="font-mono text-xs text-gray-400">
          Préparation de la carte d&apos;adhérent (CR80 Haute Définition)...
        </p>
      </div>
    );
  }

  if (error || !data?.participant) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex flex-col items-center justify-center p-4">
        <div className="bg-[#141419] border border-white/10 rounded-2xl p-6 text-center max-w-md w-full space-y-4 shadow-2xl">
          <p className="text-[#FF8585] text-xs font-mono">{error || "Impossible de charger la carte"}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au tableau de bord</span>
          </Link>
        </div>
      </div>
    );
  }

  const { participant, registration, photoDocId } = data;

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
    (d: any) => d.discipline.nameFr || d.discipline.slug?.toUpperCase() || "PARKOUR"
  ) || ["PARKOUR", "FREERUN"];

  return (
    <div className="min-h-screen bg-[#0A0A0D] py-6 px-4 sm:px-6 text-[#F5F5F2] selection:bg-[#E52421] selection:text-white print:bg-white print:p-0 print:m-0 print:min-h-0 print:w-auto">
      {/* ========================================================================= */}
      {/* DYNAMIC SCOPED PRINT STYLES FOR ZERO-MARGIN PVC & NO EXTRANEOUS TEXT     */}
      {/* ========================================================================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: ${printMode === "cr80" ? "85.6mm 53.98mm" : "auto"};
            margin: 0mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          .screen-only-info {
            display: none !important;
          }
          .cr80-print-page-1 {
            width: 85.6mm !important;
            height: 53.98mm !important;
            page-break-after: always !important;
            break-after: page !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .cr80-print-page-2 {
            width: 85.6mm !important;
            height: 53.98mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .sheet-print-container {
            margin: 0 !important;
            padding: 8mm !important;
            background: #FFFFFF !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12mm !important;
          }
        }
      `,
        }}
      />

      {/* ========================================================================= */}
      {/* CONTROL & ACTION BAR (HIDDEN DURING PRINT)                                */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto mb-6 no-print print:hidden space-y-4">
        <div className="bg-[#141419]/90 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl font-mono text-xs transition border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-[#E52421]" />
              <span>Retour</span>
            </Link>
            <div>
              <h1 className="font-display font-black text-sm uppercase text-white tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFD21F]" />
                Impression Carte d&apos;Adhérent // Prêt Machine PVC
              </h1>
              <p className="font-mono text-[11px] text-gray-400">
                {participant.firstName} {participant.lastName} • {cardNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode Selector */}
            <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setPrintMode("cr80")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  printMode === "cr80"
                    ? "bg-[#E52421] text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Génère un PDF 2 pages (Recto / Verso) sans marges ni texte parasite, aux dimensions exactes 85.60 × 53.98 mm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Format Machine PVC (2 Pages)</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintMode("sheet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  printMode === "sheet"
                    ? "bg-white/20 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Planche A4 avec Recto et Verso côte à côte"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Planche A4 (Côte à côte)</span>
              </button>
            </div>

            {/* Direct Print / Export Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-[#E52421]/25 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Exporter en PDF / Imprimer</span>
            </button>
          </div>
        </div>

        {/* Informative Operator / Fabricator Banner */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Format conforme pour fabricant & machine PVC (Zéro texte parasite)</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed pl-6">
            Lors de l&apos;exportation en <strong>PDF</strong>, aucun en-tête, aucun texte d&apos;aide, ni règle d&apos;étalonnage ne sera imprimé.{" "}
            {printMode === "cr80" ? (
              <span>
                Le PDF comportera <strong>exactement 2 pages aux dimensions ISO/IEC 7810 ID-1 (85.60 × 53.98 mm)</strong> : Page 1 = Recto, Page 2 = Verso. Le fabricant peut charger directement ce PDF dans la machine PVC (Evolis, Zebra, Magicard, etc.).
              </span>
            ) : (
              <span>
                Le PDF comportera les deux faces Recto et Verso côte à côte sur une même planche épurée.
              </span>
            )}
          </p>

          <div className="pt-2 pl-6 flex flex-wrap items-center gap-4 text-[10.5px] text-gray-400 border-t border-emerald-500/20">
            <span>
              ✓ Destination : <strong>« Enregistrer au format PDF »</strong>
            </span>
            <span>
              ✓ Marges : <strong>« Aucune » (None)</strong>
            </span>
            <span>
              ✓ Graphismes d&apos;arrière-plan : <strong>« Activé » (Background Graphics)</strong>
            </span>
            <span>
              ✓ En-têtes & pieds de page : <strong>« Désactivé »</strong>
            </span>
          </div>
        </div>

        {/* Optional Crop Marks Toggle for Sheet Mode */}
        {printMode === "sheet" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-gray-300">
            <input
              type="checkbox"
              id="cropMarksToggle"
              checked={showCropMarks}
              onChange={(e) => setShowCropMarks(e.target.checked)}
              className="rounded accent-[#E52421] cursor-pointer"
            />
            <label htmlFor="cropMarksToggle" className="cursor-pointer select-none">
              Afficher les repères de coupe (Crop marks pour découpe manuelle A4)
            </label>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* THE PRINTABLE SHEET / CARD CONTAINER                                      */}
      {/* On screen: styled container with preview text                             */}
      {/* On print/PDF: ZERO EXTRA TEXT, ONLY THE PURE CARDS                        */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto bg-white text-black p-6 sm:p-10 rounded-3xl shadow-2xl print:shadow-none print:m-0 print:p-0 print:w-full print:rounded-none print:max-w-none print:bg-white">
        {/* Screen-Only Header Information (COMPLETELY HIDDEN IN PRINT/PDF) */}
        <div className="screen-only-info print:hidden text-center space-y-1 border-b border-gray-300 pb-4 mb-8 w-full">
          <div className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-black flex items-center justify-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#E52421]" />
            Académie Art Du Déplacement Parkour Oran
          </div>
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">
            Carte d&apos;Adhérent Officielle — {printMode === "cr80" ? "Format Machine PVC (CR80)" : "Planche A4"}
          </p>
          <p className="text-[10px] font-mono text-gray-500">
            Norme ISO/IEC 7810 ID-1 • Dimensions exactes : 85.60 mm × 53.98 mm • Échelle 100%
          </p>
          <p className="text-[10px] font-mono text-gray-600 font-semibold pt-1">
            Adhérent(e) : {participant.firstName} {participant.lastName} • Réf : {cardNumber} • {seasonLabel}
          </p>
        </div>

        {/* ======================================================================= */}
        {/* MODE 1: CR80 BADGE MACHINE (2 PAGES: PAGE 1 RECTO, PAGE 2 VERSO)        */}
        {/* ======================================================================= */}
        {printMode === "cr80" ? (
          <div className="w-full flex flex-col items-center justify-center space-y-8 print:space-y-0 print:block">
            {/* FACE 1: RECTO */}
            <div className="cr80-print-page-1 relative flex flex-col items-center">
              <div
                className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-md print:shadow-none print:rounded-[3.18mm]"
                style={{
                  width: "85.6mm",
                  height: "53.98mm",
                  boxSizing: "border-box",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
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
                  isPrintVersion
                />
              </div>

              {/* Screen-Only Label (HIDDEN IN PRINT/PDF) */}
              <span className="screen-only-info print:hidden font-mono text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-3">
                ▲ Face 1 : Recto (85.60 × 53.98 mm) — Page 1 du PDF
              </span>
            </div>

            {/* FACE 2: VERSO */}
            <div className="cr80-print-page-2 relative flex flex-col items-center">
              <div
                className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-md print:shadow-none print:rounded-[3.18mm]"
                style={{
                  width: "85.6mm",
                  height: "53.98mm",
                  boxSizing: "border-box",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <CardVersoFace
                  participant={participant}
                  seasonLabel={seasonLabel}
                  isPrintVersion
                />
              </div>

              {/* Screen-Only Label (HIDDEN IN PRINT/PDF) */}
              <span className="screen-only-info print:hidden font-mono text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-3">
                ▲ Face 2 : Verso (85.60 × 53.98 mm) — Page 2 du PDF
              </span>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* MODE 2: PLANCHE A4 (RECTO & VERSO CÔTE À CÔTE SANS TEXTE PARASITE)     */
          /* ======================================================================= */
          <div className="sheet-print-container w-full flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-14 py-4">
            {/* RECTO */}
            <div className="relative flex flex-col items-center">
              {showCropMarks && <CropMarks />}
              <div
                className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-md print:shadow-none"
                style={{
                  width: "85.6mm",
                  height: "53.98mm",
                  boxSizing: "border-box",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
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
                  isPrintVersion
                />
              </div>

              {/* Screen-Only Label (HIDDEN IN PRINT/PDF) */}
              <span className="screen-only-info print:hidden font-mono text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-3">
                ▲ Face 1 : Recto (85.60 × 53.98 mm)
              </span>
            </div>

            {/* VERSO */}
            <div className="relative flex flex-col items-center">
              {showCropMarks && <CropMarks />}
              <div
                className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-md print:shadow-none"
                style={{
                  width: "85.6mm",
                  height: "53.98mm",
                  boxSizing: "border-box",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <CardVersoFace
                  participant={participant}
                  seasonLabel={seasonLabel}
                  isPrintVersion
                />
              </div>

              {/* Screen-Only Label (HIDDEN IN PRINT/PDF) */}
              <span className="screen-only-info print:hidden font-mono text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-3">
                ▲ Face 2 : Verso (85.60 × 53.98 mm)
              </span>
            </div>
          </div>
        )}

        {/* Screen-Only 50 mm Calibration Bar (COMPLETELY HIDDEN IN PRINT/PDF) */}
        <div className="screen-only-info print:hidden pt-8 mt-6 border-t border-gray-200 flex flex-col items-center space-y-2 w-full max-w-md mx-auto text-center">
          <div className="w-[50mm] border-b-2 border-black flex justify-between text-[8px] font-mono font-black">
            <span>| 0mm</span>
            <span className="text-[7.5px] text-gray-700 font-bold uppercase">
              50 mm (Règle d&apos;étalonnage 100%)
            </span>
            <span>50mm |</span>
          </div>
          <p className="text-[9px] text-gray-500 font-mono leading-relaxed">
            Repère d&apos;écran : ce guide sert uniquement de contrôle visuel sur votre moniteur. Aucun texte ni règle n&apos;apparaîtra dans le fichier PDF destiné à la machine PVC.
          </p>
        </div>
      </div>
    </div>
  );
}
