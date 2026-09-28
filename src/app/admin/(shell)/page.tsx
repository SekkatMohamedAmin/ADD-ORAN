"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Copy,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  History,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t, isRtl } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSeasonCode, setSelectedSeasonCode] = useState<string>("2026");

  const fetchOverview = async (seasonCode?: string) => {
    setLoading(true);
    try {
      const code = seasonCode || selectedSeasonCode;
      const res = await fetch(`/api/admin/overview?season=${code}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.currentSeason) {
          setSelectedSeasonCode(json.currentSeason.code);
        }
      }
    } catch (err) {
      console.error("Dashboard overview fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleSeasonChange = (code: string) => {
    setSelectedSeasonCode(code);
    fetchOverview(code);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#E52421] animate-spin" />
          <p className="font-mono text-xs text-[#9E9EA8]">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const currentSeason = data?.currentSeason || {};
  const seasons = data?.seasons || [];
  const recentLogs = data?.recentAuditLogs || [];
  const recentRegistrations = data?.recentRegistrations || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ========================================================
          TOP HEADER: DASHBOARD TITLE + SEASON SELECTOR
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F5F2]">
            {t.admin.dashboard}
          </h1>
          <p className="font-mono text-xs text-[#9E9EA8] mt-1">
            Console opérationnelle // Club Art Du Déplacement Parkour Oran
          </p>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-2 bg-[#141419] border border-white/10 p-1.5 rounded-2xl">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-[#9E9EA8]">
            <Calendar className="w-3.5 h-3.5 text-[#FFD21F]" />
            <span className="hidden sm:inline">{t.admin.activeSeason} :</span>
          </div>

          <div className="flex items-center gap-1">
            {seasons.map((s: any) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSeasonChange(s.code)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  selectedSeasonCode === s.code
                    ? "bg-[#E52421] text-[#F5F5F2] shadow-md"
                    : "text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5"
                }`}
              >
                {s.code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchOverview()}
            className="p-1.5 rounded-xl text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors"
            title="Rafraîchir"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================
          ATHLETIC HERO BANNER WITH BACKGROUND IMAGE
         ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 bg-[#141419] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <Image
            src="/images/hero/hero-parkour.jpg"
            alt="ADD Oran Action Backdrop"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20 filter contrast-125 grayscale mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D] via-[#0A0A0D]/90 to-[#E52421]/20" />
          <div className="absolute inset-0 sports-grid-pattern opacity-30" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52421]/20 border border-[#E52421]/40 text-[#FF3030] text-[11px] font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E52421] animate-pulse" />
              <span>Système de Gestion du Club // En Direct</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight">
              Club Art Du Déplacement <span className="text-[#FFD21F]">Parkour Oran</span>
            </h2>
            <p className="font-body text-xs text-[#9E9EA8] leading-relaxed">
              Supervision des effectifs, conformité des pièces médicales, encaissement des cotisations en espèces et gestion des dossiers pour la saison {currentSeason.label || selectedSeasonCode}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/registrations?status=UNDER_REVIEW"
              className="px-4 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E52421]/20 flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Examiner les dossiers</span>
            </Link>
            <Link
              href="/admin/payments"
              className="px-4 py-2.5 rounded-xl bg-[#1C1C24] hover:bg-[#252530] text-[#F5F5F2] border border-white/10 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#FFD21F]" />
              <span>Caisse & Règlements</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          OPERATIONAL ALERTS (RULE 23: REAL ACTIONABLE ALERTS)
         ======================================================== */}
      {(stats.pendingReview > 0 || stats.needsCorrection > 0 || stats.duplicates > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.pendingReview > 0 && (
            <Link
              href="/admin/registrations?status=UNDER_REVIEW"
              className="p-4 rounded-2xl bg-[#FFD21F]/10 border border-[#FFD21F]/30 hover:border-[#FFD21F] transition-all flex items-start gap-3 group"
            >
              <AlertCircle className="w-5 h-5 text-[#FFD21F] shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-xs uppercase text-[#F5F5F2] group-hover:text-[#FFD21F] transition-colors">
                  {stats.pendingReview} dossier(s) en attente d&apos;examen
                </p>
                <p className="font-mono text-[11px] text-[#9E9EA8] mt-0.5">
                  Vérifier les pièces justificatives et valider →
                </p>
              </div>
            </Link>
          )}

          {stats.needsCorrection > 0 && (
            <Link
              href="/admin/registrations?status=NEEDS_CORRECTION"
              className="p-4 rounded-2xl bg-[#E52421]/10 border border-[#E52421]/30 hover:border-[#E52421] transition-all flex items-start gap-3 group"
            >
              <AlertTriangle className="w-5 h-5 text-[#E52421] shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-xs uppercase text-[#F5F5F2] group-hover:text-[#E52421] transition-colors">
                  {stats.needsCorrection} dossier(s) en correction
                </p>
                <p className="font-mono text-[11px] text-[#9E9EA8] mt-0.5">
                  En attente de re-soumission par le pratiquant →
                </p>
              </div>
            </Link>
          )}

          {stats.duplicates > 0 && (
            <Link
              href="/admin/duplicates"
              className="p-4 rounded-2xl bg-white/5 border border-white/15 hover:border-[#E52421] transition-all flex items-start gap-3 group"
            >
              <Copy className="w-5 h-5 text-[#FFD21F] shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-xs uppercase text-[#F5F5F2] group-hover:text-[#FFD21F] transition-colors">
                  {stats.duplicates} doublon(s) potentiel(s)
                </p>
                <p className="font-mono text-[11px] text-[#9E9EA8] mt-0.5">
                  Examiner et marquer comme légitime ou doublon →
                </p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* ========================================================
          KPI METRIC CARDS (REAL DATABASE COUNTS, CLICKABLE)
         ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Inscriptions */}
        <Link
          href="/admin/registrations"
          className="p-5 rounded-2xl bg-[#141419] border border-white/10 hover:border-white/20 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-[#9E9EA8]">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              {t.admin.totalRegistrations}
            </span>
            <ClipboardList className="w-4 h-4 text-[#9E9EA8] group-hover:text-[#F5F5F2] transition-colors" />
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-[#F5F5F2]">
            {stats.total ?? 0}
          </div>
          <div className="text-[11px] font-mono text-[#9E9EA8]">
            Saison {currentSeason.label || selectedSeasonCode}
          </div>
        </Link>

        {/* 2. En attente d'examen */}
        <Link
          href="/admin/registrations?status=UNDER_REVIEW"
          className="p-5 rounded-2xl bg-[#141419] border border-white/10 hover:border-[#FFD21F]/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-[#FFD21F]">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              {t.admin.pendingReview}
            </span>
            <AlertCircle className="w-4 h-4 text-[#FFD21F]" />
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-[#FFD21F]">
            {stats.pendingReview ?? 0}
          </div>
          <div className="text-[11px] font-mono text-[#9E9EA8]">
            À traiter en priorité
          </div>
        </Link>

        {/* 3. Membres Actifs */}
        <Link
          href="/admin/participants"
          className="p-5 rounded-2xl bg-[#141419] border border-white/10 hover:border-[#E52421]/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-[#10B981]">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              {t.admin.activeMembers}
            </span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-[#10B981]">
            {stats.active ?? 0}
          </div>
          <div className="text-[11px] font-mono text-[#9E9EA8]">
            Dossier validé & payé
          </div>
        </Link>

        {/* 4. Cotisations perçues (DZD) */}
        <Link
          href="/admin/payments"
          className="p-5 rounded-2xl bg-[#141419] border border-white/10 hover:border-[#FFD21F]/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-[#FFD21F]">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              Cotisations perçues
            </span>
            <CreditCard className="w-4 h-4 text-[#FFD21F]" />
          </div>
          <div className="font-display text-3xl sm:text-4xl font-black text-[#F5F5F2]">
            {(stats.totalRevenueDzd ?? 0).toLocaleString()} <span className="text-sm font-mono text-[#FFD21F]">DA</span>
          </div>
          <div className="text-[11px] font-mono text-[#9E9EA8]">
            {stats.totalPaymentsCount ?? 0} reçu(s) émis en espèces
          </div>
        </Link>
      </div>

      {/* ========================================================
          REGISTRATION STATUS DISTRIBUTION (RULE 10)
         ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#141419] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-base uppercase tracking-wider text-[#F5F5F2]">
            Répartition des Dossiers // Saison {currentSeason.code}
          </h2>
          <Link
            href="/admin/registrations"
            className="text-xs font-mono text-[#E52421] hover:text-[#FF3030] flex items-center gap-1"
          >
            <span>Voir toutes les inscriptions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#9E9EA8] uppercase">Soumis</span>
            <p className="font-display font-bold text-xl text-[#F5F5F2]">{stats.pendingReview ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#E52421] uppercase">Correction</span>
            <p className="font-display font-bold text-xl text-[#E52421]">{stats.needsCorrection ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#FFD21F] uppercase">Accepté</span>
            <p className="font-display font-bold text-xl text-[#FFD21F]">{stats.accepted ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#FFB800] uppercase">Attente Pay</span>
            <p className="font-display font-bold text-xl text-[#FFB800]">{stats.paymentPending ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#10B981] uppercase">Payé</span>
            <p className="font-display font-bold text-xl text-[#10B981]">{stats.paid ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#10B981] uppercase">Actif</span>
            <p className="font-display font-bold text-xl text-[#10B981]">{stats.active ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1">
            <span className="font-mono text-[10px] text-[#9E9EA8] uppercase">Archivé</span>
            <p className="font-display font-bold text-xl text-[#9E9EA8]">{stats.archived ?? 0}</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          SPLIT SECTION: RECENT REGISTRATIONS & AUDIT FEED
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Dernières inscriptions soumises */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141419] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#F5F5F2] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#E52421]" />
              <span>Dernières Inscriptions Reçues</span>
            </h3>
            <Link
              href="/admin/registrations"
              className="font-mono text-xs text-[#9E9EA8] hover:text-[#F5F5F2] transition-colors"
            >
              Tout voir →
            </Link>
          </div>

          {recentRegistrations.length === 0 ? (
            <p className="font-mono text-xs text-[#9E9EA8] py-8 text-center">
              Aucune inscription enregistrée pour cette saison.
            </p>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((reg: any) => (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-xl bg-[#1C1C24] border border-white/5 flex items-center justify-between gap-4 hover:border-white/15 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#FFD21F]">
                        {reg.reference}
                      </span>
                      <StatusBadge status={reg.status} size="sm" />
                    </div>
                    <p className="font-display font-bold text-sm text-[#F5F5F2] truncate mt-1">
                      {reg.participant.firstName} {reg.participant.lastName}
                    </p>
                    <p className="font-mono text-[10px] text-[#9E9EA8]">
                      {new Date(reg.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <Link
                    href={`/admin/registrations/${reg.id}`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#E52421] text-[#F5F5F2] font-mono text-xs font-bold transition-all shrink-0"
                  >
                    Dossier →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Activité récente (Journal d'audit en direct) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141419] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#F5F5F2] flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFD21F]" />
              <span>Activité Récente // Audit</span>
            </h3>
            <Link
              href="/admin/audit"
              className="font-mono text-xs text-[#9E9EA8] hover:text-[#F5F5F2] transition-colors"
            >
              Journal complet →
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p className="font-mono text-xs text-[#9E9EA8] py-8 text-center">
              Aucune activité enregistrée.
            </p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#1C1C24] border border-white/5 space-y-1 font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#E52421]">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-[#9E9EA8]">
                      {new Date(log.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {log.registration && (
                    <p className="text-[#F5F5F2] text-[11px] truncate">
                      {log.registration.reference} —{" "}
                      {log.registration.participant?.firstName}{" "}
                      {log.registration.participant?.lastName}
                    </p>
                  )}
                  {log.user && (
                    <p className="text-[10px] text-[#9E9EA8]">
                      Par: {log.user.phone} ({log.user.role})
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
