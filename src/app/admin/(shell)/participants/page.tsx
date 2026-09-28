"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
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
  CheckCircle2 as FiCheckCircle,
} from "lucide-react";

interface ParticipantItem {
  id: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  phone: string;
  email?: string | null;
  dateOfBirth: string;
  bloodType?: string | null;
  isMinor: boolean;
  rfidCardId?: string | null;
  membershipCardNumber?: string | null;
  createdAt: string;
  registrations: Array<{
    id: string;
    reference: string;
    status: string;
    season: {
      id: string;
      name: string;
      code: string;
    };
    disciplines: Array<{
      discipline: {
        id: string;
        slug: string;
        nameFr: string;
        nameAr: string;
      };
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
  const [seasons, setSeasons] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [ageCategory, setAgeCategory] = useState(""); // "" | "minor" | "adult"
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [page, selectedSeason, ageCategory]);

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
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiUsers className="w-6 h-6 text-[#E52421]" />
            Répertoire des Adhérents
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Fichier centralisé et permanent des membres du club, suivi pluriannuel et coordonnées.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#141419] border border-white/5 rounded-xl text-xs font-semibold text-gray-300">
            Total : <strong className="text-white font-mono">{totalCount}</strong> adhérents
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar with Red Energy Accent */}
      <div className="relative p-4 sm:p-5 bg-[#141419]/85 backdrop-blur-md border border-white/10 rounded-2xl space-y-3 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#E52421] before:to-transparent shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E52421]/[0.08] rounded-full blur-2xl pointer-events-none" />
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="relative flex-1 min-w-[260px]">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, prénom, téléphone, référence..."
              className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421] font-mono"
            />
          </div>

          {/* Season Filter */}
          <select
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(e.target.value);
              setPage(1);
            }}
            className="bg-[#1C1C24] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421] font-mono"
          >
            <option value="">Toutes les saisons</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.code}>
                Saison {s.name || s.code}
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
            className="bg-[#1C1C24] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421] font-mono"
          >
            <option value="">Tous les âges (Mineurs & Majeurs)</option>
            <option value="minor">Mineurs uniquement (&lt; 18 ans)</option>
            <option value="adult">Majeurs uniquement (18+ ans)</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#E52421]/20 font-display"
          >
            Filtrer
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
              className="px-3 py-2.5 bg-[#1C1C24] hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-xl transition font-mono"
            >
              Effacer
            </button>
          )}
        </form>
      </div>

      {/* Participants Table with Red Energy Accents */}
      <div className="relative overflow-x-auto bg-[#141419]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl before:absolute before:top-0 before:left-0 before:w-48 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1C1C24]/90 text-xs uppercase tracking-wider text-[#9E9EA8] font-mono border-b border-white/10">
            <tr>
              <th className="py-3.5 px-6">Adhérent(e)</th>
              <th className="py-3.5 px-6">Âge / Catégorie</th>
              <th className="py-3.5 px-6">Dernière Inscription</th>
              <th className="py-3.5 px-6">Disciplines</th>
              <th className="py-3.5 px-6">Statut Adhésion</th>
              <th className="py-3.5 px-6">Fidélité</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
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

                return (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition">
                    {/* Identity & Phone */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1C1C24] border border-white/5 flex items-center justify-center font-bold text-white text-xs">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <FiPhone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-4 px-6 text-xs text-gray-300">
                      <span className="font-bold text-white text-sm">{age} ans</span>
                      <span className="block text-[11px] text-gray-400">
                        {member.isMinor ? (
                          <span className="text-amber-400 font-medium">Mineur (Tuteur requis)</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">Majeur</span>
                        )}
                      </span>
                    </td>

                    {/* Latest Registration */}
                    <td className="py-4 px-6 text-xs">
                      {latestReg ? (
                        <div>
                          <span className="font-mono font-bold text-gray-200 block">
                            {latestReg.reference}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            Saison {latestReg.season.name || latestReg.season.code}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Aucune</span>
                      )}
                    </td>

                    {/* Disciplines */}
                    <td className="py-4 px-6 text-xs">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {latestReg?.disciplines?.map((d: any) => (
                          <span
                            key={d.discipline.id}
                            className="px-2 py-0.5 bg-[#1C1C24] text-gray-300 rounded text-[11px] font-medium border border-white/5"
                          >
                            {d.discipline.nameFr || d.discipline.slug}
                          </span>
                        )) || <span className="text-gray-500">—</span>}
                      </div>
                    </td>

                    {/* Membership Status */}
                    <td className="py-4 px-6">
                      {latestReg ? (
                        <StatusBadge status={latestReg.status} />
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-800 text-gray-400">
                          Non inscrit
                        </span>
                      )}
                    </td>

                    {/* Loyalty / Seasons count */}
                    <td className="py-4 px-6 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-white/5 text-gray-300 rounded-md font-mono font-semibold">
                        {member._count?.registrations || 1} saison(s)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/participants/${member.id}`}
                        className="px-3.5 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 hover:text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition border border-white/5"
                      >
                        Consulter profil
                        <FiArrowRight className="w-3.5 h-3.5 text-[#E52421]" />
                      </Link>
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
              className="p-2 bg-[#141419] hover:bg-[#1C1C24] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 bg-[#141419] hover:bg-[#1C1C24] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
