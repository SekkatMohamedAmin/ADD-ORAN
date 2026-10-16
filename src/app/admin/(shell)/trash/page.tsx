"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Search,
  RefreshCw,
  User,
  FileText,
  Calendar,
  Phone,
  CheckCircle2,
  X,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

interface DeletedParticipant {
  id: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  phone: string;
  email?: string | null;
  dateOfBirth: string;
  isMinor: boolean;
  deletedAt: string;
  documents?: Array<{
    id: string;
    type: string;
  }>;
  registrations: Array<{
    id: string;
    reference: string;
    status: string;
    season: {
      code: string;
      label?: string;
    };
    disciplines: Array<{
      discipline: {
        nameFr: string;
      };
    }>;
  }>;
}

interface DeletedRegistration {
  id: string;
  reference: string;
  status: string;
  deletedAt: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  season: {
    code: string;
    label?: string;
  };
  disciplines: Array<{
    discipline: {
      nameFr: string;
    };
  }>;
}

export default function AdminTrashPage() {
  const { t, locale } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<DeletedParticipant[]>([]);
  const [registrations, setRegistrations] = useState<DeletedRegistration[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "participants" | "registrations">("all");

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [itemToPurge, setItemToPurge] = useState<{
    type: "participant" | "registration";
    id: string;
    title: string;
  } | null>(null);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trash", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants || []);
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error("Trash fetch error:", err);
      setErrorMsg("Impossible de charger le contenu de la corbeille.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestoreParticipant = async (id: string, name: string) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/participants/${id}/restore`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`L'adhérent ${name} a été restauré avec succès !`);
        fetchTrash();
      } else {
        setErrorMsg(data.error || "Erreur lors de la restauration.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau lors de la restauration.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreRegistration = async (id: string, ref: string) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/restore`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`La candidature ${ref} a été restaurée avec succès !`);
        fetchTrash();
      } else {
        setErrorMsg(data.error || "Erreur lors de la restauration.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau lors de la restauration.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmPurge = async () => {
    if (!itemToPurge) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const endpoint =
        itemToPurge.type === "participant"
          ? `/api/admin/participants/${itemToPurge.id}?permanent=true`
          : `/api/admin/registrations/${itemToPurge.id}?permanent=true`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`${itemToPurge.title} a été définitivement supprimé.`);
        setItemToPurge(null);
        fetchTrash();
      } else {
        setErrorMsg(data.error || "Erreur lors de la suppression définitive.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau lors de la suppression définitive.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmptyTrash = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/trash", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "La corbeille a été vidée.");
        setShowEmptyTrashModal(false);
        fetchTrash();
      } else {
        setErrorMsg(data.error || "Erreur lors du vidage de la corbeille.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau lors du vidage de la corbeille.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered lists
  const filteredParticipants = participants.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const filteredRegistrations = registrations.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.reference.toLowerCase().includes(q) ||
      r.participant.firstName.toLowerCase().includes(q) ||
      r.participant.lastName.toLowerCase().includes(q) ||
      r.participant.phone.includes(q)
    );
  });

  const totalInTrash = participants.length + registrations.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F5F2]">
                Corbeille & Restauration
              </h1>
              <p className="font-mono text-xs text-[#9E9EA8] mt-0.5">
                Restaurez les adhérents ou candidatures supprimés par erreur, ou purgez-les définitivement.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalInTrash > 0 && (
            <button
              type="button"
              onClick={() => setShowEmptyTrashModal(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-mono text-xs font-bold transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Vider la corbeille</span>
            </button>
          )}

          <button
            type="button"
            onClick={fetchTrash}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-[#F5F5F2] font-mono text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#E52421]" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Reassurance Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141419]/90 border border-white/10 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-[#F5F5F2]">
            Sécurité & Récupération Immédiate
          </p>
          <p className="text-[#9E9EA8] leading-relaxed">
            Les éléments placés dans la corbeille ne sont plus visibles dans les listes actives des adhérents et candidatures.
            Cependant, <strong className="text-white">leurs justificatifs, paiements et informations restent totalement sauvegardés</strong>.
            Cliquez sur <strong className="text-emerald-400">"Restaurer"</strong> à tout moment pour les réintégrer instantanément.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#141419] p-1 rounded-xl border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "all"
                ? "bg-[#E52421] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Tous ({totalInTrash})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("participants")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "participants"
                ? "bg-[#E52421] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Adhérents ({participants.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("registrations")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "registrations"
                ? "bg-[#E52421] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Candidatures ({registrations.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer la corbeille..."
            className="w-full bg-[#141419] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#E52421]"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 text-[#E52421] animate-spin" />
          <span>Chargement de la corbeille...</span>
        </div>
      ) : totalInTrash === 0 ? (
        <div className="py-20 rounded-3xl bg-[#141419]/50 border border-white/5 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            La corbeille est vide
          </h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Aucun adhérent ni candidature n'a été placé dans la corbeille. Tous les dossiers sont actifs.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ========================================================
              DELETED PARTICIPANTS SECTION
             ======================================================== */}
          {(activeTab === "all" || activeTab === "participants") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  Adhérents supprimés ({filteredParticipants.length})
                </span>
              </div>

              {filteredParticipants.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#141419]/40 border border-white/5 text-center text-xs font-mono text-gray-500">
                  Aucun adhérent ne correspond à la recherche.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredParticipants.map((p) => {
                    const deleteDate = p.deletedAt
                      ? new Date(p.deletedAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Date inconnue";

                    return (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-[#141419] border border-white/10 hover:border-amber-500/30 transition shadow-lg space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-display font-black text-amber-400 text-sm">
                              {p.firstName[0]}
                              {p.lastName[0]}
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-sm text-white">
                                {p.firstName} {p.lastName}
                              </h4>
                              <p className="font-mono text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-gray-500" />
                                {p.phone}
                                {p.isMinor && (
                                  <span className="text-amber-400 font-bold ml-1">
                                    • Mineur
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                            En corbeille
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-gray-400 bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                          <span>Supprimé le :</span>
                          <span className="text-gray-300 font-bold">{deleteDate}</span>
                        </div>

                        {p.registrations && p.registrations.length > 0 && (
                          <div className="text-[11px] font-mono text-gray-400">
                            <span>Dossier associé : </span>
                            <span className="text-white font-bold">
                              {p.registrations[0].reference} (Saison {p.registrations[0].season?.code})
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() =>
                              setItemToPurge({
                                type: "participant",
                                id: p.id,
                                title: `l'adhérent ${p.firstName} ${p.lastName}`,
                              })
                            }
                            disabled={actionLoading}
                            className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition text-xs font-mono"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRestoreParticipant(p.id, `${p.firstName} ${p.lastName}`)
                            }
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition shadow-sm disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restaurer</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              DELETED REGISTRATIONS SECTION
             ======================================================== */}
          {(activeTab === "all" || activeTab === "registrations") && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Candidatures supprimées ({filteredRegistrations.length})
                </span>
              </div>

              {filteredRegistrations.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#141419]/40 border border-white/5 text-center text-xs font-mono text-gray-500">
                  Aucune candidature ne correspond à la recherche.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRegistrations.map((r) => {
                    const deleteDate = r.deletedAt
                      ? new Date(r.deletedAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Date inconnue";

                    return (
                      <div
                        key={r.id}
                        className="p-5 rounded-2xl bg-[#141419] border border-white/10 hover:border-amber-500/30 transition shadow-lg space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-mono text-sm font-bold text-[#FFD21F]">
                              {r.reference}
                            </div>
                            <div className="font-display font-bold text-sm text-white mt-1">
                              {r.participant?.firstName} {r.participant?.lastName}
                            </div>
                            <div className="font-mono text-[11px] text-gray-400 mt-0.5">
                              Tél : {r.participant?.phone} • Saison {r.season?.code}
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                            Dossier en corbeille
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-gray-400 bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                          <span>Supprimé le :</span>
                          <span className="text-gray-300 font-bold">{deleteDate}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() =>
                              setItemToPurge({
                                type: "registration",
                                id: r.id,
                                title: `la candidature ${r.reference}`,
                              })
                            }
                            disabled={actionLoading}
                            className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition text-xs font-mono"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRestoreRegistration(r.id, r.reference)
                            }
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition shadow-sm disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restaurer</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Purge Single Item Modal */}
      {itemToPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141419] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Supprimer définitivement ?
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Êtes-vous absolument sûr de vouloir purger définitivement{" "}
                <strong className="text-white font-bold">{itemToPurge.title}</strong> ?
              </p>
              <p className="text-xs text-red-400 font-mono mt-2 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                ⚠️ Cette action est irréversible. L'élément sera purgé de la base de données et ne pourra plus être restauré.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToPurge(null)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmPurge}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{actionLoading ? "Suppression..." : "Supprimer définitivement"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Trash Modal */}
      {showEmptyTrashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141419] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Vider entièrement la corbeille ?
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Vous êtes sur le point de purger définitivement l'ensemble des éléments de la corbeille ({totalInTrash} élément(s)).
              </p>
              <p className="text-xs text-red-400 font-mono mt-2 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                ⚠️ Tous les dossiers et adhérents en corbeille seront supprimés sans possibilité de récupération ultérieure.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEmptyTrashModal(false)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleEmptyTrash}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{actionLoading ? "Vidage en cours..." : "Confirmer le vidage"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
