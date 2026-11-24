"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import { getClubRoleDefinition } from "@/lib/clubRoles";
import MembershipCard from "@/components/MembershipCard";
import {
  Users as FiUsers,
  Search as FiSearch,
  Filter as FiFilter,
  ChevronLeft as FiChevronLeft,
  ChevronRight as FiChevronRight,
  User as FiUser,
  Phone as FiPhone,
  Calendar as FiCalendar,
  Activity as FiActivity,
  ArrowRight as FiArrowRight,
  CreditCard as FiCreditCard,
  Printer as FiPrinter,
  CheckCircle2 as FiCheckCircle,
  Trash2 as FiTrash2,
  AlertTriangle as FiAlertTriangle,
  X as FiX,
  Key as FiKey,
  ShieldCheck as FiShieldCheck,
  FileSpreadsheet as FiFileSpreadsheet,
  Download as FiDownload,
  Loader2 as FiLoader2,
  Check as FiCheck,
  ExternalLink as FiExternalLink,
} from "lucide-react";
import { getStoredAdminSeason, setStoredAdminSeason } from "@/lib/adminSeason";
import ResetPasswordModal from "@/components/admin/ResetPasswordModal";
import {
  downloadInsuranceExcelClient,
  downloadInsurancePdfClient,
  InsuranceAdherentRow,
  InsuranceExportMetadata,
} from "@/lib/insuranceExport";

interface ParticipantItem {
  id: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  dateOfBirth: string;
  bloodType?: string | null;
  isMinor: boolean;
  rfidCardId?: string | null;
  membershipCardNumber?: string | null;
  clubRole?: string | null;
  isStaff?: boolean;
  createdAt: string;
  documents?: Array<{
    id: string;
    type: string;
    status: string;
  }>;
  registrations: Array<{
    id: string;
    reference: string;
    status: string;
    season: {
      id: string;
      name: string;
      code: string;
      label?: string;
    };
    disciplines: Array<{
      discipline: {
        id: string;
        slug: string;
        nameFr: string;
        nameAr: string;
      };
    }>;
    documents?: Array<{
      id: string;
      type: string;
      status: string;
    }>;
    payments: Array<{
      id: string;
      amount: number;
      status: string;
    }>;
  }>;
  _count: {
    registrations: number;
    documents: number;
  };
}

export default function ParticipantsPage() {
  const { t, locale, isRtl } = useLanguage();

  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [seasons, setSeasons] = useState<Array<{ id: string; name?: string; label?: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardParticipant, setSelectedCardParticipant] = useState<ParticipantItem | null>(null);
  const [selectedResetParticipant, setSelectedResetParticipant] = useState<ParticipantItem | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<ParticipantItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(() => getStoredAdminSeason() || "");
  const [ageCategory, setAgeCategory] = useState(""); // "" | "minor" | "adult"
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Export Assurance Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSeason, setExportSeason] = useState(() => getStoredAdminSeason() || "");
  const [exportStatus, setExportStatus] = useState<"ACTIVE_PAID_ONLY" | "ALL">("ACTIVE_PAID_ONLY");
  const [exportAgeCategory, setExportAgeCategory] = useState<"" | "minor" | "adult">("");
  const [exportingFormat, setExportingFormat] = useState<"excel" | "pdf_download" | "pdf_print" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const handleExportInsurance = async (format: "excel" | "pdf_download" | "pdf_print") => {
    try {
      setExportingFormat(format);
      setExportError(null);
      setExportSuccessMsg(null);

      const params = new URLSearchParams({
        format: "json",
        status: exportStatus,
      });
      if (exportSeason) params.append("season", exportSeason);
      if (exportAgeCategory) params.append("ageCategory", exportAgeCategory);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/participants/export?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur lors de la récupération des adhérents pour l'export.");
      }

      const data = await res.json();
      const rows: InsuranceAdherentRow[] = data.rows || [];
      const metadata: InsuranceExportMetadata = data.metadata;

      if (!rows || rows.length === 0) {
        throw new Error("Aucun adhérent ne correspond aux critères sélectionnés.");
      }

      if (format === "excel") {
        downloadInsuranceExcelClient(rows, metadata);
        setExportSuccessMsg(`Classeur Excel exporté avec succès (${rows.length} adhérents).`);
      } else if (format === "pdf_download") {
        downloadInsurancePdfClient(rows, metadata, "download");
        setExportSuccessMsg(`Bordereau PDF téléchargé avec succès (${rows.length} adhérents).`);
      } else if (format === "pdf_print") {
        downloadInsurancePdfClient(rows, metadata, "print");
        setExportSuccessMsg(`Aperçu d'impression A4 ouvert dans un nouvel onglet.`);
      }
    } catch (err: any) {
      setExportError(err.message || "Erreur lors de l'exportation.");
    } finally {
      setExportingFormat(null);
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });

      if (search.trim()) params.append("search", search.trim());
      if (selectedSeason) params.append("season", selectedSeason);
      if (ageCategory) params.append("ageCategory", ageCategory);

      const res = await fetch(`/api/admin/participants?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement des adhérents.");

      const data = await res.json();
      setParticipants(data.participants || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
      if (data.seasons) setSeasons(data.seasons);

      if (!selectedSeason && data.currentSeason) {
        setSelectedSeason(data.currentSeason.code);
        setStoredAdminSeason(data.currentSeason.code);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParticipant = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/participants/${memberToDelete.id}`, {
        method: "POST",
        headers: { "X-HTTP-Method-Override": "DELETE" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de suppression.");
      setMemberToDelete(null);
      fetchParticipants();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParticipants();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, selectedSeason, ageCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchParticipants();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <FiUsers className="w-6 h-6 text-[#E52421]" />
            {t.admin.nav.participants}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {locale === "ar"
              ? "السجل المركزي والدائم لأعضاء النادي، المتابعة السنوية والمعلومات."
              : locale === "en"
              ? "Centralized directory of club members, multi-year tracking and contacts."
              : "Fichier centralisé et permanent des membres du club, suivi pluriannuel et coordonnées."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setExportSeason(selectedSeason || "");
              setExportError(null);
              setExportSuccessMsg(null);
              setShowExportModal(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-medium shadow-md shadow-emerald-600/25 transition"
            title={locale === "ar" ? "تصدير القائمة للتأمين (Excel & PDF)" : "Exporter la liste nominative pour l'assurance (Excel & PDF)"}
          >
            <FiShieldCheck className="w-4 h-4 text-emerald-100" />
            <span>{locale === "ar" ? "تصدير التأمين" : locale === "en" ? "Insurance Export" : "Export Assurance"}</span>
          </button>
          <Link
            href="/admin/cards/batch"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E52421] hover:bg-[#ff2d2a] text-white rounded-xl text-xs font-mono font-medium shadow-md shadow-[#E52421]/20 transition"
          >
            <FiPrinter className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "طباعة مجمعة" : locale === "en" ? "Batch Print" : "Impression Batch"}</span>
          </Link>
          <Link
            href="/admin/trash"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-mono font-medium transition"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span>{t.admin.nav.trash}</span>
          </Link>
          <span className="px-3.5 py-1.5 bg-[#06060A] border border-white/5 rounded-xl text-xs font-medium text-gray-300">
            {locale === "ar" ? "المجموع :" : locale === "en" ? "Total:" : "Total :"} <strong className="text-white font-mono">{totalCount}</strong> {locale === "ar" ? "مشترك" : locale === "en" ? "members" : "adhérents"}
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar with Red Energy Accent */}
      <div className="relative p-4 sm:p-5 bg-[#06060A]/85 backdrop-blur-md border border-white/10 rounded-2xl space-y-3 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#E52421] before:to-transparent shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E52421]/[0.08] rounded-full blur-2xl pointer-events-none" />
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="relative flex-1 min-w-[260px]">
            <FiSearch className={`absolute top-3.5 text-gray-500 w-4 h-4 ${isRtl ? "right-3.5" : "left-3.5"}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={locale === "ar" ? "البحث بالاسم، اللقب، الهاتف، المرجع..." : locale === "en" ? "Search by name, phone, reference..." : "Rechercher par nom, prénom, téléphone, référence..."}
              className={`w-full bg-[#0B0B12] border border-white/10 rounded-xl py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421] font-mono ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>

          {/* Season Filter */}
          <select
            value={selectedSeason}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSeason(val);
              setStoredAdminSeason(val);
              setPage(1);
            }}
            className="bg-[#0B0B12] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421] font-mono"
          >
            <option value="">{locale === "ar" ? "الموسم الحالي (النشط)" : locale === "en" ? "Active Season" : "Saison en cours (Active)"}</option>
            <option value="ALL">{locale === "ar" ? "جميع المواسم" : locale === "en" ? "All Seasons" : "Toutes les saisons"}</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.code}>
                {locale === "ar" ? `الموسم ${s.name || s.code}` : `Saison ${s.name || s.code}`}
              </option>
            ))}
          </select>

          {/* Age Category Filter */}
          <select
            value={ageCategory}
            onChange={(e) => {
              setAgeCategory(e.target.value);
              setPage(1);
            }}
            className="bg-[#0B0B12] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421] font-mono"
          >
            <option value="">{locale === "ar" ? "جميع الفئات العمرية" : locale === "en" ? "All ages" : "Tous les âges (Mineurs & Majeurs)"}</option>
            <option value="minor">{locale === "ar" ? "القصر فقط (< 18 سنة)" : locale === "en" ? "Minors only (< 18 yo)" : "Mineurs uniquement (< 18 ans)"}</option>
            <option value="adult">{locale === "ar" ? "البالغون فقط (18+ سنة)" : locale === "en" ? "Adults only (18+ yo)" : "Majeurs uniquement (18+ ans)"}</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-semibold rounded-xl transition shadow-md shadow-[#E52421]/20"
          >
            {locale === "ar" ? "تصفية" : locale === "en" ? "Filter" : "Filtrer"}
          </button>

          {(search || selectedSeason || ageCategory) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedSeason("");
                setAgeCategory("");
                setPage(1);
              }}
              className="px-3 py-2.5 bg-[#0B0B12] hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-xl transition font-mono"
            >
              {locale === "ar" ? "مسح" : locale === "en" ? "Clear" : "Effacer"}
            </button>
          )}
        </form>
      </div>

      {/* Participants Table with Red Energy Accents */}
      <div className="relative overflow-x-auto bg-[#06060A]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl before:absolute before:top-0 before:left-0 before:w-48 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
        <table className="w-full text-start text-xs text-gray-300">
          <thead className="bg-[#0B0B12]/90 text-[10px] uppercase tracking-wider text-white/40 font-medium font-mono border-b border-white/[0.08]">
            <tr>
              <th className="py-3 px-5 text-start">{locale === "ar" ? "المشترك(ة)" : locale === "en" ? "Member" : "Adhérent(e)"}</th>
              <th className="py-3 px-5 text-start">{locale === "ar" ? "العمر / الفئة" : locale === "en" ? "Age / Category" : "Âge / Catégorie"}</th>
              <th className="py-3 px-5 text-start">{locale === "ar" ? "آخر تسجيل" : locale === "en" ? "Latest Reg." : "Dernière Inscription"}</th>
              <th className="py-3 px-5 text-start">{locale === "ar" ? "التخصصات" : locale === "en" ? "Disciplines" : "Disciplines"}</th>
              <th className="py-3 px-5 text-start">{locale === "ar" ? "حالة الانخراط" : locale === "en" ? "Membership Status" : "Statut Adhésion"}</th>
              <th className="py-3 px-5 text-start">{locale === "ar" ? "الأقدمية" : locale === "en" ? "Loyalty" : "Fidélité"}</th>
              <th className="py-3 px-5 text-end">{locale === "ar" ? "إجراءات" : locale === "en" ? "Actions" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-4 px-6">
                    <div className="h-6 bg-white/5 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : participants.length > 0 ? (
              participants.map((member) => {
                const latestReg = member.registrations?.[0];
                const age = Math.floor(
                  (new Date().getTime() - new Date(member.dateOfBirth).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                );
                const isStaff = Boolean(member.isStaff || member.clubRole);
                const roleDef = getClubRoleDefinition(member.clubRole);
                const photoDocId =
                  member.documents?.find((d) => d.type === "PHOTO")?.id ||
                  member.registrations?.flatMap((r) => r.documents || []).find((d) => d.type === "PHOTO")?.id ||
                  null;

                return (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition">
                    {/* Identity & Phone */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0B0B12] border border-white/10 shrink-0 flex items-center justify-center">
                          {photoDocId ? (
                            <img
                              src={`/api/documents/${photoDocId}`}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-medium text-white text-xs">
                              {member.firstName.charAt(0)}
                              {member.lastName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-xs text-white flex items-center gap-1.5 flex-wrap">
                            <span>{member.firstName} {member.lastName}</span>
                            {isStaff && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-medium uppercase">
                                ★ {roleDef ? roleDef.labelFr : "Staff"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5 font-normal">
                            <FiPhone className="w-3 h-3 text-white/40" />
                            {member.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Age & Profile */}
                    <td className="py-3 px-5 text-xs text-gray-300">
                      <span className="font-medium text-white text-xs">{age} ans</span>
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {isStaff ? (
                          <span className="text-amber-300 font-medium">{roleDef?.cardHeaderBadge || "Direction"}</span>
                        ) : member.isMinor ? (
                          <span className="text-amber-400/90 font-normal">Mineur</span>
                        ) : (
                          <span className="text-emerald-400/90 font-normal">Majeur</span>
                        )}
                      </span>
                    </td>

                    {/* Latest Registration */}
                    <td className="py-3 px-5 text-xs">
                      {latestReg ? (
                        <div>
                          <span className="font-mono font-medium text-xs text-white/90 block">
                            {latestReg.reference}
                          </span>
                          <span className="text-gray-400 text-[10px] font-normal">
                            Saison {latestReg.season.name || latestReg.season.code}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-[11px]">Aucune</span>
                      )}
                    </td>

                    {/* Disciplines */}
                    <td className="py-3 px-5 text-xs">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {latestReg?.disciplines?.map((d: any) => (
                          <span
                            key={d.discipline.id}
                            className="px-2 py-0.5 bg-[#0B0B12] text-gray-300 rounded text-[10px] font-normal border border-white/5"
                          >
                            {d.discipline.nameFr || d.discipline.slug}
                          </span>
                        )) || <span className="text-gray-500">—</span>}
                      </div>
                    </td>

                    {/* Membership Status */}
                    <td className="py-3 px-5">
                      {latestReg ? (
                        <StatusBadge status={latestReg.status} size="sm" />
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-800/60 text-gray-400 border border-white/5">
                          Non inscrit
                        </span>
                      )}
                    </td>

                    {/* Loyalty / Seasons count */}
                    <td className="py-3 px-5 text-xs text-gray-400">
                      <span className="px-2 py-0.5 bg-white/5 text-gray-300 rounded-md font-mono text-[11px] font-normal">
                        {member._count?.registrations || 1} saison(s)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedResetParticipant(member)}
                          className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl transition border border-amber-500/20 cursor-pointer"
                          title="Réinitialiser le mot de passe"
                        >
                          <FiKey className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCardParticipant(member)}
                          className="px-3 py-1.5 bg-[#E52421]/10 hover:bg-[#E52421]/20 text-[#E52421] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition border border-[#E52421]/20 cursor-pointer"
                          title="Voir la carte d'adhérent"
                        >
                          <FiCreditCard className="w-3.5 h-3.5" />
                          Carte
                        </button>
                        <Link
                          href={`/admin/participants/${member.id}`}
                          className="px-3.5 py-1.5 bg-[#0B0B12] hover:bg-white/10 text-gray-200 hover:text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition border border-white/5"
                        >
                          Profil
                          <FiArrowRight className="w-3.5 h-3.5 text-[#E52421]" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMemberToDelete(member)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20 cursor-pointer"
                          title="Supprimer définitivement l'adhérent"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <FiUsers className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                  <p className="font-semibold text-white">Aucun adhérent trouvé</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Modifiez vos filtres ou termes de recherche pour afficher les membres.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
          <span>
            Affichage de la page <strong className="text-white">{page}</strong> sur{" "}
            <strong className="text-white">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 bg-[#06060A] hover:bg-[#0B0B12] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 bg-[#06060A] hover:bg-[#0B0B12] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Membership Card Modal */}
      {selectedCardParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-[#101015] border border-white/10 rounded-3xl p-6 max-w-xl w-full flex flex-col items-center shadow-2xl">
            <MembershipCard
              participant={selectedCardParticipant}
              registration={selectedCardParticipant.registrations?.[0]}
              photoDocId={
                selectedCardParticipant.documents?.[0]?.id ||
                selectedCardParticipant.registrations?.[0]?.documents?.[0]?.id ||
                null
              }
              onClose={() => setSelectedCardParticipant(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#06060A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Mettre l&apos;adhérent à la corbeille ?
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Êtes-vous certain de vouloir déplacer{" "}
                <strong className="text-white font-bold">
                  {memberToDelete.firstName} {memberToDelete.lastName}
                </strong>{" "}
                (Téléphone : {memberToDelete.phone}) dans la corbeille ?
              </p>
              <p className="text-xs text-emerald-400/90 font-mono mt-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                🛡️ Sécurité : Ses dossiers, documents et paiements ne sont pas perdus. Vous pourrez restaurer cet adhérent à tout moment depuis la page Corbeille.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteParticipant}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>{deleting ? "Déplacement..." : "Mettre à la corbeille"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reset Password Modal */}
      {selectedResetParticipant && (
        <ResetPasswordModal
          isOpen={!!selectedResetParticipant}
          onClose={() => setSelectedResetParticipant(null)}
          participantId={selectedResetParticipant.id}
          participantName={`${selectedResetParticipant.firstName} ${selectedResetParticipant.lastName}`}
          phone={selectedResetParticipant.phone}
          whatsapp={selectedResetParticipant.whatsapp}
        />
      )}

      {/* Export Assurance Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-[#06060A] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FiShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Bordereau & Export Assurance Sportive
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    État nominatif officiel des adhérents pour la souscription en agence
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Options Panel */}
            <div className="space-y-4 bg-[#101015] border border-white/5 rounded-2xl p-4 text-xs">
              {/* Season Selection */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">
                  Saison sportive concernée
                </label>
                <select
                  value={exportSeason}
                  onChange={(e) => setExportSeason(e.target.value)}
                  className="w-full bg-[#0B0B12] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Saison en cours (Active)</option>
                  <option value="ALL">Toutes les saisons</option>
                  {seasons.map((s) => (
                    <option key={s.id} value={s.code}>
                      Saison {s.name || s.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">
                  Statut des dossiers d&apos;inscription
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportStatus("ACTIVE_PAID_ONLY")}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition ${
                      exportStatus === "ACTIVE_PAID_ONLY"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                        : "bg-[#181820] border-white/5 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <div className="mt-0.5">
                      {exportStatus === "ACTIVE_PAID_ONLY" ? (
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold block text-white">Validés & Payés (Recommandé)</span>
                      <span className="text-[11px] text-gray-400">Athlètes ayant finalisé leur adhésion</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportStatus("ALL")}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition ${
                      exportStatus === "ALL"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                        : "bg-[#181820] border-white/5 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <div className="mt-0.5">
                      {exportStatus === "ALL" ? (
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold block text-white">Tous les inscrits</span>
                      <span className="text-[11px] text-gray-400">Inclut les dossiers en cours d&apos;examen</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Age Category Filter */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">
                  Catégorie d&apos;âge
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  {[
                    { id: "", label: "Tous les âges" },
                    { id: "minor", label: "Mineurs (< 18)" },
                    { id: "adult", label: "Majeurs (18+)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setExportAgeCategory(cat.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-center transition ${
                        exportAgeCategory === cat.id
                          ? "bg-white/10 border-white/20 text-white font-bold"
                          : "bg-[#181820] border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            {exportError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <FiAlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{exportError}</span>
              </div>
            )}
            {exportSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{exportSuccessMsg}</span>
              </div>
            )}

            {/* Export Actions Grid */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                Choisissez le format d&apos;export :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Excel Option */}
                <button
                  type="button"
                  onClick={() => handleExportInsurance("excel")}
                  disabled={exportingFormat !== null}
                  className="flex flex-col items-start gap-1 p-3.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 rounded-2xl text-left transition disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <FiFileSpreadsheet className="w-4 h-4" />
                      Fichier Excel (.xlsx)
                    </span>
                    {exportingFormat === "excel" ? (
                      <FiLoader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <FiDownload className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-y-0.5 transition" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1">
                    Avec colonnes de suivi : N° Police, prime, date d&apos;effet et quittance.
                  </span>
                </button>

                {/* PDF Print Option */}
                <button
                  type="button"
                  onClick={() => handleExportInsurance("pdf_print")}
                  disabled={exportingFormat !== null}
                  className="flex flex-col items-start gap-1 p-3.5 bg-sky-600/15 hover:bg-sky-600/25 border border-sky-500/30 rounded-2xl text-left transition disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2 text-xs font-bold text-sky-300">
                      <FiPrinter className="w-4 h-4" />
                      Bordereau PDF (Imprimer)
                    </span>
                    {exportingFormat === "pdf_print" ? (
                      <FiLoader2 className="w-4 h-4 animate-spin text-sky-400" />
                    ) : (
                      <FiExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1">
                    Format officiel A4 Paysage prêt pour impression physique et cachet.
                  </span>
                </button>
              </div>

              {/* PDF Direct Download option */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleExportInsurance("pdf_download")}
                  disabled={exportingFormat !== null}
                  className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Ou télécharger directement le PDF du Bordereau</span>
                  {exportingFormat === "pdf_download" && <FiLoader2 className="w-3 h-3 animate-spin ml-1" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
