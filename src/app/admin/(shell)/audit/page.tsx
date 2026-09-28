"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  Activity as FiActivity,
  Search as FiSearch,
  Filter as FiFilter,
  Clock as FiClock,
  User as FiUser,
  FileText as FiFileText,
  ChevronLeft as FiChevronLeft,
  ChevronRight as FiChevronRight,
  DollarSign as FiDollarSign,
  CheckCircle2 as FiCheckCircle,
  XCircle as FiXCircle,
  AlertTriangle as FiAlertTriangle,
  Lock as FiLock,
} from "lucide-react";

interface AuditItem {
  id: string;
  action: string;
  details?: string | null;
  createdAt: string;
  user?: {
    phone: string;
    role: string;
  } | null;
  registration?: {
    reference: string;
    participant?: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
}

export default function AuditPage() {
  const { t, locale, isRtl } = useLanguage();

  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [distinctActions, setDistinctActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "25",
      });

      if (search.trim()) params.append("search", search.trim());
      if (selectedAction) params.append("action", selectedAction);

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement du journal d'audit.");

      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
      if (data.distinctActions) setDistinctActions(data.distinctActions);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, selectedAction]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const getActionBadge = (action: string) => {
    if (action.includes("ACCEPT") || action.includes("VALIDAT")) {
      return (
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 w-max">
          <FiCheckCircle className="w-3.5 h-3.5" /> {action}
        </span>
      );
    }
    if (action.includes("REJECT") || action.includes("ARCHIV")) {
      return (
        <span className="px-2.5 py-1 bg-[#E52421]/10 text-[#E52421] border border-[#E52421]/20 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 w-max">
          <FiXCircle className="w-3.5 h-3.5" /> {action}
        </span>
      );
    }
    if (action.includes("PAYMENT")) {
      return (
        <span className="px-2.5 py-1 bg-[#FFD21F]/10 text-[#FFD21F] border border-[#FFD21F]/20 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 w-max">
          <FiDollarSign className="w-3.5 h-3.5" /> {action}
        </span>
      );
    }
    if (action.includes("DUPLICATE") || action.includes("CORRECTION")) {
      return (
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 w-max">
          <FiAlertTriangle className="w-3.5 h-3.5" /> {action}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-white/5 text-gray-300 text-xs font-mono font-bold rounded-lg w-max">
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiActivity className="w-6 h-6 text-[#E52421]" />
            Journal d'Audit & Traçabilité
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Registre d'audit permanent et infalsifiable de toutes les actions administratives et flux financiers.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-[#141419] border border-white/5 rounded-xl text-xs font-semibold text-gray-300">
          Total : <strong className="text-white font-mono">{totalCount}</strong> événements audités
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-[#141419] border border-white/5 rounded-2xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par référence, participant, administrateur, détails..."
              className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421]"
            />
          </div>

          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setPage(1);
            }}
            className="bg-[#0A0A0D] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421]"
          >
            <option value="">Toutes les actions</option>
            {distinctActions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
          >
            Filtrer
          </button>

          {(search || selectedAction) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedAction("");
                setPage(1);
              }}
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-xl transition"
            >
              Effacer
            </button>
          )}
        </form>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto bg-[#141419] border border-white/5 rounded-2xl shadow-sm">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#0A0A0D] text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Horodatage</th>
              <th className="py-3.5 px-6">Action Réalisée</th>
              <th className="py-3.5 px-6">Auteur / Admin</th>
              <th className="py-3.5 px-6">Dossier Concerné</th>
              <th className="py-3.5 px-6">Détails de l'opération</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="py-4 px-6">
                    <div className="h-6 bg-white/5 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : logs.length > 0 ? (
              logs.map((log) => {
                let parsedDetails = null;
                try {
                  if (log.details) parsedDetails = JSON.parse(log.details);
                } catch (e) {}

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                        <FiClock className="w-3.5 h-3.5 text-gray-500" />
                        {new Date(log.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {new Date(log.createdAt).toLocaleTimeString("fr-FR")}
                      </span>
                    </td>

                    <td className="py-4 px-6">{getActionBadge(log.action)}</td>

                    <td className="py-4 px-6 text-xs font-mono text-gray-300">
                      {log.user?.phone ? (
                        <span className="flex items-center gap-1.5">
                          <FiUser className="w-3 h-3 text-[#FFD21F]" />
                          {log.user.phone}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Système / Visiteur</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs font-mono">
                      {log.registration ? (
                        <div>
                          <span className="font-bold text-white block">
                            {log.registration.reference}
                          </span>
                          {log.registration.participant && (
                            <span className="text-[11px] text-gray-400">
                              {log.registration.participant.firstName}{" "}
                              {log.registration.participant.lastName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs font-mono text-gray-400 max-w-md">
                      {parsedDetails ? (
                        <div className="bg-[#0A0A0D] p-2 rounded-lg border border-white/5 truncate max-w-sm" title={JSON.stringify(parsedDetails, null, 2)}>
                          {Object.entries(parsedDetails).map(([k, v]) => (
                            <span key={k} className="inline-block mr-2">
                              <strong className="text-gray-300">{k}:</strong>{" "}
                              <span className="text-[#FFD21F]">{String(v)}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        log.details || "—"
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">
                  <FiActivity className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                  <p className="font-semibold text-white">Aucun enregistrement d'audit trouvé</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Le journal sera alimenté à chaque événement administratif.
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
            <strong className="text-white">{totalPages}</strong> ({totalCount} événements)
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
