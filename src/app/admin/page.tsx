"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Shield,
  Search,
  Users,
  CreditCard,
  Eye,
  Printer,
  Calendar,
  RefreshCw,
} from "lucide-react";

export default function AdminPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [seasons, setSeasons] = useState<any[]>([]);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");
  const [selectedSeasonCode, setSelectedSeasonCode] = useState("2026");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);

  // Inspector Modal
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "DOCUMENTS" | "ACTIONS" | "PAYMENT">("OVERVIEW");

  // Action Dialog States
  const [actionLoading, setActionLoading] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionFields, setCorrectionFields] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("4000");
  const [paymentPurpose, setPaymentPurpose] = useState("Cotisation annuelle, assurance & premier mois");
  const [actionMessage, setActionMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        season: selectedSeasonCode,
        search: searchTerm,
        status: statusFilter,
        discipline: disciplineFilter,
        duplicates: duplicatesOnly ? "true" : "false",
      });

      const res = await fetch(`/api/admin/registrations?${query.toString()}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setRegistrations(data.registrations || []);
      setStats(data.stats || {});
      setSeasons(data.seasons || []);

      if (selectedReg) {
        const refreshed = (data.registrations || []).find((r: any) => r.id === selectedReg.id);
        if (refreshed) setSelectedReg(refreshed);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSeasonCode, statusFilter, disciplineFilter, duplicatesOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleAdminAction = async (action: string, payload: any = {}) => {
    if (!selectedReg) return;
    setActionLoading(true);
    setActionMessage("");

    try {
      const res = await fetch(`/api/admin/registrations/${selectedReg.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'exécution de l'action.");
      }

      setActionMessage("Action validée avec succès.");
      await fetchData();
    } catch (err) {
      setActionMessage(`Erreur: ${(err as Error).message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    setActionMessage("");

    try {
      const res = await fetch(`/api/admin/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: selectedReg.id,
          amount: paymentAmount,
          paymentPurpose,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement du paiement.");
      }

      setActionMessage(`Paiement enregistré ! Reçu N°: ${data.payment.receiptNumber}`);
      await fetchData();
    } catch (err) {
      setActionMessage(`Erreur: ${(err as Error).message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleCorrectionField = (field: string) => {
    if (correctionFields.includes(field)) {
      setCorrectionFields(correctionFields.filter((f) => f !== field));
    } else {
      setCorrectionFields([...correctionFields, field]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#00141f] text-[#f4f7f9]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Season Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#17425f] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#003D5B] border border-[#00798C] text-[#EDAE49] flex items-center justify-center font-display font-black text-2xl shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-[#EDAE49] uppercase tracking-widest">
                ADMINISTRATION // DIRECTION TECHNIQUE
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                {t.admin.title}
              </h1>
              <p className="font-body text-xs text-[#8faec5] mt-0.5">
                Gestion des dossiers d&apos;adhésion, vérification des pièces et encaissements au siège.
              </p>
            </div>
          </div>

          {/* Season Selector */}
          <div className="flex items-center gap-2.5 bg-[#072538] border border-[#17425f] px-4 py-2 rounded-xl">
            <Calendar className="w-4 h-4 text-[#EDAE49]" />
            <span className="font-mono text-xs font-bold uppercase text-[#8faec5]">Saison :</span>
            <select
              value={selectedSeasonCode}
              onChange={(e) => setSelectedSeasonCode(e.target.value)}
              className="bg-transparent font-display font-black text-sm text-white focus:outline-none cursor-pointer"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.code} className="bg-[#00141f] text-white">
                  {s.label} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* REAL METRICS DASHBOARD */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
            {/* 1. Total Dossiers (Baltic Blue) */}
            <div className="bg-[#072538] border border-[#17425f] rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8faec5] block">
                Total Dossiers
              </span>
              <div className="font-display text-3xl font-black text-white mt-1">{stats.total}</div>
            </div>

            {/* 2. À Examiner (Stormy Teal) */}
            <div className="bg-[#072538] border border-[#00798C] rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38b6cb] block">
                À Examiner
              </span>
              <div className="font-display text-3xl font-black text-[#38b6cb] mt-1">{stats.pendingReview}</div>
            </div>

            {/* 3. Corrections (Honey Bronze) */}
            <div className="bg-[#072538] border border-[#EDAE49]/60 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EDAE49] block">
                Corrections
              </span>
              <div className="font-display text-3xl font-black text-[#EDAE49] mt-1">{stats.needsCorrection}</div>
            </div>

            {/* 4. Acceptés (Stormy Teal) */}
            <div className="bg-[#072538] border border-[#00798C]/60 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ed5eb] block">
                Validés
              </span>
              <div className="font-display text-3xl font-black text-[#4ed5eb] mt-1">{stats.accepted}</div>
            </div>

            {/* 5. Attente Paiement (Honey Bronze) */}
            <div className="bg-[#072538] border border-[#EDAE49]/60 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffcf70] block">
                Paiement Att.
              </span>
              <div className="font-display text-3xl font-black text-[#ffcf70] mt-1">{stats.paymentPending}</div>
            </div>

            {/* 6. Actifs / Payés (Yale Blue with positive accent) */}
            <div className="bg-[#003D5B] border-2 border-[#EDAE49] rounded-2xl p-4 shadow-[0_0_12px_rgba(237,174,73,0.15)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EDAE49] block">
                Actifs (Payés)
              </span>
              <div className="font-display text-3xl font-black text-white mt-1">{stats.paid + stats.active}</div>
            </div>

            {/* 7. Doublons (Amaranth) */}
            <div className="bg-[#072538] border border-[#D1495B] rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f17887] block">
                Doublons
              </span>
              <div className="font-display text-3xl font-black text-[#f17887] mt-1">{stats.duplicates}</div>
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-[#072538] border border-[#17425f] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-[#8faec5] absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par référence, nom, téléphone, email..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#00141f] border border-[#17425f] rounded-xl font-mono text-xs text-white focus:border-[#EDAE49] outline-none"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#00141f] border border-[#17425f] rounded-xl text-white focus:border-[#EDAE49] outline-none"
            >
              <option value="">Tous les statuts</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="UNDER_REVIEW">En examen</option>
              <option value="NEEDS_CORRECTION">Correction requise</option>
              <option value="ACCEPTED">Validé</option>
              <option value="PAYMENT_PENDING">Paiement en attente</option>
              <option value="ACTIVE">Actif</option>
              <option value="REJECTED">Refusé</option>
              <option value="ARCHIVED">Archivé</option>
            </select>

            {/* Discipline Filter */}
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="px-3 py-2 bg-[#00141f] border border-[#17425f] rounded-xl text-white focus:border-[#EDAE49] outline-none"
            >
              <option value="">Toutes disciplines</option>
              <option value="parkour">Parkour</option>
              <option value="escalade-montagne">Escalade & Montagne</option>
              <option value="trail">Trail</option>
            </select>

            {/* Duplicates Toggle */}
            <button
              type="button"
              onClick={() => setDuplicatesOnly(!duplicatesOnly)}
              className={`px-3 py-2 rounded-xl font-bold uppercase transition-all ${
                duplicatesOnly
                  ? "bg-[#D1495B] text-white"
                  : "bg-[#00141f] border border-[#17425f] text-[#8faec5] hover:text-white"
              }`}
            >
              Doublons ({stats?.duplicates || 0})
            </button>
          </div>
        </div>

        {/* REGISTRATIONS DATA TABLE */}
        <div className="bg-[#072538] border border-[#17425f] rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5 border-b border-[#17425f] flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8faec5]">
              {registrations.length} dossier{registrations.length > 1 ? "s" : ""} affiché{registrations.length > 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={fetchData}
              className="p-1.5 rounded-lg bg-[#00141f] text-[#8faec5] hover:text-white border border-[#17425f]"
              title="Rafraîchir"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-[#EDAE49] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="font-mono text-xs text-[#8faec5]">{t.common.loading}</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Users className="w-8 h-8 text-[#8faec5] mx-auto" />
              <p className="font-body text-sm text-[#8faec5]">Aucun dossier trouvé pour ces critères.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#00141f] border-b border-[#17425f] font-mono text-[11px] font-bold uppercase text-[#8faec5]">
                  <tr>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Adhérent</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Disciplines</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Date dépôt</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#17425f]/50">
                  {registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      onClick={() => {
                        setSelectedReg(reg);
                        setActiveTab("OVERVIEW");
                        setActionMessage("");
                      }}
                      className="hover:bg-[#003D5B]/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#EDAE49]">
                        {reg.reference}
                        {reg.isMarkedDuplicate && (
                          <span className="ms-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[#D1495B]/30 text-[#f17887] border border-[#D1495B] font-mono">
                            Doublon
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-display font-bold text-sm text-white uppercase">
                          {reg.participant.lastName} {reg.participant.firstName}
                        </div>
                        <div className="font-mono text-[10px] text-[#8faec5]">
                          {reg.participant.isMinor ? "Mineur (<18)" : "Majeur"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8faec5]" dir="ltr">
                        {reg.participant.phone}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {reg.disciplines.map((d: any) => (
                            <span
                              key={d.discipline.slug}
                              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#00141f] text-[#38b6cb] border border-[#17425f]"
                            >
                              {d.discipline.nameFr}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={reg.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8faec5]">
                        {new Date(reg.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-[#00141f] hover:bg-[#003D5B] text-[#f4f7f9] rounded-lg font-mono text-xs font-semibold border border-[#17425f] hover:border-[#EDAE49]"
                        >
                          Examiner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PARTICIPANT DETAIL INSPECTOR MODAL */}
        {selectedReg && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#072538] border-2 border-[#17425f] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-[#17425f] flex items-start justify-between bg-[#00141f]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-[#EDAE49]">
                      {selectedReg.reference}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#003D5B] rounded text-white font-mono font-bold uppercase">
                      Saison {selectedReg.season?.code}
                    </span>
                    <StatusBadge status={selectedReg.status} size="sm" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-white uppercase mt-1">
                    {selectedReg.participant.lastName} {selectedReg.participant.firstName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/paperwork/${selectedReg.id}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Dossier PDF
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedReg(null)}
                    className="p-2 rounded-xl text-[#8faec5] hover:text-white hover:bg-[#072538]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Tabs Bar */}
              <div className="flex border-b border-[#17425f] bg-[#001a27] px-6 gap-6 font-mono text-xs font-bold uppercase">
                <button
                  type="button"
                  onClick={() => setActiveTab("OVERVIEW")}
                  className={`py-3.5 border-b-2 transition-all ${
                    activeTab === "OVERVIEW"
                      ? "border-[#EDAE49] text-[#EDAE49]"
                      : "border-transparent text-[#8faec5] hover:text-white"
                  }`}
                >
                  {t.admin.detail.overview}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("DOCUMENTS")}
                  className={`py-3.5 border-b-2 transition-all ${
                    activeTab === "DOCUMENTS"
                      ? "border-[#EDAE49] text-[#EDAE49]"
                      : "border-transparent text-[#8faec5] hover:text-white"
                  }`}
                >
                  {t.admin.detail.documents} ({selectedReg.documents?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ACTIONS")}
                  className={`py-3.5 border-b-2 transition-all ${
                    activeTab === "ACTIONS"
                      ? "border-[#EDAE49] text-[#EDAE49]"
                      : "border-transparent text-[#8faec5] hover:text-white"
                  }`}
                >
                  Décision Administrative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("PAYMENT")}
                  className={`py-3.5 border-b-2 transition-all ${
                    activeTab === "PAYMENT"
                      ? "border-[#EDAE49] text-[#EDAE49]"
                      : "border-transparent text-[#8faec5] hover:text-white"
                  }`}
                >
                  Règlement Espèces
                </button>
              </div>

              {/* Action Message feedback */}
              {actionMessage && (
                <div className="px-6 py-2.5 bg-[#003D5B] border-b border-[#17425f] font-mono text-xs font-semibold text-[#EDAE49]">
                  {actionMessage}
                </div>
              )}

              {/* Tab Contents */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed font-body">
                {/* TAB 1: OVERVIEW */}
                {activeTab === "OVERVIEW" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-[#00141f] border border-[#17425f] rounded-2xl">
                      <div>
                        <span className="font-mono text-[#8faec5] block">Téléphone portable :</span>
                        <span className="font-bold text-white font-mono" dir="ltr">
                          {selectedReg.participant.phone}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[#8faec5] block">Email :</span>
                        <span className="font-semibold text-white font-mono">
                          {selectedReg.participant.email || "Non renseigné"}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[#8faec5] block">WhatsApp :</span>
                        <span className="font-semibold text-white font-mono" dir="ltr">
                          {selectedReg.participant.whatsapp || "Non renseigné"}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[#8faec5] block">Date de naissance :</span>
                        <span className="font-bold text-white font-mono">
                          {new Date(selectedReg.participant.dateOfBirth).toLocaleDateString()} (
                          {selectedReg.participant.isMinor ? "Mineur" : "Majeur"})
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[#8faec5] block">Lieu de naissance :</span>
                        <span className="font-semibold text-white">
                          {selectedReg.participant.placeOfBirth}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[#8faec5] block">Groupe sanguin :</span>
                        <span className="font-bold text-[#EDAE49] font-mono">
                          {selectedReg.participant.bloodType || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-mono text-[#8faec5] block">Adresse de résidence :</span>
                        <span className="font-semibold text-white">
                          {selectedReg.participant.address || "Non renseignée"}
                        </span>
                      </div>
                    </div>

                    {/* Disciplines */}
                    <div className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl space-y-2">
                      <span className="font-mono font-bold uppercase text-[#8faec5] block">
                        Disciplines sélectionnées
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedReg.disciplines?.map((d: any) => (
                          <span
                            key={d.discipline.slug}
                            className="px-3 py-1 bg-[#003D5B] border border-[#00798C] text-[#EDAE49] font-display font-bold text-xs uppercase rounded-lg"
                          >
                            ✓ {d.discipline.nameFr} ({d.discipline.nameAr})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Minor Guardian Info */}
                    {selectedReg.participant.isMinor && (
                      <div className="p-5 bg-[#003D5B]/30 border border-[#EDAE49]/50 rounded-2xl space-y-2">
                        <span className="font-mono font-bold uppercase text-[#EDAE49] block">
                          Informations Tuteur Légal (Mineur)
                        </span>
                        <div>
                          Tuteur déclaré :{" "}
                          <span className="font-bold text-white">
                            {selectedReg.parentalAuthorization?.guardianName || "Non renseigné"}
                          </span>
                        </div>
                        <div className="font-mono text-[#8faec5]">
                          Consentement numérique enregistré le{" "}
                          {selectedReg.parentalAuthorization?.acceptedAt
                            ? new Date(selectedReg.parentalAuthorization.acceptedAt).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DOCUMENTS */}
                {activeTab === "DOCUMENTS" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedReg.documents?.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl space-y-3 flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-[10px] font-bold uppercase text-[#EDAE49] tracking-wider block">
                              {doc.type}
                            </span>
                            <div className="font-bold text-white text-xs mt-1 truncate">
                              {doc.originalFilename}
                            </div>
                            <div className="text-[10px] text-[#8faec5] font-mono mt-0.5">
                              {(doc.fileSize / 1024).toFixed(0)} Ko • {doc.mimeType}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                              doc.status === "VALID"
                                ? "bg-[#00798C]/30 text-[#38b6cb] border border-[#00798C]"
                                : doc.status === "INVALID"
                                ? "bg-[#D1495B]/30 text-[#f17887] border border-[#D1495B]"
                                : "bg-[#072538] text-[#8faec5]"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        <a
                          href={`/api/documents/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#072538] hover:bg-[#003D5B] text-white rounded-xl font-mono text-xs font-semibold border border-[#17425f] hover:border-[#EDAE49] transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#EDAE49]" />
                          Consulter la pièce (Stockage Privé Sécurisé)
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: ACTIONS */}
                {activeTab === "ACTIONS" && (
                  <div className="space-y-6">
                    {/* Accept Action */}
                    <div className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-sm text-white uppercase">Valider le dossier</div>
                        <div className="text-[#8faec5] text-xs">
                          Passe le statut à « Paiement en attente » pour perception de la cotisation.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdminAction("ACCEPT")}
                        disabled={actionLoading}
                        className="px-5 py-2.5 bg-[#00798C] hover:bg-[#0092a8] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
                      >
                        Accepter
                      </button>
                    </div>

                    {/* Correction Request Box */}
                    <div className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl space-y-3">
                      <div className="font-display font-bold text-sm text-white uppercase">
                        Demander une correction au pratiquant
                      </div>
                      <p className="text-[#8faec5] text-xs">
                        L&apos;adhérent verra une alerte dans son espace pour remplacer les pièces non conformes.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                        {["PHOTO", "NATIONAL_ID", "MEDICAL_CERTIFICATE", "PARENT_NATIONAL_ID"].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => toggleCorrectionField(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              correctionFields.includes(f)
                                ? "bg-[#EDAE49] text-[#003D5B] border-[#EDAE49] font-bold"
                                : "bg-[#072538] text-[#8faec5] border-[#17425f] hover:border-[#30638E]"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={correctionReason}
                        onChange={(e) => setCorrectionReason(e.target.value)}
                        placeholder="Ex: Le certificat médical est illisible, merci de téléverser un document plus net."
                        rows={3}
                        className="w-full p-3 bg-[#072538] border border-[#17425f] rounded-xl text-white text-xs focus:border-[#EDAE49] outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleAdminAction("REQUEST_CORRECTION", {
                            reason: correctionReason,
                            fields: correctionFields,
                          })
                        }
                        disabled={actionLoading || !correctionReason}
                        className="px-5 py-2.5 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50"
                      >
                        Envoyer la demande de correction
                      </button>
                    </div>

                    {/* Reject Action */}
                    <div className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl space-y-3">
                      <div className="font-display font-bold text-sm text-white uppercase">Refuser l&apos;adhésion</div>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Motif officiel de refus..."
                        className="w-full p-3 bg-[#072538] border border-[#17425f] rounded-xl text-white text-xs focus:border-[#D1495B] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdminAction("REJECT", { reason: rejectionReason })}
                        disabled={actionLoading || !rejectionReason}
                        className="px-5 py-2.5 bg-[#D1495B] hover:bg-[#b83e4f] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl disabled:opacity-50"
                      >
                        Refuser le dossier
                      </button>
                    </div>

                    {/* Duplicate Status Management */}
                    <div className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-sm text-white uppercase">Gestion Doublon</div>
                        <div className="text-[#8faec5] text-xs">
                          {selectedReg.isMarkedDuplicate
                            ? "Actuellement classé comme doublon."
                            : "Dossier légitime indépendant."}
                        </div>
                      </div>
                      {selectedReg.isMarkedDuplicate ? (
                        <button
                          type="button"
                          onClick={() => handleAdminAction("MARK_LEGITIMATE")}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-[#072538] hover:bg-[#003D5B] text-white rounded-xl font-mono text-xs font-bold border border-[#17425f]"
                        >
                          Marquer Légitime
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAdminAction("MARK_DUPLICATE")}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-[#D1495B] hover:bg-[#b83e4f] text-white rounded-xl font-mono text-xs font-bold"
                        >
                          Signaler Doublon
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: CASH PAYMENT RECORDING */}
                {activeTab === "PAYMENT" && (
                  <div className="space-y-6">
                    <div className="p-6 bg-[#00141f] border border-[#17425f] rounded-2xl space-y-4">
                      <div className="font-display font-bold text-base text-white uppercase flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#EDAE49]" />
                        <span>Enregistrement de la cotisation au club (Espèces)</span>
                      </div>
                      <p className="font-body text-[#8faec5] text-xs leading-relaxed">
                        Le participant règle sa cotisation physiquement au siège du club. L&apos;enregistrement génère un numéro de reçu unique séquentiel (ex: ADD-PAY-2026-000001) pour impression et apposition manuelle du cachet officiel.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#8faec5] font-mono text-xs font-bold uppercase mb-1">
                            Montant en Dinars Algériens (DZD) *
                          </label>
                          <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="4000"
                            className="w-full p-3 bg-[#072538] border border-[#17425f] rounded-xl text-white text-sm font-bold font-mono focus:border-[#EDAE49] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#8faec5] font-mono text-xs font-bold uppercase mb-1">
                            Objet du paiement *
                          </label>
                          <input
                            type="text"
                            value={paymentPurpose}
                            onChange={(e) => setPaymentPurpose(e.target.value)}
                            placeholder="Cotisation annuelle, assurance & 1er mois"
                            className="w-full p-3 bg-[#072538] border border-[#17425f] rounded-xl text-white text-xs focus:border-[#EDAE49] outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRecordPayment}
                        disabled={actionLoading}
                        className="px-6 py-3.5 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50"
                      >
                        Enregistrer le paiement & Activer le membre
                      </button>
                    </div>

                    {/* Historical Payments */}
                    {selectedReg.payments && selectedReg.payments.length > 0 && (
                      <div className="p-5 bg-[#00141f] border border-[#17425f] rounded-2xl space-y-3">
                        <span className="font-mono font-bold uppercase text-[#8faec5] block text-xs">
                          Reçus émis pour ce dossier
                        </span>
                        <div className="space-y-2">
                          {selectedReg.payments.map((p: any) => (
                            <div
                              key={p.id}
                              className="p-4 bg-[#072538] rounded-xl border border-[#17425f] flex items-center justify-between"
                            >
                              <div>
                                <span className="font-mono font-bold text-[#EDAE49] block text-sm">
                                  {p.receiptNumber}
                                </span>
                                <span className="text-[#8faec5] font-mono text-[11px]">
                                  {p.paymentPurpose} • {new Date(p.paidAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[#38b6cb] font-display font-black text-lg block">
                                  {p.amount.toLocaleString()} DZD
                                </span>
                                <span className="text-[10px] text-[#8faec5] font-mono font-semibold uppercase">
                                  Mode: Espèces
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
