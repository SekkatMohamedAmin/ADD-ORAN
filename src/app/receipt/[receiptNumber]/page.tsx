"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import { Locale, getDictionary, isRTL } from "@/lib/i18n";

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ receiptNumber: string }>;
}) {
  const { receiptNumber } = use(params);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<Locale>("fr");

  const t = getDictionary(lang);
  const isDocRtl = isRTL(lang);

  useEffect(() => {
    async function loadReceipt() {
      try {
        const res = await fetch(`/api/receipt?receiptNumber=${encodeURIComponent(receiptNumber)}`);
        if (!res.ok) {
          throw new Error("Reçu introuvable");
        }
        const data = await res.json();
        setPayment(data.payment);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadReceipt();
  }, [receiptNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00141f] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-[#EDAE49] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-[#00141f] flex items-center justify-center p-4">
        <div className="bg-[#072538] border border-[#17425f] rounded-xl p-6 text-center text-[#f17887] text-xs font-mono">
          {error || "Reçu non trouvé"}
        </div>
      </div>
    );
  }

  const p = payment.registration.participant;

  return (
    <div className="min-h-screen bg-[#00141f] py-8 px-4 sm:px-6 text-[#f4f7f9]">
      {/* Control Bar (hidden during printing) */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between no-print bg-[#072538] border border-[#17425f] p-4 rounded-2xl shadow-xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-mono text-xs font-semibold text-[#8faec5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#EDAE49]" />
          Retour
        </Link>

        {/* Language selector */}
        <div className="flex gap-1 bg-[#00141f] p-1 rounded-xl border border-[#17425f]">
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`px-3 py-1 font-mono text-xs font-bold rounded-lg transition-colors ${
              lang === "fr" ? "bg-[#003D5B] text-[#EDAE49]" : "text-[#8faec5]"
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLang("ar")}
            className={`px-3 py-1 font-mono text-xs font-bold rounded-lg transition-colors ${
              lang === "ar" ? "bg-[#003D5B] text-[#EDAE49]" : "text-[#8faec5]"
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1 font-mono text-xs font-bold rounded-lg transition-colors ${
              lang === "en" ? "bg-[#003D5B] text-[#EDAE49]" : "text-[#8faec5]"
            }`}
          >
            EN
          </button>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn-print flex items-center gap-2 px-5 py-2.5 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
        >
          <Printer className="w-4 h-4" />
          Imprimer le reçu
        </button>
      </div>

      {/* Printable Sheet */}
      <div
        dir={isDocRtl ? "rtl" : "ltr"}
        className="printable-document max-w-2xl mx-auto bg-white text-neutral-900 border-2 border-neutral-900 rounded-xl p-8 sm:p-10 shadow-2xl space-y-6"
      >
        <div className="border-b-2 border-neutral-900 pb-4 text-center">
          <h1 className="text-lg font-black uppercase text-neutral-950 tracking-tight">
            {t.paperwork.clubHeader}
          </h1>
          <p className="text-[11px] uppercase font-bold text-neutral-600">
            Association Sportive Agréée — Oran, Algérie
          </p>
          <div className="mt-3 text-xs font-black uppercase tracking-wider bg-neutral-900 text-white py-1.5 px-4 rounded inline-block">
            {t.paperwork.receiptTitle}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs border-b border-neutral-300 pb-3">
          <div>
            <span className="text-neutral-500 block">Numéro de reçu officiel :</span>
            <span className="font-mono font-black text-sm text-neutral-900">{payment.receiptNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-neutral-500 block">Date de perception :</span>
            <span className="font-bold text-neutral-900">
              {new Date(payment.paidAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-neutral-100 rounded border border-neutral-300 grid grid-cols-2 gap-3">
            <div>
              <span className="text-neutral-500 block">Adhérent :</span>
              <span className="font-bold text-sm text-neutral-900 uppercase">
                {p.lastName} {p.firstName}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Téléphone :</span>
              <span className="font-mono font-bold text-neutral-900" dir="ltr">{p.phone}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Référence d&apos;inscription :</span>
              <span className="font-mono font-bold text-neutral-900">{payment.registration.reference}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Saison Sportive :</span>
              <span className="font-bold text-neutral-900">{payment.season.label}</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded border border-neutral-300 flex justify-between items-center mt-3">
            <div>
              <span className="font-bold text-neutral-900 text-xs block">{payment.paymentPurpose}</span>
              <span className="text-[11px] text-neutral-600">{t.paperwork.paymentMethodCash}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 text-[10px] block uppercase">Montant Reçu</span>
              <span className="text-xl font-black text-emerald-800">
                {payment.amount.toLocaleString()} DZD
              </span>
            </div>
          </div>
        </div>

        {/* Signature & Manual Stamp Boxes */}
        <div className="pt-6 border-t-2 border-neutral-900 grid grid-cols-2 gap-6 text-xs">
          <div className="border border-neutral-400 rounded-lg p-3 text-center space-y-12">
            <span className="font-bold block uppercase text-[11px]">Signature de l&apos;adhérent</span>
            <div className="h-10"></div>
          </div>

          <div className="stamp-box border-2 border-dashed border-neutral-800 rounded-lg p-3 text-center flex flex-col justify-between">
            <span className="font-bold block uppercase text-[11px]">{t.paperwork.clubStampArea}</span>
            <div className="h-10"></div>
            <span className="text-[9px] text-neutral-500 italic block">
              Cachet manuel officiel et signature du trésorier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
