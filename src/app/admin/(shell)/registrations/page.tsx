"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  AlertTriangle,
  CreditCard,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";
import { getClubRoleDefinition } from "@/lib/clubRoles";
import { getStoredAdminSeason, setStoredAdminSeason } from "@/lib/adminSeason";

export default function AdminRegistrationsPage() {
  const { t, isRtl, locale } = useLanguage();
  const isArabic = locale === "ar";
  const dateLocale = isArabic ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";

  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [registrationToDelete, setRegistrationToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [season, setSeason] = useState(() => getStoredAdminSeason() || "");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, string> = {
        duplicates: duplicatesOnly ? "true" : "false",
      };
      if (search) queryParams.search = search;
      if (status) queryParams.status = status;
      if (discipline) queryParams.discipline = discipline;
      if (season) queryParams.season = season;
      if (typeFilter) queryParams.type = typeFilter;

      const query = new URLSearchParams(queryParams);

      const res = await fetch(`/api/admin/registrations?${query.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setSeasons(data.seasons || []);
        setStats(data.stats || {});
        if (!season && data.currentSeason) {
          setSeason(data.currentSeason.code);
          setStoredAdminSeason(data.currentSeason.code);
        }
      }
    } catch (err) {
      console.error("Registrations fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegistration = async () => {
    if (!registrationToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/registrations/${registrationToDelete.id}`, {
        method: "POST",
        headers: { "X-HTTP-Method-Override": "DELETE" },
      });
      if (res.ok) {
        setRegistrationToDelete(null);
        fetchRegistrations();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression de la candidature");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRegistrations();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, discipline, season, duplicatesOnly, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setDiscipline("");
    setDuplicatesOnly(false);
    setTypeFilter("");
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${isArabic ? "font-arabic" : ""}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E52421] shadow-[0_0_10px_#E52421]" />
            <span>{t.admin.registrations}</span>
          </h1>
          <p className="text-xs text-white/50 mt-1 font-body">
            {isArabic
              ? "متابعة تدفق طلبات الانخراط، فحص الملفات والمصادقة الإدارية"
              : "Gestion du flux des demandes d'adhésion et examen des dossiers"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/trash"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-mono text-xs font-medium transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isArabic ? "سلة المهملات" : "Corbeille"}</span>
          </Link>
          <button
            type="button"
            onClick={fetchRegistrations}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06060A] border border-white/[0.08] hover:border-white/20 text-white font-mono text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#E52421]" : ""}`} />
            <span>{t.admin.refresh}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar with Clean Top Red Accent */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-[#06060A] border border-white/[0.08] space-y-4 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#E52421] before:to-transparent shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 relative z-10">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className={`w-4 h-4 absolute ${
                isRtl ? "right-3.5" : "left-3.5"
              } top-1/2 -translate-y-1/2 text-white/40`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.admin.searchPlaceholder}
              className={`w-full bg-[#0B0B12] border border-white/10 rounded-xl ${
                isRtl ? "pr-10 pl-8" : "pl-10 pr-8"
              } py-2.5 text-xs text-white placeholder-white/30 focus:border-[#E52421] focus:outline-none focus:ring-1 focus:ring-[#E52421] font-mono`}
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); fetchRegistrations(); }}
                className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                setStoredAdminSeason(e.target.value);
              }}
              className="bg-[#0B0B12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#E52421] focus:outline-none font-mono cursor-pointer"
            >
              <option value="ALL">{isArabic ? "جميع المواسم" : "Toutes les saisons"}</option>
              {seasons.map((s: any) => (
                <option key={s.id} value={s.code}>
                  {isArabic ? `الموسم ${s.code}` : `Saison ${s.code}`}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#0B0B12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#E52421] focus:outline-none font-mono cursor-pointer"
            >
              <option value="">{isArabic ? "جميع الحالات" : "Tous les statuts"}</option>
              <option value="SUBMITTED">{t.statuses.SUBMITTED}</option>
              <option value="UNDER_REVIEW">{t.statuses.UNDER_REVIEW}</option>
              <option value="NEEDS_CORRECTION">{t.statuses.NEEDS_CORRECTION}</option>
              <option value="ACCEPTED">{t.statuses.ACCEPTED}</option>
              <option value="PAYMENT_PENDING">{t.statuses.PAYMENT_PENDING}</option>
              <option value="PAID">{t.statuses.PAID}</option>
              <option value="ACTIVE">{t.statuses.ACTIVE}</option>
              <option value="REJECTED">{t.statuses.REJECTED}</option>
              <option value="ARCHIVED">{t.statuses.ARCHIVED}</option>
            </select>

            {/* Discipline Filter */}
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="bg-[#0B0B12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#E52421] focus:outline-none font-mono cursor-pointer"
            >
              <option value="">{isArabic ? "جميع التخصصات" : "Toutes disciplines"}</option>
              <option value="parkour">{isArabic ? "باركور" : "Parkour"}</option>
              <option value="escalade-montagne">{isArabic ? "تسلق" : "Escalade"}</option>
              <option value="trail">{isArabic ? "تريل" : "Trail"}</option>
            </select>

            {/* Profile Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#0B0B12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#E52421] focus:outline-none font-mono cursor-pointer"
            >
              <option value="">
                {isArabic ? "جميع الفئات (منخرطون وطاقم)" : "Tous profils (Adhérents & Staff)"}
              </option>
              <option value="STAFF">{isArabic ? "★ الطاقم والمكتب التنفيذي" : "★ Staff & Bureau Exécutif"}</option>
              <option value="ADHERENT">{isArabic ? "المنخرطون الرياضيون" : "Adhérents sportifs"}</option>
            </select>
          </div>

          {/* Duplicates Toggle */}
          <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0B0B12] border border-white/10 text-xs font-mono cursor-pointer select-none text-white/60 hover:text-white">
            <input
              type="checkbox"
              checked={duplicatesOnly}
              onChange={(e) => setDuplicatesOnly(e.target.checked)}
              className="accent-[#E52421] rounded"
            />
            <span>{isArabic ? "المتشابهات" : "Doublons"}</span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-medium text-xs transition-all shadow-md cursor-pointer"
            >
              {isArabic ? "تصفية" : "Filtrer"}
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-[#0B0B12] hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              title={isArabic ? "إعادة الضبط" : "Réinitialiser"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results Count & Quick Tags */}
        <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1">
          <span>
            {registrations.length} {isArabic ? "ملف تم العثور عليه" : "dossier(s) trouvé(s)"}
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <span>Saison {season}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          REGISTRATIONS DATA TABLE (SOLID LUXURY DARK)
         ======================================================== */}
      <div className="relative rounded-2xl bg-[#06060A] border border-white/[0.08] overflow-hidden shadow-2xl before:absolute before:top-0 before:left-0 before:w-48 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0A0A12] font-mono text-[10px] uppercase text-white/50 tracking-wider">
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{t.admin.table.ref}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{t.admin.table.name}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{isArabic ? "الهاتف" : "Contact"}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{t.admin.table.disciplines}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{t.admin.table.status}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{isArabic ? "الاشتراك" : "Paiement"}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-right" : "text-left"}`}>{t.admin.table.date}</th>
                <th className={`py-3.5 px-4 ${isRtl ? "text-left" : "text-right"}`}>{t.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-white/40 font-mono text-xs">
                    <RefreshCw className="w-5 h-5 text-[#E52421] animate-spin mx-auto mb-2" />
                    {t.common.loading}
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-white/40 font-mono text-xs">
                    {isArabic
                      ? "لا يوجد أي ملف مطابق لمعايير البحث."
                      : "Aucun dossier ne correspond aux critères sélectionnés."}
                  </td>
                </tr>
              ) : (
                registrations.map((reg: any) => {
                  const hasPaid = reg.payments && reg.payments.length > 0;
                  const isStaff = Boolean(reg.type === "STAFF" || reg.participant?.isStaff || reg.participant?.clubRole);
                  const roleDef = getClubRoleDefinition(reg.participant?.clubRole);

                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Reference */}
                      <td className="py-3 px-4 font-mono font-medium text-xs text-[#FFD21F]/90">
                        <Link
                          href={`/admin/registrations/${reg.id}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <span>{reg.reference}</span>
                          {reg.isMarkedDuplicate && (
                            <span className="w-2 h-2 rounded-full bg-[#E52421]" title="Doublon potentiel" />
                          )}
                        </Link>
                      </td>

                      {/* Participant */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-xs text-white flex items-center gap-1.5 flex-wrap">
                          <span>{reg.participant.firstName} {reg.participant.lastName}</span>
                          {isStaff && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-medium uppercase">
                              ★ {roleDef ? (isArabic ? roleDef.labelAr || roleDef.labelFr : roleDef.labelFr) : "Staff"}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-white/40 font-normal">
                          {isStaff ? (
                            <span className="text-amber-400 font-medium">{roleDef?.cardHeaderBadge || "Direction"}</span>
                          ) : reg.participant.isMinor ? (
                            <span className="text-[#FFD21F]/80">{isArabic ? "قاصر" : "Mineur"}</span>
                          ) : (
                            <span>{isArabic ? "بالغ" : "Majeur"}</span>
                          )}{" "}
                          • {new Date().getFullYear() - new Date(reg.participant.dateOfBirth).getFullYear()} {isArabic ? "سنة" : "ans"}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 font-mono text-xs text-white/50" dir="ltr">
                        {reg.participant.phone}
                      </td>

                      {/* Disciplines */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {isStaff ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/30 text-[10px] font-mono uppercase text-amber-300 font-medium">
                              ★ {roleDef ? roleDef.cardBadgeTitle : "CADRE"}
                            </span>
                          ) : (
                            reg.disciplines.map((d: any) => (
                              <span
                                key={d.id}
                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-white/70 font-normal"
                              >
                                {isArabic ? d.discipline.nameAr || d.discipline.nameFr : d.discipline.nameFr}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={reg.status} size="sm" />
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {isStaff ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-medium">
                            {isArabic ? "معفى (طاقم)" : "Exonéré (Staff)"}
                          </span>
                        ) : hasPaid ? (
                          <span className="text-emerald-400 font-medium">
                            {reg.payments[0].amount} DA {isArabic ? "(نقداً)" : "(Espèces)"}
                          </span>
                        ) : (
                          <span className="text-white/40">{isArabic ? "غير مسدد" : "Non réglé"}</span>
                        )}
                      </td>

                      {/* Submission Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-white/40">
                        {new Date(reg.createdAt).toLocaleDateString(dateLocale, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className={`py-3 px-4 ${isRtl ? "text-left" : "text-right"}`}>
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/registrations/${reg.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#E52421] text-white/80 hover:text-white font-mono text-xs font-medium transition-all shadow-sm group-hover:bg-[#E52421]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isArabic ? "الملف" : "Dossier"}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setRegistrationToDelete(reg)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                            title={isArabic ? "حذف الطلب" : "Supprimer la candidature"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {registrationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0A0A10] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isArabic ? "نقل الطلب إلى سلة المهملات؟" : "Mettre la candidature à la corbeille ?"}
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed font-body">
                {isArabic ? (
                  <>
                    هل أنت متأكد من رغبتك في نقل الملف{" "}
                    <strong className="text-white font-mono font-bold">
                      {registrationToDelete.reference}
                    </strong>{" "}
                    الخاص بـ{" "}
                    <strong className="text-white font-bold">
                      {registrationToDelete.participant.firstName} {registrationToDelete.participant.lastName}
                    </strong>{" "}
                    إلى سلة المهملات؟
                  </>
                ) : (
                  <>
                    Êtes-vous certain de vouloir déplacer le dossier{" "}
                    <strong className="text-white font-mono font-bold">
                      {registrationToDelete.reference}
                    </strong>{" "}
                    de{" "}
                    <strong className="text-white font-bold">
                      {registrationToDelete.participant.firstName} {registrationToDelete.participant.lastName}
                    </strong>{" "}
                    dans la corbeille ?
                  </>
                )}
              </p>
              <p className="text-xs text-emerald-400/90 font-mono mt-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                🛡️ {isArabic ? "أمان: الملف والوثائق المرفقة محفوظة. يمكنك استعادة هذا الطلب في أي وقت من سلة المهملات." : "Sécurité : Le dossier et ses pièces justificatives sont conservés. Vous pourrez restaurer cette candidature à tout moment depuis la Corbeille."}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegistrationToDelete(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteRegistration}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? (isArabic ? "جارٍ النقل..." : "Déplacement...") : (isArabic ? "نقل للمهملات" : "Mettre à la corbeille")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
