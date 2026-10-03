"use client";

import React, { useEffect, useState, use } from "react";
import { Locale, getDictionary, isRTL } from "@/lib/i18n";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PaperworkData {
  reference: string;
  status: string;
  season: { code: string; label: string };
  participant: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    phone: string;
    email?: string;
    address?: string;
    bloodType?: string;
    isMinor: boolean;
  };
  disciplines: Array<{
    discipline: {
      nameFr: string;
      nameAr: string;
      nameEn: string;
      slug: string;
    };
  }>;
  parentalAuthorization?: {
    guardianName: string;
    acceptedAt: string;
    authorizationVersion: string;
  } | null;
  payments?: Array<{
    receiptNumber: string;
    amount: number;
    paymentPurpose: string;
    paidAt: string;
  }>;
  submittedAt: string;
  engagementVersion?: string;
}

export default function PaperworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [docType, setDocType] = useState<"DOSSIER" | "CONFIRMATION" | "ENGAGEMENT" | "PARENTAL" | "RECEIPT">("DOSSIER");
  const [lang, setLang] = useState<Locale>("fr");
  const [data, setData] = useState<PaperworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = getDictionary(lang);
  const isDocRtl = isRTL(lang);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/paperwork/data?id=${id}`);
        if (!res.ok) {
          throw new Error("Impossible de charger les données du document.");
        }
        const json = await res.json();
        setData(json.registration);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex items-center justify-center text-[#9E9EA8]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#E52421] border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-[#E52421]/20" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#9E9EA8]">Chargement du document officiel...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141419] border border-white/10 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <p className="text-[#FF8585] text-xs font-mono">{error || "Document non trouvé"}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono border border-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#E52421]" /> Retour à mon espace
          </Link>
        </div>
      </div>
    );
  }

  const formattedDob = new Date(data.participant.dateOfBirth).toLocaleDateString(
    lang === "ar" ? "ar-DZ" : lang === "en" ? "en-US" : "fr-FR"
  );
  const formattedDate = new Date(data.submittedAt).toLocaleDateString(
    lang === "ar" ? "ar-DZ" : lang === "en" ? "en-US" : "fr-FR"
  );

  return (
    <div className="min-h-screen bg-[#0A0A0D] py-8 px-4 sm:px-6 selection:bg-[#E52421] selection:text-white">
      {/* Control Bar (hidden during printing) */}
      <div className="max-w-4xl mx-auto mb-8 bg-[#141419]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-mono text-xs font-semibold text-[#9E9EA8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#E52421]" />
            Retour à l&apos;espace
          </Link>

          {/* Document Type Selector */}
          <div className="flex flex-wrap gap-1.5 bg-[#0A0A0D]/80 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setDocType("DOSSIER")}
              className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition-all ${
                docType === "DOSSIER" ? "bg-[#E52421] text-white shadow-md shadow-[#E52421]/30" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              Dossier Complet
            </button>
            <button
              type="button"
              onClick={() => setDocType("CONFIRMATION")}
              className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition-all ${
                docType === "CONFIRMATION" ? "bg-[#E52421] text-white shadow-md shadow-[#E52421]/30" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              Confirmation
            </button>
            <button
              type="button"
              onClick={() => setDocType("ENGAGEMENT")}
              className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition-all ${
                docType === "ENGAGEMENT" ? "bg-[#E52421] text-white shadow-md shadow-[#E52421]/30" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              Engagement
            </button>
            {data.participant.isMinor && (
              <button
                type="button"
                onClick={() => setDocType("PARENTAL")}
                className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition-all ${
                  docType === "PARENTAL" ? "bg-[#E52421] text-white shadow-md shadow-[#E52421]/30" : "text-[#9E9EA8] hover:text-white"
                }`}
              >
                Autorisation Parentale
              </button>
            )}
            {data.payments && data.payments.length > 0 && (
              <button
                type="button"
                onClick={() => setDocType("RECEIPT")}
                className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition-all ${
                  docType === "RECEIPT" ? "bg-[#E52421] text-white shadow-md shadow-[#E52421]/30" : "text-[#9E9EA8] hover:text-white"
                }`}
              >
                Reçu de Paiement
              </button>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#0A0A0D]/80 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1 font-mono text-xs font-bold rounded-lg transition-colors ${
                lang === "fr" ? "bg-[#E52421]/20 text-[#FFD21F] border border-[#E52421]/40" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-2.5 py-1 font-mono text-xs font-bold rounded-lg transition-colors ${
                lang === "ar" ? "bg-[#E52421]/20 text-[#FFD21F] border border-[#E52421]/40" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 font-mono text-xs font-bold rounded-lg transition-colors ${
                lang === "en" ? "bg-[#E52421]/20 text-[#FFD21F] border border-[#E52421]/40" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#E52421]/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div
        dir={isDocRtl ? "rtl" : "ltr"}
        className="printable-document max-w-4xl mx-auto bg-white text-neutral-900 border-2 border-neutral-900 rounded-xl p-8 sm:p-12 shadow-2xl space-y-8"
      >
        {/* Header */}
        <div className="border-b-2 border-neutral-900 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
              {t.paperwork.clubHeader}
            </h1>
            <p className="text-xs uppercase font-bold text-neutral-600">
              Association Sportive Communale Agréée — Oran, Algérie
            </p>
            <div className="text-xs font-bold text-amber-700 mt-1">
              Saison : {data.season.label} ({data.season.code})
            </div>
          </div>
          <div className="text-right border-2 border-neutral-900 px-3 py-1.5 rounded-lg bg-neutral-100">
            <div className="text-[10px] font-bold uppercase text-neutral-500">Référence Officielle</div>
            <div className="text-base font-black font-mono tracking-wider">{data.reference}</div>
          </div>
        </div>

        {/* Document Title Banner */}
        <div className="bg-neutral-900 text-white text-center py-2 px-4 rounded font-black text-sm uppercase tracking-wider">
          {docType === "DOSSIER" && t.paperwork.officialDossierTitle}
          {docType === "CONFIRMATION" && t.paperwork.confirmationTitle}
          {docType === "ENGAGEMENT" && t.paperwork.engagementTitle}
          {docType === "PARENTAL" && t.paperwork.parentalAuthTitle}
          {docType === "RECEIPT" && t.paperwork.receiptTitle}
        </div>

        {/* Participant Identity Box */}
        {(docType === "DOSSIER" || docType === "CONFIRMATION" || docType === "RECEIPT") && (
          <div className="border border-neutral-300 rounded-lg p-5 space-y-3 bg-neutral-50">
            <h3 className="text-xs font-black uppercase text-neutral-600 tracking-wider">
              {t.paperwork.participantHeader}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Nom & Prénom :</span>
                <span className="font-bold text-sm text-neutral-900">
                  {data.participant.lastName.toUpperCase()} {data.participant.firstName}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Date de naissance :</span>
                <span className="font-bold text-neutral-900">{formattedDob}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Lieu de naissance :</span>
                <span className="font-bold text-neutral-900">{data.participant.placeOfBirth}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Téléphone portable :</span>
                <span className="font-bold text-neutral-900 font-mono" dir="ltr">{data.participant.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Groupe Sanguin :</span>
                <span className="font-bold text-neutral-900">{data.participant.bloodType || "N/A"}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Statut Adhérent :</span>
                <span className="font-bold text-neutral-900">
                  {data.participant.isMinor ? "Mineur (< 18 ans)" : "Majeur (≥ 18 ans)"}
                </span>
              </div>
            </div>
            {data.participant.address && (
              <div className="text-xs pt-2 border-t border-neutral-200">
                <span className="text-neutral-500">Adresse de résidence : </span>
                <span className="font-semibold text-neutral-900">{data.participant.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Disciplines Chosen */}
        {(docType === "DOSSIER" || docType === "CONFIRMATION") && (
          <div className="border border-neutral-300 rounded-lg p-5 bg-neutral-50 space-y-2">
            <h3 className="text-xs font-black uppercase text-neutral-600 tracking-wider">
              {t.dashboard.selectedDisciplines}
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.disciplines.map((d) => (
                <span
                  key={d.discipline.slug}
                  className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold rounded-full"
                >
                  ✓ {lang === "ar" ? d.discipline.nameAr : lang === "en" ? d.discipline.nameEn : d.discipline.nameFr}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Text */}
        {(docType === "DOSSIER" || docType === "ENGAGEMENT") && (
          <div className="border border-neutral-300 rounded-lg p-5 space-y-3 text-xs leading-relaxed text-neutral-800">
            <h3 className="font-black uppercase text-neutral-900 tracking-wide">
              {t.registration.engagementStep.clubCommitmentTitle}
            </h3>
            <p className="text-justify">{t.registration.engagementStep.clubCommitmentText}</p>
            <div className="pt-2 font-bold text-emerald-800 flex items-center gap-1.5">
              <span>✓ Consentement numérique enregistré le {formattedDate} (Version {data.engagementVersion || "v1.0-2026"})</span>
            </div>
          </div>
        )}

        {/* Parental Authorization Section if minor */}
        {(docType === "DOSSIER" || docType === "PARENTAL") && data.participant.isMinor && (
          <div className="border-2 border-amber-900/40 rounded-lg p-5 space-y-4 bg-amber-50/50">
            <h3 className="font-black uppercase text-amber-950 tracking-wide text-xs">
              {t.registration.engagementStep.parentalTitle}
            </h3>
            <p className="text-xs text-neutral-800 leading-relaxed text-justify">
              {t.registration.engagementStep.parentalDeclarationText}
            </p>
            <div className="text-xs font-bold text-neutral-900">
              Tuteur légal déclaré : {data.parentalAuthorization?.guardianName || "Non renseigné"}
            </div>

            {/* Signature & APC Visa boxes */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="border border-neutral-400 rounded p-3 text-center bg-white space-y-10">
                <span className="text-[11px] font-bold block">{t.paperwork.guardianSignatureArea}</span>
                <div className="h-10"></div>
                <span className="text-[10px] text-neutral-500 block border-t border-dashed border-neutral-300 pt-1">
                  Signature manuscrite
                </span>
              </div>
              <div className="stamp-box border-2 border-dashed border-neutral-500 rounded p-3 text-center bg-white flex flex-col justify-between">
                <span className="text-[11px] font-bold block">{t.paperwork.apcVisaArea}</span>
                <div className="h-10"></div>
                <span className="text-[10px] text-neutral-500 block">
                  Cachet officiel de la commune (APC)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Box */}
        {docType === "RECEIPT" && data.payments && data.payments.length > 0 && (
          <div className="border-2 border-neutral-900 rounded-lg p-6 bg-neutral-50 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-300 pb-3">
              <div>
                <span className="text-xs text-neutral-500 block">Numéro de reçu :</span>
                <span className="font-mono font-black text-base text-neutral-900">
                  {data.payments[0].receiptNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 block">Date du paiement :</span>
                <span className="font-bold text-xs text-neutral-900">
                  {new Date(data.payments[0].paidAt).toLocaleDateString(
                    lang === "ar" ? "ar-DZ" : "fr-FR"
                  )}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-700">{t.paperwork.paymentProofText}</p>
            <div className="p-3 bg-white border border-neutral-300 rounded flex justify-between items-center">
              <span className="text-xs font-bold">{data.payments[0].paymentPurpose}</span>
              <span className="text-lg font-black text-emerald-800">
                {data.payments[0].amount.toLocaleString()} DZD
              </span>
            </div>
            <div className="text-xs text-neutral-600 font-semibold">
              {t.paperwork.paymentMethodCash}
            </div>
          </div>
        )}

        {/* Footer Stamp & Signature Areas */}
        <div className="pt-8 border-t-2 border-neutral-900 grid grid-cols-2 gap-8 text-xs">
          <div className="border border-neutral-400 rounded-lg p-4 text-center bg-neutral-50 space-y-12">
            <span className="font-bold block uppercase">{t.paperwork.participantSignatureArea}</span>
            <div className="h-12"></div>
            <span className="text-[10px] text-neutral-500 block">
              Fait à Oran, le {formattedDate}
            </span>
          </div>

          <div className="stamp-box border-2 border-dashed border-neutral-800 rounded-lg p-4 text-center bg-neutral-50 flex flex-col justify-between">
            <span className="font-bold block uppercase">{t.paperwork.clubStampArea}</span>
            <div className="h-12"></div>
            <span className="text-[10px] text-neutral-500 italic block">
              Emplacement réservé au cachet humide officiel du Club
            </span>
          </div>
        </div>

        {/* Bottom audit line */}
        <div className="text-[10px] text-neutral-400 text-center border-t border-neutral-200 pt-3">
          {t.paperwork.printedOn} {new Date().toLocaleString(lang === "ar" ? "ar-DZ" : "fr-FR")} — ADD Parkour Oran
        </div>
      </div>
    </div>
  );
}
