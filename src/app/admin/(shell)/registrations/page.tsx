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
} from "lucide-react";

export default function AdminRegistrationsPage() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [season, setSeason] = useState("2026");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        status,
        discipline,
        season,
        duplicates: duplicatesOnly ? "true" : "false",
      });

      const res = await fetch(`/api/admin/registrations?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setSeasons(data.seasons || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("Registrations fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [status, discipline, season, duplicatesOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setDiscipline("");
    setDuplicatesOnly(false);
    fetchRegistrations();
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

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141419] border border-white/10 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
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
              onChange={(e) => setSeason(e.target.value)}
              className="bg-[#1C1C24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F5F5F2] focus:border-[#E52421] focus:outline-none font-mono"
            >
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
          REGISTRATIONS DATA TABLE
         ======================================================== */}
      <div className="rounded-2xl bg-[#141419] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#1C1C24] font-mono text-[10px] uppercase text-[#9E9EA8] tracking-wider">
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
                        <Link
                          href={`/admin/registrations/${reg.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#E52421] text-[#F5F5F2] font-mono text-xs font-bold transition-all shadow-sm group-hover:bg-[#E52421]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
