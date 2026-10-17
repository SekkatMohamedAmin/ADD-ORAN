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
import { getStoredAdminSeason, setStoredAdminSeason } from "@/lib/adminSeason";

export default function AdminRegistrationsPage() {
  const { t } = useLanguage();

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
        method: "DELETE",
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
  }, [search, status, discipline, season, duplicatesOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setDiscipline("");
    setDuplicatesOnly(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F5F2]">
            {t.admin.registrations}
          </h1>
          <p className="font-mono text-xs text-[#9E9EA8] mt-1">
            Gestion du flux des demandes d&apos;adhésion et examen des dossiers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/trash"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-mono text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Corbeille</span>
          </Link>
          <button
            type="button"
            onClick={fetchRegistrations}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-[#F5F5F2] font-mono text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#E52421]" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar with Red Energy Accent Line */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-[#141419]/90 backdrop-blur-sm border border-white/10 space-y-4 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#E52421] before:to-transparent shadow-lg">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E52421]/[0.06] rounded-full blur-3xl pointer-events-none" />
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 relative z-10">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9EA8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.admin.searchPlaceholder}
              className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F5F2] placeholder-[#9E9EA8]/50 focus:border-[#E52421] focus:outline-none focus:ring-1 focus:ring-[#E52421] font-mono"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); fetchRegistrations(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9EA8] hover:text-[#F5F5F2]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-2">
            <select
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                setStoredAdminSeason(e.target.value);
              }}
              className="bg-[#1C1C24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F5F5F2] focus:border-[#E52421] focus:outline-none font-mono"
            >
              <option value="ALL">Toutes les saisons</option>
              {seasons.map((s: any) => (
                <option key={s.id} value={s.code}>
                  Saison {s.code}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#1C1C24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F5F5F2] focus:border-[#E52421] focus:outline-none font-mono"
            >
              <option value="">Tous les statuts</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="UNDER_REVIEW">En cours d&apos;examen</option>
              <option value="NEEDS_CORRECTION">Correction requise</option>
              <option value="ACCEPTED">Accepté</option>
              <option value="PAYMENT_PENDING">Paiement en attente</option>
              <option value="PAID">Cotisation réglée</option>
              <option value="ACTIVE">Adhérent Actif</option>
              <option value="REJECTED">Refusé</option>
              <option value="ARCHIVED">Archivé</option>
            </select>

            {/* Discipline Filter */}
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="bg-[#1C1C24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F5F5F2] focus:border-[#E52421] focus:outline-none font-mono"
            >
              <option value="">Toutes disciplines</option>
              <option value="parkour">Parkour</option>
              <option value="escalade-montagne">Escalade</option>
              <option value="trail">Trail</option>
            </select>
          </div>

          {/* Duplicates Toggle */}
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1C1C24] border border-white/10 text-xs font-mono cursor-pointer select-none text-[#9E9EA8] hover:text-[#F5F5F2]">
            <input
              type="checkbox"
              checked={duplicatesOnly}
              onChange={(e) => setDuplicatesOnly(e.target.checked)}
              className="accent-[#E52421] rounded"
            />
            <span>Doublons</span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-xs uppercase tracking-wider transition-all"
            >
              Filtrer
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-[#1C1C24] hover:bg-white/10 text-[#9E9EA8] hover:text-[#F5F5F2] transition-colors"
              title="Réinitialiser"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results Count & Quick Tags */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#9E9EA8] pt-1">
          <span>{registrations.length} dossier(s) trouvé(s)</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Saison {season}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          REGISTRATIONS DATA TABLE WITH RED ENERGY ACCENT
         ======================================================== */}
      <div className="relative rounded-2xl bg-[#141419]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-xl before:absolute before:top-0 before:left-0 before:w-48 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#1C1C24]/90 font-mono text-[10px] uppercase text-[#9E9EA8] tracking-wider">
                <th className="py-3.5 px-4">{t.admin.table.ref}</th>
                <th className="py-3.5 px-4">{t.admin.table.name}</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">{t.admin.table.disciplines}</th>
                <th className="py-3.5 px-4">{t.admin.table.status}</th>
                <th className="py-3.5 px-4">Paiement</th>
                <th className="py-3.5 px-4">{t.admin.table.date}</th>
                <th className="py-3.5 px-4 text-right">{t.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9E9EA8] font-mono text-xs">
                    <RefreshCw className="w-5 h-5 text-[#E52421] animate-spin mx-auto mb-2" />
                    Chargement des dossiers...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#9E9EA8] font-mono text-xs">
                    Aucun dossier ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                registrations.map((reg: any) => {
                  const hasPaid = reg.payments && reg.payments.length > 0;
                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Reference */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#FFD21F]">
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
                      <td className="py-3.5 px-4">
                        <div className="font-display font-bold text-sm text-[#F5F5F2]">
                          {reg.participant.firstName} {reg.participant.lastName}
                        </div>
                        <div className="font-mono text-[10px] text-[#9E9EA8]">
                          {reg.participant.isMinor ? (
                            <span className="text-[#FFD21F]">Mineur</span>
                          ) : (
                            <span>Majeur</span>
                          )}{" "}
                          • {new Date().getFullYear() - new Date(reg.participant.dateOfBirth).getFullYear()} ans
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#9E9EA8]">
                        {reg.participant.phone}
                      </td>

                      {/* Disciplines */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {reg.disciplines.map((d: any) => (
                            <span
                              key={d.id}
                              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-[#F5F5F2]"
                            >
                              {d.discipline.nameFr}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={reg.status} size="sm" />
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {hasPaid ? (
                          <span className="text-[#10B981] font-bold">
                            {reg.payments[0].amount} DA (Espèces)
                          </span>
                        ) : (
                          <span className="text-[#9E9EA8]">Non réglé</span>
                        )}
                      </td>

                      {/* Submission Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#9E9EA8]">
                        {new Date(reg.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/registrations/${reg.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#E52421] text-[#F5F5F2] font-mono text-xs font-bold transition-all shadow-sm group-hover:bg-[#E52421]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossier</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setRegistrationToDelete(reg)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
                            title="Supprimer la candidature"
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
          <div className="bg-[#141419] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Mettre la candidature à la corbeille ?
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Êtes-vous certain de vouloir déplacer le dossier{" "}
                <strong className="text-white font-mono font-bold">
                  {registrationToDelete.reference}
                </strong>{" "}
                de{" "}
                <strong className="text-white font-bold">
                  {registrationToDelete.participant.firstName} {registrationToDelete.participant.lastName}
                </strong>{" "}
                dans la corbeille ?
              </p>
              <p className="text-xs text-emerald-400/90 font-mono mt-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                🛡️ Sécurité : Le dossier et ses pièces justificatives sont conservés. Vous pourrez restaurer cette candidature à tout moment depuis la Corbeille.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegistrationToDelete(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteRegistration}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? "Déplacement..." : "Mettre à la corbeille"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
