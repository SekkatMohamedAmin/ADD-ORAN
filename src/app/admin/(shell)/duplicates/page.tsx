"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import {
  Copy as FiCopy,
  AlertTriangle as FiAlertTriangle,
  CheckCircle2 as FiCheckCircle,
  ArrowRight as FiArrowRight,
  User as FiUser,
  Phone as FiPhone,
  Calendar as FiCalendar,
  ExternalLink as FiExternalLink,
  Shield as FiShield,
  Archive as FiArchive,
} from "lucide-react";

interface DuplicateCase {
  registration: {
    id: string;
    reference: string;
    status: string;
    isMarkedDuplicate: boolean;
    duplicateNotes?: string | null;
    createdAt: string;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
      dateOfBirth: string;
    };
    season: {
      code: string;
      label?: string;
    };
  };
  conflicts: Array<{
    id: string;
    reference: string;
    status: string;
    createdAt: string;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
      dateOfBirth: string;
    };
    season: {
      code: string;
      label?: string;
    };
  }>;
}

export default function DuplicatesPage() {
  const { t, locale, isRtl } = useLanguage();

  const [cases, setCases] = useState<DuplicateCase[]>([]);
  const [seasons, setSeasons] = useState<Array<{ id: string; code: string; label: string }>>([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedSeason) params.append("season", selectedSeason);

      const res = await fetch(`/api/admin/duplicates?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement des doublons.");

      const data = await res.json();
      setCases(data.duplicateCases || []);
      if (data.seasons) setSeasons(data.seasons);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, [selectedSeason]);

  const handleResolve = async (registrationId: string, action: "RESOLVE_LEGITIMATE" | "CONFIRM_DUPLICATE") => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, action }),
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Erreur de traitement.");
        return;
      }

      fetchDuplicates();
    } catch (err: any) {
      alert(err.message || "Erreur réseau.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiCopy className="w-6 h-6 text-amber-400" />
            Contrôle des Doublons d'Inscription
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Détection des correspondances (même téléphone, nom et date de naissance). Les inscriptions ne sont jamais bloquées automatiquement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-[#141419] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421]"
          >
            <option value="">Toutes les saisons</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.code}>
                {s.label || `Saison ${s.code}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-[#141419] border border-white/5 rounded-2xl animate-pulse" />
          ))
        ) : cases.length > 0 ? (
          cases.map((c) => {
            const reg = c.registration;
            const p = reg.participant;

            return (
              <div
                key={reg.id}
                className="p-6 bg-[#141419] border border-amber-500/20 rounded-2xl space-y-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
                      <FiAlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {p.firstName} {p.lastName}
                        </h3>
                        <span className="font-mono text-xs text-amber-400 font-bold">
                          {reg.reference}
                        </span>
                        <StatusBadge status={reg.status} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tél : <span className="font-mono text-gray-300">{p.phone}</span> • Né(e) le :{" "}
                        <span className="font-mono text-gray-300">
                          {new Date(p.dateOfBirth).toLocaleDateString("fr-FR")}
                        </span>{" "}
                        • Saison : <span className="text-gray-300">{reg.season?.code}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/registrations/${reg.id}`}
                      className="px-3 py-2 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      Examiner le dossier <FiExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleResolve(reg.id, "RESOLVE_LEGITIMATE")}
                      disabled={actionLoading}
                      className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <FiCheckCircle className="w-3.5 h-3.5" /> Déclarer Légitime
                    </button>
                  </div>
                </div>

                {/* Conflicting Matches */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Dossiers en correspondance ({c.conflicts.length})
                  </h4>

                  {c.conflicts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {c.conflicts.map((conf) => (
                        <div
                          key={conf.id}
                          className="p-3.5 bg-[#1C1C24] border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">
                              {conf.participant.firstName} {conf.participant.lastName}
                            </span>
                            <span className="font-mono text-gray-400 block mt-0.5">
                              Réf: {conf.reference} • Saison {conf.season.code}
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              Tél: {conf.participant.phone}
                            </span>
                          </div>

                          <div className="text-right space-y-1">
                            <StatusBadge status={conf.status} />
                            <Link
                              href={`/admin/registrations/${conf.id}`}
                              className="text-xs text-[#E52421] hover:underline flex items-center justify-end gap-1 mt-1"
                            >
                              Voir <FiArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Aucun autre dossier similaire trouvé automatiquement. Ce dossier a été manuellement signalé par l'administrateur.
                    </p>
                  )}
                </div>

                {reg.duplicateNotes && (
                  <p className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-mono">
                    Notes : {reg.duplicateNotes}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 bg-[#141419] border border-white/5 rounded-2xl text-center text-gray-400">
            <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Aucun doublon signalé</h4>
            <p className="text-xs text-gray-500 mt-1">
              Tous les dossiers d'inscription sont uniques et sans conflit détecté.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
