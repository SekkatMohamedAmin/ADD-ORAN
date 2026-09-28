"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  Calendar as FiCalendar,
  Plus as FiPlus,
  CheckCircle2 as FiCheckCircle,
  Users as FiUsers,
  DollarSign as FiDollarSign,
  FileText as FiFileText,
  ArrowRight as FiArrowRight,
  Archive as FiArchive,
  AlertCircle as FiAlertCircle,
  Check as FiCheck,
} from "lucide-react";

interface SeasonItem {
  id: string;
  code: string;
  label: string;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  activeMembersCount: number;
  totalRevenue: number;
  _count: {
    registrations: number;
    payments: number;
  };
}

export default function SeasonsPage() {
  const { t, locale, isRtl } = useLanguage();

  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(false);

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/seasons");
      if (!res.ok) throw new Error("Erreur de chargement des saisons.");
      const data = await res.json();
      setSeasons(data.seasons || []);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      const res = await fetch("/api/admin/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          label: label.trim(),
          startDate: startDate || null,
          endDate: endDate || null,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Impossible de créer la saison.");
        return;
      }

      setIsModalOpen(false);
      setCode("");
      setLabel("");
      setStartDate("");
      setEndDate("");
      setIsActive(false);
      fetchSeasons();
    } catch (err: any) {
      alert(err.message || "Erreur réseau.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSetActive = async (seasonId: string) => {
    if (!confirm("Voulez-vous définir cette saison comme saison active courante pour le club ?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/seasons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: seasonId, isActive: true }),
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Erreur de mise à jour.");
        return;
      }

      fetchSeasons();
    } catch (err: any) {
      alert(err.message || "Erreur réseau.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiCalendar className="w-6 h-6 text-[#E52421]" />
            Gestion des Saisons Sportives
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Chaque saison cloisonne les inscriptions, compteurs de reçus séquentiels et cotisations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#E52421]/20"
        >
          <FiPlus className="w-4 h-4" />
          Nouvelle Saison
        </button>
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-[#141419] border border-white/5 rounded-2xl animate-pulse" />
          ))
        ) : seasons.length > 0 ? (
          seasons.map((season) => (
            <div
              key={season.id}
              className={`p-6 bg-[#141419] border rounded-2xl flex flex-col justify-between transition ${
                season.isActive
                  ? "border-[#E52421] shadow-lg shadow-[#E52421]/5"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-1 bg-[#1C1C24] text-gray-300 font-mono text-xs font-bold rounded-md">
                      CODE {season.code}
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-2">{season.label}</h3>
                  </div>

                  {season.isActive ? (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5" /> En cours
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-gray-800 text-gray-400 text-xs font-semibold rounded-lg flex items-center gap-1">
                      <FiArchive className="w-3.5 h-3.5" /> Clôturée
                    </span>
                  )}
                </div>

                {/* Dates */}
                {(season.startDate || season.endDate) && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                    <FiCalendar className="w-3.5 h-3.5 text-gray-500" />
                    {season.startDate
                      ? new Date(season.startDate).toLocaleDateString("fr-FR")
                      : "—"}{" "}
                    au{" "}
                    {season.endDate
                      ? new Date(season.endDate).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  <div className="p-3 bg-[#1C1C24] rounded-xl">
                    <span className="text-[11px] text-gray-400 block">Inscriptions</span>
                    <strong className="text-base font-bold text-white font-mono">
                      {season._count?.registrations || 0}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#1C1C24] rounded-xl">
                    <span className="text-[11px] text-gray-400 block">Adhérents Actifs</span>
                    <strong className="text-base font-bold text-emerald-400 font-mono">
                      {season.activeMembersCount || 0}
                    </strong>
                  </div>
                  <div className="col-span-2 p-3 bg-[#1C1C24] rounded-xl">
                    <span className="text-[11px] text-gray-400 block">Cotisations perçues</span>
                    <strong className="text-base font-bold text-[#FFD21F] font-mono">
                      {(season.totalRevenue || 0).toLocaleString()} DZD
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-white/5 flex items-center justify-between gap-3 mt-4">
                <Link
                  href={`/admin/registrations?season=${season.code}`}
                  className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition"
                >
                  Voir inscriptions <FiArrowRight className="w-3.5 h-3.5 text-[#E52421]" />
                </Link>

                {!season.isActive && (
                  <button
                    onClick={() => handleSetActive(season.id)}
                    className="px-3 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition"
                  >
                    Activer
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 p-12 bg-[#141419] border border-white/5 rounded-2xl text-center text-gray-400">
            <FiCalendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Aucune saison enregistrée</h4>
            <p className="text-xs text-gray-500 mt-1">Créez votre première saison sportive pour ouvrir les inscriptions.</p>
          </div>
        )}
      </div>

      {/* CREATE SEASON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateSeason}
            className="bg-[#141419] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E52421]/10 text-[#E52421] rounded-xl flex items-center justify-center">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Créer une nouvelle saison</h3>
                <p className="text-xs text-gray-400">Initialise les compteurs séquentiels et registres</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">
                  Code de la saison (Année) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex : 2027"
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">
                  Libellé officiel de la saison *
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex : Saison 2026–2027"
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Date de début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E52421]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E52421]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 bg-[#1C1C24] rounded-xl cursor-pointer hover:bg-[#252530]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#E52421]"
                />
                <div className="text-xs">
                  <span className="text-white font-semibold block">Définir comme saison active</span>
                  <span className="text-gray-400">Rendra cette saison par défaut pour les nouvelles inscriptions</span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={modalLoading}
                className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                {modalLoading ? "Création..." : "Créer la saison"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
