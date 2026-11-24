"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import {
  FlaticonAdminDashboard,
  FlaticonAdminRegistrations,
  FlaticonAdminParticipants,
  FlaticonAdminPayments,
  FlaticonAdminCards,
  FlaticonAdminNature,
} from "@/components/admin/AdminFlaticons";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  Copy,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  History,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { getStoredAdminSeason, setStoredAdminSeason } from "@/lib/adminSeason";

export default function AdminDashboardPage() {
  const { t, isRtl, locale } = useLanguage();
  const isArabic = locale === "ar";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSeasonCode, setSelectedSeasonCode] = useState<string>(
    () => getStoredAdminSeason() || ""
  );

  const fetchOverview = async (seasonCode?: string) => {
    setLoading(true);
    try {
      const activeCode = seasonCode || selectedSeasonCode;
      const url = activeCode
        ? `/api/admin/overview?season=${encodeURIComponent(activeCode)}`
        : `/api/admin/overview`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.currentSeason) {
          setSelectedSeasonCode(json.currentSeason.code);
          setStoredAdminSeason(json.currentSeason.code);
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
    setStoredAdminSeason(code);
    fetchOverview(code);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#E52421] animate-spin" />
          <p className="font-mono text-xs text-white/50">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const currentSeason = data?.currentSeason || {};
  const seasons = data?.seasons || [];
  const recentLogs = data?.recentAuditLogs || [];
  const recentRegistrations = data?.recentRegistrations || [];

  const dateLocale = isArabic ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";

  return (
    <div className={`space-y-8 animate-in fade-in duration-300 ${isArabic ? "font-arabic" : ""}`}>
      {/* ========================================================
          TOP HEADER: DASHBOARD TITLE + SEASON SELECTOR
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E52421] shadow-[0_0_10px_#E52421]" />
            <span>{t.admin.dashboard}</span>
          </h1>
          <p className={`text-xs text-white/50 mt-1 ${isArabic ? "font-arabic" : "font-mono"}`}>
            {t.admin.subtitle}
          </p>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-2 bg-[#06060A] border border-white/[0.08] p-1.5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-white/50">
            <Calendar className="w-3.5 h-3.5 text-[#FFD21F]" />
            <span className="hidden sm:inline">{t.admin.activeSeason}:</span>
          </div>

          <div className="flex items-center gap-1">
            {seasons.map((s: any) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSeasonChange(s.code)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  selectedSeasonCode === s.code
                    ? "bg-[#E52421] text-white shadow-[0_0_12px_rgba(229,36,33,0.4)]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchOverview()}
            className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={t.admin.refresh}
            aria-label={t.admin.refresh}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================
          SENIOR ATHLETIC COMMAND CENTER HERO BANNER
         ======================================================== */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] p-6 sm:p-8 bg-[#06060A] shadow-2xl before:absolute before:top-0 before:left-0 before:w-64 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E52421]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52421]/15 border border-[#E52421]/30 text-[#FF3030] text-[10px] font-medium font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E52421] animate-pulse" />
              <span>{t.admin.heroBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight leading-tight">
              Club Art Du Déplacement <span className="text-[#E52421]">Parkour Oran</span>
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-body">
              {t.admin.heroSubtitle}{" "}
              <span className="font-mono text-white/90 font-medium">
                ({currentSeason.label || selectedSeasonCode})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/registrations?status=UNDER_REVIEW"
              className="px-4 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-medium text-xs transition-all shadow-[0_0_20px_rgba(229,36,33,0.35)] hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
              <ClipboardList className="w-4 h-4" />
              <span>{t.admin.reviewDossiers}</span>
            </Link>
            <Link
              href="/admin/payments"
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 font-medium text-xs transition-all flex items-center gap-2 group hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-[#FFD21F]" />
              <span>{t.admin.treasuryAction}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          OPERATIONAL ACTION ALERTS
         ======================================================== */}
      {(stats.pendingReview > 0 || stats.needsCorrection > 0 || stats.duplicates > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.pendingReview > 0 && (
            <Link
              href="/admin/registrations?status=UNDER_REVIEW"
              className="p-4 rounded-2xl bg-[#FFD21F]/[0.08] border border-[#FFD21F]/25 hover:border-[#FFD21F] transition-all flex items-start gap-3 group shadow-lg"
            >
              <AlertCircle className="w-5 h-5 text-[#FFD21F] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-xs text-white group-hover:text-[#FFD21F] transition-colors">
                  {stats.pendingReview} {t.admin.dossiersReviewCount}
                </p>
                <p className="text-[11px] text-white/60 mt-0.5 font-body">
                  {isArabic
                    ? "التحقق من الشهادات والوثائق والمصادقة ←"
                    : "Vérifier les pièces justificatives et valider →"}
                </p>
              </div>
            </Link>
          )}

          {stats.needsCorrection > 0 && (
            <Link
              href="/admin/registrations?status=NEEDS_CORRECTION"
              className="p-4 rounded-2xl bg-[#E52421]/[0.08] border border-[#E52421]/25 hover:border-[#E52421] transition-all flex items-start gap-3 group shadow-lg"
            >
              <AlertTriangle className="w-5 h-5 text-[#E52421] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-xs text-white group-hover:text-[#E52421] transition-colors">
                  {stats.needsCorrection} {t.admin.dossiersCorrectionCount}
                </p>
                <p className="text-[11px] text-white/60 mt-0.5 font-body">
                  {isArabic
                    ? "في انتظار إعادة الرفع من طرف المنخرط ←"
                    : "En attente de re-soumission par le pratiquant →"}
                </p>
              </div>
            </Link>
          )}

          {stats.duplicates > 0 && (
            <Link
              href="/admin/duplicates"
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FFD21F] transition-all flex items-start gap-3 group shadow-lg"
            >
              <Copy className="w-5 h-5 text-[#FFD21F] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-xs text-white group-hover:text-[#FFD21F] transition-colors">
                  {stats.duplicates} {t.admin.dossiersDuplicatesCount}
                </p>
                <p className="text-[11px] text-white/60 mt-0.5 font-body">
                  {isArabic
                    ? "فحص الطلبات المتطابقة واعتمادها ←"
                    : "Examiner et marquer comme légitime ou doublon →"}
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
          className="p-5 rounded-2xl bg-[#06060A] border border-white/[0.08] hover:border-white/20 transition-all space-y-3 group shadow-xl hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
              {t.admin.totalRegistrations}
            </span>
            <FlaticonAdminRegistrations size={18} className="text-white/40 group-hover:text-white transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono tracking-tight text-white">
            {stats.total ?? 0}
          </div>
          <div className="text-[10px] font-mono text-white/40 font-normal">
            Saison {currentSeason.label || selectedSeasonCode}
          </div>
        </Link>

        {/* 2. En attente d'examen */}
        <Link
          href="/admin/registrations?status=UNDER_REVIEW"
          className="p-5 rounded-2xl bg-[#06060A] border border-white/[0.08] hover:border-[#FFD21F]/40 transition-all space-y-3 group shadow-xl hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between text-[#FFD21F]">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
              {t.admin.pendingReview}
            </span>
            <AlertCircle className="w-4 h-4 text-[#FFD21F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono tracking-tight text-[#FFD21F]">
            {stats.pendingReview ?? 0}
          </div>
          <div className="text-[10px] font-mono text-white/40 font-normal">
            {t.admin.priorityAlert}
          </div>
        </Link>

        {/* 3. Membres Actifs */}
        <Link
          href="/admin/participants"
          className="p-5 rounded-2xl bg-[#06060A] border border-white/[0.08] hover:border-[#10B981]/40 transition-all space-y-3 group shadow-xl hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between text-[#10B981]">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
              {t.admin.activeMembers}
            </span>
            <FlaticonAdminParticipants size={18} active className="text-[#10B981]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono tracking-tight text-[#10B981]">
            {stats.active ?? 0}
          </div>
          <div className="text-[10px] font-mono text-white/40 font-normal">
            {t.admin.validatedAndPaid}
          </div>
        </Link>

        {/* 4. Cotisations perçues (DZD) */}
        <Link
          href="/admin/payments"
          className="p-5 rounded-2xl bg-[#06060A] border border-white/[0.08] hover:border-[#E52421]/40 transition-all space-y-3 group shadow-xl hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between text-[#FFD21F]">
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
              {t.admin.payments}
            </span>
            <FlaticonAdminPayments size={18} active className="text-[#FFD21F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono tracking-tight text-white">
            {(stats.totalRevenueDzd ?? 0).toLocaleString()}{" "}
            <span className="text-xs font-mono text-[#FFD21F] font-normal">DZD</span>
          </div>
          <div className="text-[10px] font-mono text-white/40 font-normal">
            {stats.totalPaymentsCount ?? 0} {isArabic ? "وصل نقدي" : "reçu(s) émis"}
          </div>
        </Link>
      </div>

      {/* ========================================================
          REGISTRATION STATUS DISTRIBUTION (TRANSLATED TILES)
         ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#06060A] border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide text-white uppercase">
            {isArabic ? "توزيع الطلبات حسب الحالة" : "Répartition des Dossiers"} //{" "}
            <span className="text-[#E52421]">Saison {currentSeason.code}</span>
          </h2>
          <Link
            href="/admin/registrations"
            className="text-xs font-mono text-[#E52421] hover:text-[#FF3030] flex items-center gap-1 font-medium"
          >
            <span>{t.admin.viewAll}</span>
            <ArrowUpRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-[-90deg]" : ""}`} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-white/50 uppercase font-mono">
              {t.statuses.SUBMITTED}
            </span>
            <p className="font-semibold text-base text-white font-mono">{stats.pendingReview ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-[#E52421] uppercase font-mono">
              {t.statuses.NEEDS_CORRECTION}
            </span>
            <p className="font-semibold text-base text-[#E52421] font-mono">
              {stats.needsCorrection ?? 0}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-[#FFD21F] uppercase font-mono">
              {t.statuses.ACCEPTED}
            </span>
            <p className="font-semibold text-base text-[#FFD21F] font-mono">{stats.accepted ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-mono">
              {t.statuses.PAYMENT_PENDING}
            </span>
            <p className="font-semibold text-base text-amber-400 font-mono">
              {stats.paymentPending ?? 0}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-[#10B981] uppercase font-mono">
              {t.statuses.PAID}
            </span>
            <p className="font-semibold text-base text-[#10B981] font-mono">{stats.paid ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-[#10B981] uppercase font-mono">
              {t.statuses.ACTIVE}
            </span>
            <p className="font-semibold text-base text-[#10B981] font-mono">{stats.active ?? 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0A0A10] border border-white/[0.05] space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono">
              {t.statuses.ARCHIVED}
            </span>
            <p className="font-semibold text-base text-white/40 font-mono">{stats.archived ?? 0}</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          SPLIT SECTION: RECENT REGISTRATIONS & AUDIT FEED
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Dernières inscriptions */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#06060A] border border-white/[0.08] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#E52421]" />
              <span>{t.admin.recentRegistrationsTitle}</span>
            </h3>
            <Link
              href="/admin/registrations"
              className="font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              {t.admin.viewAll} →
            </Link>
          </div>

          {recentRegistrations.length === 0 ? (
            <p className="font-mono text-xs text-white/40 py-8 text-center">
              {isArabic
                ? "لا توجد تسجيلات مسجلة لهذا الموسم حتى الآن."
                : "Aucune inscription enregistrée pour cette saison."}
            </p>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((reg: any) => (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-xl bg-[#0B0B12] border border-white/[0.05] flex items-center justify-between gap-4 hover:border-white/20 transition-all group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-[#FFD21F]/90">
                        {reg.reference}
                      </span>
                      <StatusBadge status={reg.status} size="sm" />
                    </div>
                    <p className="font-medium text-xs text-white truncate mt-1">
                      {reg.participant.firstName} {reg.participant.lastName}
                    </p>
                    <p className="font-mono text-[10px] text-white/40 font-normal">
                      {new Date(reg.createdAt).toLocaleDateString(dateLocale, {
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
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#E52421] text-white/80 hover:text-white font-mono text-xs font-medium transition-all shrink-0 border border-white/5 hover:border-transparent"
                  >
                    {isArabic ? "الملف ←" : "Dossier →"}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Activité récente (Journal d'audit) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#06060A] border border-white/[0.08] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFD21F]" />
              <span>{t.admin.recentAuditTitle}</span>
            </h3>
            <Link
              href="/admin/audit"
              className="font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              {t.admin.viewAll} →
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p className="font-mono text-xs text-white/40 py-8 text-center">
              {isArabic ? "لا توجد عمليات مسجلة." : "Aucune activité enregistrée."}
            </p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#0B0B12] border border-white/[0.05] space-y-1 font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#E52421]">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-white/40">
                      {new Date(log.createdAt).toLocaleTimeString(dateLocale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {log.registration && (
                    <p className="text-white text-[11px] truncate">
                      {log.registration.reference} —{" "}
                      {log.registration.participant?.firstName}{" "}
                      {log.registration.participant?.lastName}
                    </p>
                  )}
                  {log.user && (
                    <p className="text-[10px] text-white/40">
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
