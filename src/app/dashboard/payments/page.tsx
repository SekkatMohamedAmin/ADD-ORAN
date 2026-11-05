"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Receipt,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Users,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Shield,
  Activity,
  Coins,
  Crown,
  Sparkles,
} from "lucide-react";
import {
  PricingConfig,
  DEFAULT_PRICING,
  computeParticipantFees,
  computeFamilyFees,
  ParticipantFeeBreakdown,
  FamilyFeesSummary,
} from "@/lib/pricing-utils";

export default function DashboardPaymentsPage() {
  const { t } = useLanguage();
  const {
    participants,
    selectedParticipantId,
    setSelectedParticipantId,
    selectedParticipant,
    activeRegistration,
    isFamilyAccount,
  } = usePortal();

  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [loadingPricing, setLoadingPricing] = useState(true);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.pricing) setPricing(data.pricing);
      })
      .catch((err) => console.error("Error fetching pricing:", err))
      .finally(() => setLoadingPricing(false));
  }, []);

  if (!selectedParticipant || !activeRegistration) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white/60">
        Aucun dossier actif trouvé.
      </div>
    );
  }

  // Check if staff / executive
  const isStaff = Boolean(
    selectedParticipant.isStaff ||
    selectedParticipant.clubRole ||
    (activeRegistration as any).type === "STAFF"
  );

  // Compute live fees based on admin-defined pricing
  const currentChildFees: ParticipantFeeBreakdown = computeParticipantFees(
    selectedParticipant,
    pricing
  );

  const familyFees: FamilyFeesSummary = computeFamilyFees(
    participants,
    pricing
  );

  const payments = activeRegistration.payments || [];
  const latestPayment = payments[0] || null;
  const isPaid = activeRegistration.status === "ACTIVE" || Boolean(latestPayment);

  // Calculate Overdue and Due Amounts
  const overdueMonths = currentChildFees.monthlySchedule.filter((m) => m.isLate);
  const totalOverdueDzd = overdueMonths.reduce((sum, m) => sum + m.monthlyAmountDzd, 0);
  const currentMonth = currentChildFees.monthlySchedule.find((m) => m.isCurrent);

  let dueStatus: "EXEMPT" | "OVERDUE" | "PENDING_INITIAL" | "UP_TO_DATE" = "UP_TO_DATE";
  let dueAmountDzd = 0;

  if (isStaff) {
    dueStatus = "EXEMPT";
    dueAmountDzd = 0;
  } else if (currentChildFees.hasOverdueMonthly) {
    dueStatus = "OVERDUE";
    dueAmountDzd = totalOverdueDzd;
  } else if (currentChildFees.totalPaidDzd === 0 && activeRegistration.status !== "ACTIVE") {
    dueStatus = "PENDING_INITIAL";
    dueAmountDzd = currentChildFees.annualTotalDzd + currentChildFees.monthlyTotalDzd;
  } else {
    dueStatus = "UP_TO_DATE";
    dueAmountDzd = 0;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-[#FFD21F]" />
            <h1 className="text-2xl font-black font-display text-white">
              Cotisations & Calendrier des Règlements
            </h1>
          </div>
          <p className="text-xs text-white/50 font-mono">
            {isFamilyAccount
              ? `Espace Financier Famille • ${participants.length} adhérent(s) enregistrés • Saison ${activeRegistration.season?.code || "2026"}`
              : `Gestion financière pour ${selectedParticipant.firstName} ${selectedParticipant.lastName} • Saison ${activeRegistration.season?.code || "2026"}`}
          </p>
        </div>

        {/* Global Payment Status Pill */}
        {isStaff ? (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 self-start sm:self-auto">
            <Crown className="w-4 h-4 text-amber-300" />
            <span>★ Exonéré (Dirigeant / Staff)</span>
          </span>
        ) : dueStatus === "OVERDUE" ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 self-start sm:self-auto animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>Paiement en Retard</span>
          </span>
        ) : dueStatus === "UP_TO_DATE" ? (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cotisation à Jour</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 self-start sm:self-auto">
            <Clock className="w-4 h-4" />
            <span>Règlement en Attente</span>
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. DUE PAYMENT / SITUATION FINANCIÈRE HERO CARD                           */}
      {/* ========================================================================= */}
      {isStaff ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Accréditation Dirigeant & Encadrement Club</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                  ★ {selectedParticipant.clubRole || "BUREAU"}
                </span>
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                En tant que membre officiel du Bureau ou encadrant technique de l&apos;Académie ADD Oran, vous êtes dispensé(e) des cotisations sportives. Votre carte officielle est active et disponible.
              </p>
            </div>
          </div>
        </div>
      ) : dueStatus === "OVERDUE" ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-500/20 via-red-900/10 to-red-500/15 border-2 border-red-500/40 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-300 font-bold block">
                  Échéance(s) impayée(s) détectée(s)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  Cotisation en Retard : {dueAmountDzd.toLocaleString()} DZD
                </h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[11px] text-red-300/80 block">Date limite mensuelle :</span>
              <strong className="text-white text-sm">Le {pricing.paymentDeadlineDay} de chaque mois</strong>
            </div>
          </div>

          <div className="text-xs text-red-200/90 space-y-2">
            <p className="leading-relaxed">
              Le règlement des mensualités suivantes n&apos;a pas été enregistré :{" "}
              <strong className="text-white font-mono">
                {overdueMonths.map((m) => m.label).join(", ")}
              </strong>.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Pour conserver la validité de l&apos;assurance sportive et l&apos;accès prioritaire aux séances d&apos;entraînement, merci de vous rapprocher de la permanence du club à Oran pour régulariser ce montant en espèces.
            </p>
          </div>
        </div>
      ) : dueStatus === "PENDING_INITIAL" ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-900/10 to-amber-500/15 border border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                  Règlement d&apos;adhésion initial attendu
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  Montant dû à l&apos;inscription : {dueAmountDzd.toLocaleString()} DZD
                </h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[11px] text-amber-300/80 block">Comprend :</span>
              <span className="text-white text-xs">
                Assurance ({currentChildFees.annualTotalDzd} DZD) + 1er mois ({currentChildFees.monthlyTotalDzd} DZD)
              </span>
            </div>
          </div>

          <p className="text-xs text-amber-200/90 leading-relaxed">
            Votre dossier a été pré-validé. Veuillez effectuer le règlement en espèces au club pour activer définitivement votre profil et récupérer votre reçu officiel.
          </p>
        </div>
      ) : (
        /* Up To Date View */
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-900/10 to-emerald-500/10 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                Situation financière conforme
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                Votre compte est parfaitement à jour !
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Toutes les échéances échues ont été réglées. Prochaine mensualité :{" "}
                <strong className="text-emerald-300">
                  {currentMonth ? currentMonth.label : "Mois prochain"}
                </strong>{" "}
                avant le {pricing.paymentDeadlineDay} du mois.
              </p>
            </div>
          </div>

          <div className="text-right font-mono bg-black/30 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase block">Total versé cette saison</span>
            <span className="text-lg font-bold text-emerald-400">
              {currentChildFees.totalPaidDzd.toLocaleString()} DZD
            </span>
          </div>
        </div>
      )}

      {/* FAMILY MULTI-CHILD SUMMARY CARD (Displayed if family account has multiple children) */}
      {isFamilyAccount && participants.length > 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1C24] via-[#141419] to-[#111116] border border-[#FFD21F]/30 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD21F]/15 text-[#FFD21F] flex items-center justify-center border border-[#FFD21F]/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Récapitulatif Financier Familial
                </h3>
                <p className="text-xs text-white/50">
                  Total combiné pour vos {participants.length} enfants inscrits au club ADD Oran
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-right text-gray-400">
              <div>Total déjà réglé : <span className="text-emerald-400 font-bold">{familyFees.totalPaidDzd.toLocaleString()} DZD</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/50 uppercase block">Total Assurances & Annuel</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-display">
                {familyFees.totalAnnualDueDzd.toLocaleString()} DZD
              </span>
              <span className="text-[10px] text-gray-400 block font-sans">
                Frais d&apos;assurance et adhésions annuelles cumulés
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/50 uppercase block">Total Mensualités Famille</span>
              <span className="text-xl sm:text-2xl font-black text-[#FFD21F] font-display">
                {familyFees.totalMonthlyDueDzd.toLocaleString()} DZD <span className="text-xs font-mono text-white/60">/ mois</span>
              </span>
              <span className="text-[10px] text-gray-400 block font-sans">
                Somme des mensualités de cours
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/50 uppercase block">Règlements Enregistrés</span>
              <span className="text-xl sm:text-2xl font-black text-white font-display">
                {familyFees.totalPaidDzd.toLocaleString()} DZD
              </span>
              <span className="text-[10px] text-gray-400 block font-sans">
                Versements enregistrés avec reçu officiel
              </span>
            </div>
          </div>

          {/* Child Switcher Pills */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-xs text-white/50 block font-mono">
              Sélectionnez un enfant pour consulter son détail et son calendrier :
            </span>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => {
                const isSelected = p.id === selectedParticipantId;
                const pFees = computeParticipantFees(p, pricing);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedParticipantId(p.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#E52421] text-white shadow-lg shadow-[#E52421]/20"
                        : "bg-[#1C1C24] text-gray-300 hover:text-white border border-white/5"
                    }`}
                  >
                    <span>{p.firstName} {p.lastName}</span>
                    {pFees.hasOverdueMonthly && (
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PAYMENT SCHEDULE & CALENDAR (MONTHLY BREAKDOWN & DUE TRACKING)         */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#FFD21F]" />
              <span>Calendrier des Règlements Mensuels (Saison {activeRegistration.season?.code || "2026"})</span>
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Échéancier complet pour {selectedParticipant.firstName}. Échéance de règlement fixée au {pricing.paymentDeadlineDay} de chaque mois.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Réglé
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21F]" />
              En cours
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              En retard
            </span>
          </div>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {currentChildFees.monthlySchedule.map((m, idx) => {
            let badgeBg = "bg-white/[0.02] border-white/5 text-gray-400";
            let statusLabel = "À venir";

            // Find matching payment for this month if paid
            const monthLabelLower = m.label.toLowerCase();
            const matchingPayment = payments.find((pay) =>
              pay.paymentPurpose && pay.paymentPurpose.toLowerCase().includes(monthLabelLower)
            ) || (m.isPaid ? payments[Math.min(idx, payments.length - 1)] : null);

            if (isStaff || m.isPaid) {
              badgeBg = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
              statusLabel = "Validé ✓";
            } else if (m.isLate) {
              badgeBg = "bg-red-500/15 border-red-500/40 text-red-300 animate-pulse";
              statusLabel = "En retard !";
            } else if (m.isCurrent) {
              badgeBg = "bg-[#FFD21F]/15 border-[#FFD21F]/40 text-[#FFD21F]";
              statusLabel = "Mois en cours";
            }

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition ${badgeBg}`}
              >
                <div>
                  <span className="text-xs font-bold block text-white">{m.label}</span>
                  <span className="text-[11px] font-mono opacity-80 block mt-0.5">
                    {isStaff ? "Exonéré" : m.monthlyAmountDzd > 0 ? `${m.monthlyAmountDzd.toLocaleString()} DZD` : "Inclus"}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
                    <span>{statusLabel}</span>
                    {isStaff || m.isPaid ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : m.isLate ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    )}
                  </div>

                  {/* Receipt link if paid */}
                  {matchingPayment && (
                    <Link
                      href={`/receipt/${matchingPayment.receiptNumber}`}
                      target="_blank"
                      className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1 block"
                      title="Consulter le reçu officiel"
                    >
                      <Receipt className="w-3 h-3" />
                      <span>{matchingPayment.receiptNumber}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC PRICING BREAKDOWN & PAYMENT INSTRUCTIONS                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dynamic Pricing Breakdown */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#111116] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
                Fiche Tarifaire • {selectedParticipant.firstName} {selectedParticipant.lastName}
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                {isStaff ? (
                  <span className="text-amber-300">0 DZD <span className="text-xs font-mono text-white/60">(Exonéré Dirigeant)</span></span>
                ) : (
                  <>
                    {currentChildFees.annualTotalDzd > 0 && (
                      <span className="text-emerald-400">
                        {currentChildFees.annualTotalDzd.toLocaleString()} DZD{" "}
                        <span className="text-xs font-mono text-white/60">Annuel</span>
                      </span>
                    )}
                    {currentChildFees.annualTotalDzd > 0 && currentChildFees.monthlyTotalDzd > 0 && (
                      <span className="text-white/40 text-xl mx-2">+</span>
                    )}
                    {currentChildFees.monthlyTotalDzd > 0 && (
                      <span className="text-[#FFD21F]">
                        {currentChildFees.monthlyTotalDzd.toLocaleString()} DZD{" "}
                        <span className="text-xs font-mono text-white/60">/ mois</span>
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs text-white/60 mt-1">
                Tarifs officiels appliqués par l&apos;administration du club ADD Oran pour les activités choisies.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD21F]">
              <Receipt className="w-6 h-6" />
            </div>
          </div>

          {/* DYNAMIC LINE-BY-LINE BREAKDOWN TABLE */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 font-bold flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#FFD21F]" />
              <span>Détail transparent des prestations :</span>
            </h4>

            <div className="divide-y divide-white/5 text-xs">
              {currentChildFees.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    {item.type === "insurance" ? (
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Activity className="w-4 h-4 text-[#E52421] shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-[11px] text-gray-400 block font-mono">
                        {item.frequency === "annual" ? "Cotisation / adhésion annuelle" : "Mensualité de cours"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-white text-sm">
                      {isStaff ? "0 DZD" : `${item.priceDzd.toLocaleString()} DZD`}
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      {item.frequency === "annual" ? "1x par an" : "/ mois"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal summary */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-black/30 p-3 rounded-xl">
              <span className="text-gray-300 font-bold">TOTAL À L&apos;INSCRIPTION :</span>
              <span className="text-emerald-400 font-black text-sm">
                {isStaff ? "0 DZD" : `${(currentChildFees.annualTotalDzd + currentChildFees.monthlyTotalDzd).toLocaleString()} DZD`}
                {" "}<span className="text-[10px] font-normal text-gray-400">(Assurance + 1er mois)</span>
              </span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <AlertCircle className="w-4 h-4 text-[#FFD21F] shrink-0" />
              <span>Modalités de règlement :</span>
            </div>
            <p className="leading-relaxed text-gray-400">
              Le paiement de l&apos;assurance et des mensualités s&apos;effectue en espèces directement au siège du club à Oran lors des horaires de permanence ou au début des cours. Un reçu numéroté vous sera remis sur place et votre reçu électronique sera instantanément disponible ci-contre.
            </p>
          </div>
        </div>

        {/* Right Col: Official Receipt Download Action */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-white/10 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
              Dernier Reçu de Paiement
            </span>

            {latestPayment ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-1.5">
                  <div className="text-white/50 text-[10px]">NUMÉRO DE QUITTANCE</div>
                  <div className="text-sm font-bold text-[#FFD21F]">
                    {latestPayment.receiptNumber}
                  </div>
                  <div className="text-[10px] text-white/50 pt-2 border-t border-white/5">
                    Payé le {new Date(latestPayment.paidAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="text-[10px] text-white/50">
                    Montant : {latestPayment.amount.toLocaleString()} DZD
                  </div>
                  <div className="text-[10px] text-white/50">
                    Mode : {latestPayment.paymentMethod === "CASH" ? "Espèces au club" : latestPayment.paymentMethod}
                  </div>
                </div>

                <Link
                  href={`/receipt/${latestPayment.receiptNumber}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#E52421] hover:bg-[#c91d1a] text-white font-bold text-xs shadow-lg shadow-[#E52421]/20 transition-all cursor-pointer font-display uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le Reçu Officiel</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                <Receipt className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-xs text-white/50">
                  {isStaff
                    ? "Profil exonéré de frais : aucun reçu de paiement n'est exigé."
                    : "Aucun reçu n'est encore émis pour ce dossier. Le reçu sera disponible dès l'encaissement."}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-white/40 space-y-1">
            <div>Club ADD Parkour Oran</div>
            <div>Agrément n° 2026/042</div>
            <div>Wilaya d&apos;Oran, Algérie</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PAYMENT HISTORY TRANSACTIONS                                           */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-white/10 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#FFD21F]" />
          <span>Historique des Transactions Enregistrées ({payments.length})</span>
        </h3>

        {payments.length === 0 ? (
          <p className="text-xs text-white/50 py-4">
            {isStaff
              ? "Profil Dirigeant / Staff : Exonéré des frais d'adhésion sportive."
              : "Aucun historique de paiement enregistré pour cette saison."}
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {payments.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white font-mono">
                      {p.receiptNumber}
                    </div>
                    <div className="text-[11px] text-white/50">
                      {p.paymentPurpose || "Cotisation club"} • {new Date(p.paidAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="font-mono font-bold text-white text-sm">
                    {p.amount.toLocaleString()} DZD
                  </span>
                  <Link
                    href={`/receipt/${p.receiptNumber}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Voir et imprimer le reçu"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
