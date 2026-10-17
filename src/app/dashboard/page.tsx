"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import { StatusBadge } from "@/components/StatusBadge";
import {
  FileText,
  Calendar,
  CreditCard,
  CreditCard as IdCard,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Download,
  UserPlus,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { t, isRtl } = useLanguage();
  const {
    loading,
    participants,
    selectedParticipantId,
    setSelectedParticipantId,
    selectedParticipant,
    activeRegistration,
    isFamilyAccount,
    hasPendingCorrection,
    events,
    eventsLoading,
    togglingEventId,
    toggleAttendance,
    openAddChildModal,
  } = usePortal();

  const [copiedRef, setCopiedRef] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 text-[#E52421] animate-spin" />
        <p className="text-sm font-mono text-white/50 tracking-wider uppercase">
          Chargement de votre espace...
        </p>
      </div>
    );
  }

  if (!selectedParticipant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-[#111116] border border-white/10 space-y-4">
          <AlertCircle className="w-12 h-12 text-[#FFD21F] mx-auto" />
          <h2 className="text-xl font-bold text-white">
            Aucun profil adhérent trouvé
          </h2>
          <p className="text-sm text-white/60">
            Votre compte est actif mais ne contient pas encore d&apos;inscription pour cette saison.
          </p>
          <button
            type="button"
            onClick={openAddChildModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E52421] text-white font-bold text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Créer une inscription</span>
          </button>
        </div>
      </div>
    );
  }

  const age =
    new Date().getFullYear() -
    new Date(selectedParticipant.dateOfBirth).getFullYear();

  const category =
    age < 12
      ? "Poussins / Benjamins"
      : age < 16
      ? "Minimes / Cadets"
      : age < 18
      ? "Juniors"
      : "Séniors (+18)";

  const nextEvent = events?.[0] || null;

  const handleCopyRef = () => {
    if (!activeRegistration?.reference) return;
    navigator.clipboard.writeText(activeRegistration.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Multi-Child / Adherent Selector Tabs */}
      {participants.length > 0 && (
        <div className="p-4 rounded-3xl bg-[#111116] border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FFD21F]" />
              <span className="text-xs font-mono uppercase tracking-wider text-white/70 font-bold">
                {t.dashboard.myChildren} ({participants.length})
              </span>
            </div>
            <button
              type="button"
              onClick={openAddChildModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFD21F]/15 hover:bg-[#FFD21F]/25 text-[#FFD21F] border border-[#FFD21F]/30 text-xs font-bold transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.dashboard.addChild}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {participants.map((p) => {
              const pAge =
                new Date().getFullYear() -
                new Date(p.dateOfBirth).getFullYear();
              const isSelected = p.id === selectedParticipantId;
              const pReg = p.registrations?.[0];
              const pHasCorrection =
                pReg?.status === "NEEDS_CORRECTION" ||
                pReg?.status === "REJECTED";

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedParticipantId(p.id)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#E52421]/15 border-[#E52421] shadow-lg shadow-[#E52421]/10 ring-1 ring-[#E52421]"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? "bg-[#E52421] text-white"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {p.firstName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-xs text-white/50 font-mono">
                        {pAge} ans • {p.isMinor ? "Mineur" : "Majeur"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {pReg ? (
                      <StatusBadge status={pReg.status} />
                    ) : (
                      <span className="text-[10px] text-white/40">Inactif</span>
                    )}
                    {pHasCorrection && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Action requise</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Welcome Banner & Active Adherent Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#181822] via-[#111116] to-[#0A0A0D] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E52421]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#E52421]/20 text-[#E52421] border border-[#E52421]/30">
                Saison 2026
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-white/10 text-white/80 border border-white/10">
                Catégorie : {category}
              </span>
              {activeRegistration && (
                <StatusBadge status={activeRegistration.status} />
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              {t.dashboard.welcome}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                {selectedParticipant.firstName} {selectedParticipant.lastName}
              </span>
            </h1>

            {activeRegistration && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-mono text-white/50">
                  Référence Dossier :
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/15 text-xs font-mono text-[#FFD21F] font-bold transition-colors"
                  title="Copier la référence"
                >
                  <span>{activeRegistration.reference}</span>
                  {copiedRef ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/40" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Right */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/documents"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-white/60" />
              <span>Voir mes documents</span>
            </Link>
            <Link
              href="/dashboard/card"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#c91d1a] text-white text-xs font-bold shadow-lg shadow-[#E52421]/20 transition-all"
            >
              <IdCard className="w-4 h-4" />
              <span>Ma Carte Club</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Rejection / Needs Correction Alert Banner */}
      {hasPendingCorrection && activeRegistration && (
        <div className="p-6 rounded-3xl bg-red-950/40 border-2 border-red-500/50 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-red-200">
                  {activeRegistration.status === "REJECTED"
                    ? t.dashboard.rejectionAlertTitle
                    : t.dashboard.actionRequiredTitle}
                </h3>
                <p className="text-xs text-red-300/80 max-w-2xl">
                  {activeRegistration.status === "REJECTED"
                    ? t.dashboard.rejectionAlertDesc
                    : t.dashboard.actionRequiredDesc}
                </p>
                {activeRegistration.correctionReason && (
                  <div className="mt-2 p-3 rounded-xl bg-black/40 border border-red-500/30 text-xs font-mono text-red-200">
                    <span className="font-bold text-[#FFD21F]">
                      Motif officiel de l&apos;administration :{" "}
                    </span>
                    « {activeRegistration.correctionReason} »
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/dashboard/documents"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E52421] hover:bg-[#c91d1a] text-white text-xs font-bold shadow-lg shadow-[#E52421]/30 shrink-0 transition-all"
            >
              <span>Corriger et Renvoyer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. Metric / KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Dossier */}
        <Link
          href="/dashboard/documents"
          className="group p-5 rounded-3xl bg-[#111116] border border-white/10 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
              Dossier & Pièces
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">
              {activeRegistration?.documents?.length || 0} / 4 pièces
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <span>Gérer les documents</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Metric 2: Next Event */}
        <Link
          href="/dashboard/events"
          className="group p-5 rounded-3xl bg-[#111116] border border-white/10 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
              Séances & Sorties
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-[#FFD21F] transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">
              {events.length} sessions
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <span>Voir le planning</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Metric 3: Cotisation & Reçus */}
        <Link
          href="/dashboard/payments"
          className="group p-5 rounded-3xl bg-[#111116] border border-white/10 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
              Cotisation & Reçus
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-emerald-400 transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">
              {activeRegistration?.payments?.[0]
                ? `${activeRegistration.payments[0].amount.toLocaleString()} DZD`
                : "En attente"}
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <span>Historique financier</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Metric 4: Carte d'Adhérent */}
        <Link
          href="/dashboard/card"
          className="group p-5 rounded-3xl bg-[#111116] border border-white/10 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
              Carte Numérique
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-[#E52421] transition-colors">
              <IdCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">
              {selectedParticipant.membershipCardNumber || "ADD-CARD-2026"}
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <span>Afficher le QR code</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>
      </div>

      {/* 5. Sub-Page Gateways (Cards leading to distinct sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Event Spotlight Card */}
        {nextEvent && (
          <div className="p-6 rounded-3xl bg-[#111116] border border-white/10 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD21F]" />
                <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                  Prochaine Séance Officielle
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E52421]/20 text-[#E52421] border border-[#E52421]/30">
                {nextEvent.discipline}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {nextEvent.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-2">
                {nextEvent.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/70 py-3 border-y border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span>{new Date(nextEvent.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/40" />
                <span className="truncate">{nextEvent.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => toggleAttendance(nextEvent.id)}
                disabled={togglingEventId === nextEvent.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  nextEvent.isAttending
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-[#FFD21F] hover:bg-[#e6bd19] text-black"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {nextEvent.isAttending
                    ? t.dashboard.rsvpConfirmed
                    : t.dashboard.rsvpJoin}
                </span>
              </button>

              <Link
                href="/dashboard/events"
                className="text-xs text-white/50 hover:text-white flex items-center gap-1"
              >
                <span>Toutes les séances</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Identity & Registered Disciplines Summary */}
        <div className="p-6 rounded-3xl bg-[#111116] border border-white/10 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-white/60">
              {t.dashboard.selectedDisciplines}
            </span>
            <span className="text-xs text-white/40 font-mono">
              Groupe Sanguin : {selectedParticipant.bloodType || "N/A"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeRegistration?.disciplines?.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E52421]/15 border border-[#E52421]/30 flex items-center justify-center text-[#E52421]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    {item.discipline.nameFr}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {item.discipline.nameAr}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/5">
            <Link
              href="/dashboard/family"
              className="text-xs text-white/60 hover:text-white flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-white/40" />
              <span>Voir le profil complet et contact d&apos;urgence</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </div>
        </div>
      </div>

      {/* 6. Official Documents Download Bar */}
      <div className="p-6 rounded-3xl bg-[#111116] border border-white/10 shadow-xl">
        <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-[#FFD21F]" />
          <span>{t.dashboard.paperworkTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeRegistration && (
            <a
              href={`/paperwork/${activeRegistration.id}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-[#E52421]/15 border border-[#E52421]/40 hover:bg-[#E52421]/25 text-xs text-white flex items-center justify-between transition-all sm:col-span-3 shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#FFD21F] shrink-0" />
                <span className="font-bold">
                  Télécharger le dossier complet officiel (PDF) • {selectedParticipant?.firstName} {selectedParticipant?.lastName} ({activeRegistration.reference})
                </span>
              </div>
              <Download className="w-4 h-4 text-[#FFD21F] shrink-0" />
            </a>
          )}
          <a
            href="/regulations"
            target="_blank"
            className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 text-xs text-white/80 hover:text-white flex items-center justify-between transition-colors"
          >
            <span className="truncate">Règlement Intérieur du Club</span>
            <FileText className="w-4 h-4 text-white/40 shrink-0" />
          </a>
          <a
            href="/parental-doc"
            target="_blank"
            className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 text-xs text-white/80 hover:text-white flex items-center justify-between transition-colors"
          >
            <span className="truncate">Autorisation Parentale Vierge</span>
            <FileText className="w-4 h-4 text-white/40 shrink-0" />
          </a>
          <a
            href="/privacy"
            target="_blank"
            className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 text-xs text-white/80 hover:text-white flex items-center justify-between transition-colors"
          >
            <span className="truncate">Charte Éthique & Sécurité</span>
            <FileText className="w-4 h-4 text-white/40 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
