"use client";

import React, { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
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
        <p className="font-mono text-xs text-gray-400">Préparation de la carte d&apos;adhérent (CR80)...</p>
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
    <div className="min-h-screen bg-[#0A0A0D] py-6 px-4 sm:px-6 text-[#F5F5F2] selection:bg-[#E52421] selection:text-white print:bg-white print:p-0 print:min-h-0">
      {/* ========================================================================= */}
      {/* CONTROL & ACTION BAR (HIDDEN DURING PRINT)                                */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto mb-6 no-print space-y-3">
        <div className="bg-[#141419]/90 border border-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
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
                Carte d&apos;adhérent officielle // CR80
              </h1>
              <p className="font-mono text-[11px] text-gray-400">
                {participant.firstName} {participant.lastName} • {cardNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl font-display font-black text-xs uppercase tracking-wider transition shadow-lg shadow-[#E52421]/25 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Enregistrer en PDF</span>
            </button>
          </div>
        </div>

        {/* Helpful Tip Banner */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-gray-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px]">
            <span>
              <strong>Pour un PDF ou une impression PVC parfaite :</strong> dans la fenêtre d&apos;impression de votre navigateur, cochez impérativement l&apos;option <strong>« Graphismes d&apos;arrière-plan »</strong> (Background Graphics) et choisissez <strong>« Enregistrer au format PDF »</strong> ou votre badgeuse.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE PRINTABLE SHEET (A4 / CR80 PVC PAIR)                                  */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto bg-white text-black p-8 sm:p-12 rounded-3xl shadow-2xl print:shadow-none print:m-0 print:p-0 print:w-full print:rounded-none print:max-w-none">
        <div className="w-full flex flex-col items-center justify-center space-y-8 sm:space-y-10">
          {/* Sheet Header Information */}
          <div className="text-center space-y-1 border-b border-gray-300 pb-4 w-full">
            <div className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-black">
              Académie Art Du Déplacement Parkour Oran
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">
              Carte d&apos;Adhérent Officielle — Planche d&apos;Impression PVC (CR80)
            </p>
            <p className="text-[10px] font-mono text-gray-500">
              Norme ISO/IEC 7810 ID-1 • Dimensions exactes : 85.60 mm × 53.98 mm • Échelle 100%
            </p>
            <p className="text-[10px] font-mono text-gray-600 font-semibold pt-1">
              Adhérent(e) : {participant.firstName} {participant.lastName} • Réf : {cardNumber} • {seasonLabel}
            </p>
          </div>

          {/* Cards Pair: RECTO & VERSO with Precision Crop Marks */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 sm:gap-14 py-4">
            {/* RECTO CR80 */}
            <div className="relative flex flex-col items-center">
              <CropMarks />
              <div
                className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-md print:shadow-none"
                style={{
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
              <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-3">
                ▲ Face 1 : Recto (85.60 × 53.98 mm)
              </span>
            </div>

            {/* VERSO CR80 */}
            <div className="relative flex flex-col items-center">
              <CropMarks />
              <div
                className="w-[85.6mm] h-[53.98mm] rounded-[3.18mm] overflow-hidden shadow-md print:shadow-none"
                style={{
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
              <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-3">
                ▲ Face 2 : Verso (85.60 × 53.98 mm)
              </span>
            </div>
          </div>

          {/* 50 mm Calibration Bar */}
          <div className="pt-6 border-t border-gray-200 flex flex-col items-center space-y-2 w-full max-w-md text-center">
            <div className="w-[50mm] border-b-2 border-black flex justify-between text-[8px] font-mono font-black">
              <span>| 0mm</span>
              <span className="text-[7.5px] text-gray-700 font-bold uppercase">50 mm (Règle d&apos;étalonnage 100%)</span>
              <span>50mm |</span>
            </div>
            <p className="text-[9px] text-gray-500 font-mono leading-relaxed">
              Placez une règle physique sur le repère ci-dessus. S&apos;il mesure exactement 50 mm, la carte finale fera exactement la dimension standard d&apos;une carte bancaire PVC (85.60 × 53.98 mm).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
