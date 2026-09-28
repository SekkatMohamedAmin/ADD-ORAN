"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  FileText as FiFileText,
  Search as FiSearch,
  Filter as FiFilter,
  Eye as FiEye,
  Check as FiCheck,
  X as FiX,
  ChevronLeft as FiChevronLeft,
  ChevronRight as FiChevronRight,
  Clock as FiClock,
  AlertTriangle as FiAlertTriangle,
  CheckCircle2 as FiCheckCircle,
  XCircle as FiXCircle,
} from "lucide-react";

interface DocumentItem {
  id: string;
  type: string;
  status: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  rejectionReason?: string | null;
  createdAt: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  registration?: {
    id: string;
    reference: string;
    status: string;
    season: {
      code: string;
      label?: string;
    };
  } | null;
}

export default function DocumentsPage() {
  const { t, locale, isRtl } = useLanguage();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, valid: 0, invalid: 0 });
  const [seasons, setSeasons] = useState<Array<{ id: string; code: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [seasonCode, setSeasonCode] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });

      if (search.trim()) params.append("search", search.trim());
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("type", typeFilter);
      if (seasonCode) params.append("season", seasonCode);

      const res = await fetch(`/api/admin/documents?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement des documents.");

      const data = await res.json();
      setDocuments(data.documents || []);
      if (data.stats) setStats(data.stats);
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
    fetchDocuments();
  }, [page, statusFilter, typeFilter, seasonCode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDocuments();
  };

  const handleUpdateStatus = async (documentId: string, status: "VALID" | "INVALID") => {
    let rejectionReason = null;
    if (status === "INVALID") {
      rejectionReason = prompt("Veuillez saisir le motif du rejet de ce document :");
      if (!rejectionReason) return;
    }

    try {
      const res = await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, status, rejectionReason }),
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Erreur de mise à jour.");
        return;
      }

      fetchDocuments();
    } catch (err: any) {
      alert(err.message || "Erreur réseau.");
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "PHOTO":
        return "Photo d'identité";
      case "ID_CARD":
        return "Pièce d'identité (CNI / Passeport)";
      case "MEDICAL_CERTIFICATE":
        return "Certificat Médical";
      case "PARENTAL_AUTHORIZATION":
        return "Autorisation Parentale";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiFileText className="w-6 h-6 text-[#E52421]" />
            Contrôle & Validation des Justificatifs
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Vérification de l'authenticité et de la validité des pièces déposées par les participants.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141419] border border-white/5 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1">Total Pièces</span>
          <strong className="text-xl font-extrabold text-white font-mono">{stats.total}</strong>
        </div>
        <div className="p-4 bg-[#141419] border border-white/5 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1 flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-[#FFD21F]" /> En Attente
          </span>
          <strong className="text-xl font-extrabold text-[#FFD21F] font-mono">{stats.pending}</strong>
        </div>
        <div className="p-4 bg-[#141419] border border-white/5 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1 flex items-center gap-1.5">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Validées
          </span>
          <strong className="text-xl font-extrabold text-emerald-400 font-mono">{stats.valid}</strong>
        </div>
        <div className="p-4 bg-[#141419] border border-white/5 rounded-2xl">
          <span className="text-xs text-gray-400 block mb-1 flex items-center gap-1.5">
            <FiXCircle className="w-3.5 h-3.5 text-[#E52421]" /> Rejetées
          </span>
          <strong className="text-xl font-extrabold text-[#E52421] font-mono">{stats.invalid}</strong>
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
              placeholder="Rechercher par adhérent, téléphone, référence dossier..."
              className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#0A0A0D] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421]"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente de vérification</option>
            <option value="VALID">Validé</option>
            <option value="INVALID">Rejeté / À corriger</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#0A0A0D] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421]"
          >
            <option value="">Tous les types de pièces</option>
            <option value="PHOTO">Photo d'identité</option>
            <option value="ID_CARD">Pièce d'identité (CNI)</option>
            <option value="MEDICAL_CERTIFICATE">Certificat médical</option>
            <option value="PARENTAL_AUTHORIZATION">Autorisation parentale</option>
          </select>

          <select
            value={seasonCode}
            onChange={(e) => {
              setSeasonCode(e.target.value);
              setPage(1);
            }}
            className="bg-[#0A0A0D] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421]"
          >
            <option value="">Toutes les saisons</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.code}>
                {s.label || `Saison ${s.code}`}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
          >
            Filtrer
          </button>

          {(search || statusFilter || typeFilter || seasonCode) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setTypeFilter("");
                setSeasonCode("");
                setPage(1);
              }}
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-xl transition"
            >
              Effacer
            </button>
          )}
        </form>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto bg-[#141419] border border-white/5 rounded-2xl shadow-sm">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#0A0A0D] text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Adhérent(e)</th>
              <th className="py-3.5 px-6">Dossier / Réf</th>
              <th className="py-3.5 px-6">Type de Pièce</th>
              <th className="py-3.5 px-6">Fichier</th>
              <th className="py-3.5 px-6">Statut</th>
              <th className="py-3.5 px-6">Date de dépôt</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-4 px-6">
                    <div className="h-6 bg-white/5 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : documents.length > 0 ? (
              documents.map((doc) => {
                const docUrl = `/api/documents/${doc.id}`;
                return (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">
                        {doc.participant.firstName} {doc.participant.lastName}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {doc.participant.phone}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs">
                      {doc.registration ? (
                        <Link
                          href={`/admin/registrations/${doc.registration.id}`}
                          className="text-gray-300 hover:text-white underline decoration-white/20"
                        >
                          {doc.registration.reference}
                        </Link>
                      ) : (
                        <span className="text-gray-500 italic">Profil</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs">
                      <span className="font-semibold text-white block">
                        {getTypeName(doc.type)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      <span className="truncate max-w-[180px] block" title={doc.originalFilename}>
                        {doc.originalFilename}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {(doc.fileSize / 1024).toFixed(0)} Ko • {doc.mimeType}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider inline-block ${
                          doc.status === "VALID"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : doc.status === "INVALID"
                            ? "bg-[#E52421]/10 text-[#E52421] border border-[#E52421]/30"
                            : "bg-[#FFD21F]/10 text-[#FFD21F] border border-[#FFD21F]/30"
                        }`}
                      >
                        {doc.status === "VALID"
                          ? "Validé"
                          : doc.status === "INVALID"
                          ? "Rejeté"
                          : "En attente"}
                      </span>
                      {doc.rejectionReason && (
                        <span className="block text-[11px] text-[#E52421] mt-1 max-w-[200px] truncate" title={doc.rejectionReason}>
                          {doc.rejectionReason}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="Aperçu sécurisé"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </a>

                        {doc.status !== "VALID" && (
                          <button
                            onClick={() => handleUpdateStatus(doc.id, "VALID")}
                            className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            title="Valider"
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {doc.status !== "INVALID" && (
                          <button
                            onClick={() => handleUpdateStatus(doc.id, "INVALID")}
                            className="px-2.5 py-1.5 bg-[#E52421]/20 hover:bg-[#E52421]/30 text-[#E52421] border border-[#E52421]/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            title="Rejeter"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <FiFileText className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                  <p className="font-semibold text-white">Aucun document trouvé</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Modifiez vos filtres ou termes de recherche pour afficher les justificatifs.
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
            <strong className="text-white">{totalPages}</strong> ({totalCount} pièces)
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
