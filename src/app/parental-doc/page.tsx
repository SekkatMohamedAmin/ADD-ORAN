"use client";

import React from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Printer, ShieldCheck } from "lucide-react";

export default function ParentalDocPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 no-print">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E52421]/15 border border-[#E52421]/30 text-[#FFD21F] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E52421]" />
              <span>Document Officiel // Autorisation Parentale</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {t.paperwork.parentalAuthTitle}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-print flex items-center gap-2 px-6 py-3 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E52421]/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Printer className="w-4 h-4" />
            {t.common.print}
          </button>
        </div>

        {/* Paper Document Container */}
        <div className="printable-document bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-neutral-200 space-y-8">
          {/* Header */}
          <div className="text-center border-b border-neutral-800 pb-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-amber-500 uppercase tracking-wider">
              {t.paperwork.clubHeader}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase font-semibold">
              Association Sportive Communale — Wilaya d&apos;Oran
            </p>
            <div className="mt-4 text-sm font-bold text-white bg-neutral-800/60 inline-block px-4 py-1 rounded">
              {t.paperwork.parentalAuthTitle} — SAISON 2025/2026
            </div>
          </div>

          {/* Legal Text */}
          <div className="space-y-4 text-sm leading-relaxed text-neutral-300">
            <p>
              Je soussigné(e), Père / Mère / Tuteur légal :
            </p>
            <div className="p-3 bg-neutral-950/60 rounded border border-neutral-800 space-y-1">
              <div className="flex gap-2">
                <span className="font-semibold text-neutral-400">Nom et Prénom du tuteur :</span>
                <span className="text-white border-b border-dashed border-neutral-600 flex-1"></span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-neutral-400">Numéro de CNI / Passeport :</span>
                <span className="text-white border-b border-dashed border-neutral-600 flex-1"></span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-neutral-400">Délivrée le :</span>
                <span className="text-white border-b border-dashed border-neutral-600 flex-1"></span>
                <span className="font-semibold text-neutral-400">Par :</span>
                <span className="text-white border-b border-dashed border-neutral-600 flex-1"></span>
              </div>
            </div>

            <p>
              Autorise expressément l&apos;adhérent mineur :
            </p>
            <div className="p-3 bg-neutral-950/60 rounded border border-neutral-800 space-y-1">
              <div className="flex gap-2">
                <span className="font-semibold text-neutral-400">Nom et Prénom de l&apos;enfant :</span>
                <span className="text-white border-b border-dashed border-neutral-600 flex-1"></span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-neutral-400">Date et lieu de naissance :</span>
                <span className="text-white border-b border-dashed border-neutral-600 flex-1"></span>
              </div>
            </div>

            <p>
              À s&apos;inscrire et pratiquer au sein du <strong>Club Sportif Art Du Déplacement Parkour Oran</strong> les activités suivantes :
            </p>
            <ul className="list-disc list-inside ps-4 space-y-1 text-neutral-200">
              <li>Parkour & Art Du Déplacement (Entraînements urbains et en salle)</li>
              <li>Escalade & Sports de montagne (Voies artificielles et sites rocheux naturels)</li>
              <li>Trail & Course nature (Sentiers, crêtes et parcours tout-terrain)</li>
            </ul>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs leading-relaxed text-amber-200 space-y-2">
              <p className="font-bold">Engagements et décharges du représentant légal :</p>
              <p>
                1. Je déclare avoir pris connaissance des risques inhérents à ces disciplines sportives et atteste que mon enfant est médicalement apte.
              </p>
              <p>
                2. J&apos;autorise les responsables et encadrants du club à prendre toute mesure médicale ou chirurgicale d&apos;urgence nécessaire en cas d&apos;accident.
              </p>
              <p>
                3. Je m&apos;engage à ce que mon enfant respecte le règlement intérieur et les consignes de sécurité des éducateurs sportifs.
              </p>
            </div>
          </div>

          {/* Signatures & Official Stamping Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-800">
            {/* Guardian Signature */}
            <div className="border border-neutral-700/80 rounded-xl p-4 bg-neutral-950/40 text-center space-y-8">
              <div className="text-xs font-bold uppercase text-neutral-300">
                {t.paperwork.guardianSignatureArea}
              </div>
              <div className="text-xs text-neutral-400">
                (Mention manuscrite « Lu et approuvé » + Signature)
              </div>
              <div className="h-16"></div>
              <div className="text-xs text-neutral-400 border-t border-dashed border-neutral-700 pt-2">
                Fait à Oran, le ......................................
              </div>
            </div>

            {/* APC Visa & Stamp */}
            <div className="stamp-box border-2 border-dashed border-amber-600/60 rounded-xl p-4 bg-amber-950/10 text-center flex flex-col justify-between">
              <div className="text-xs font-bold uppercase text-amber-400">
                {t.paperwork.apcVisaArea}
              </div>
              <div className="text-xs text-neutral-400 italic">
                (Emplacement réservé à la légalisation de signature auprès de l&apos;APC)
              </div>
              <div className="h-16"></div>
              <div className="text-[11px] text-neutral-400">
                Cachet rond et griffe de l&apos;officier de l&apos;état civil
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
