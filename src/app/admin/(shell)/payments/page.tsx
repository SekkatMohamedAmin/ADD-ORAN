"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  DollarSign as FiDollarSign,
  Search as FiSearch,
  Filter as FiFilter,
  Printer as FiPrinter,
  ChevronLeft as FiChevronLeft,
  ChevronRight as FiChevronRight,
  Calendar as FiCalendar,
  User as FiUser,
  FileText as FiFileText,
  CheckCircle2 as FiCheckCircle,
  Edit2 as FiEdit2,
  Trash2 as FiTrash2,
  AlertTriangle as FiAlertTriangle,
  X as FiX,
} from "lucide-react";
import { getStoredAdminSeason, setStoredAdminSeason } from "@/lib/adminSeason";

interface PaymentItem {
  id: string;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  paymentPurpose: string;
  status: string;
  notes?: string | null;
  paidAt?: string | null;
  createdAt: string;
  season: {
    id: string;
    code: string;
    label: string;
  };
  recordedBy?: {
    phone: string;
    role: string;
  } | null;
  registration: {
    id: string;
    reference: string;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
}

export default function PaymentsPage() {
  const { t, locale, isRtl } = useLanguage();

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [seasons, setSeasons] = useState<Array<{ id: string; code: string; label: string }>>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(() => getStoredAdminSeason() || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentItem | null>(null);

  // Edit Payment State
  const [paymentToEdit, setPaymentToEdit] = useState<PaymentItem | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    paymentPurpose: "",
    notes: "",
    paidAt: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Payment State
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenEdit = (pay: PaymentItem) => {
    setPaymentToEdit(pay);
    const rawDate = pay.paidAt || pay.createdAt;
    const dateStr = rawDate
      ? new Date(rawDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setEditForm({
      amount: pay.amount.toString(),
      paymentPurpose: pay.paymentPurpose || "",
      notes: pay.notes || "",
      paidAt: dateStr,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentToEdit) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(editForm.amount),
          paymentPurpose: editForm.paymentPurpose,
          notes: editForm.notes,
          paidAt: editForm.paidAt ? new Date(editForm.paidAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la modification.");
      setPaymentToEdit(null);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la modification.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression.");
      setPaymentToDelete(null);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });

      if (search.trim()) params.append("search", search.trim());
      if (selectedSeason) params.append("season", selectedSeason);

      const res = await fetch(`/api/admin/payments?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erreur de chargement des versements.");

      const data = await res.json();
      setPayments(data.payments || []);
      setTotalRevenue(data.totalRevenue || 0);
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

  useEffect(() => {
    fetchPayments();
  }, [page, selectedSeason]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiDollarSign className="w-6 h-6 text-[#FFD21F]" />
            Caisse & Règlements en Espèces
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Gestion des encaissements physiques, numérotation séquentielle des quittances et reçus de caisse.
          </p>
        </div>

        {/* Total Collected Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-[#141419] border border-white/5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              DA
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Recettes Totales
              </span>
              <strong className="text-base font-extrabold text-[#FFD21F] font-mono">
                {totalRevenue.toLocaleString()} DZD
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar with Red Energy Accent */}
      <div className="relative p-4 sm:p-5 bg-[#141419]/85 backdrop-blur-md border border-white/10 rounded-2xl space-y-3 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#E52421] before:to-transparent shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E52421]/[0.08] rounded-full blur-2xl pointer-events-none" />
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="relative flex-1 min-w-[260px]">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° de reçu, participant, référence inscription..."
              className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421] font-mono"
            />
          </div>

          <select
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(e.target.value);
              setStoredAdminSeason(e.target.value);
              setPage(1);
            }}
            className="bg-[#1C1C24] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E52421] font-mono"
          >
            <option value="ALL">Toutes les saisons</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.code}>
                {s.label || `Saison ${s.code}`}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#E52421]/20 font-display"
          >
            Filtrer
          </button>

          {(search || (selectedSeason && selectedSeason !== "ALL")) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedSeason("ALL");
                setStoredAdminSeason("ALL");
                setPage(1);
              }}
              className="px-3 py-2.5 bg-[#1C1C24] hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-xl transition font-mono"
            >
              Effacer
            </button>
          )}
        </form>
      </div>

      {/* Payments Table with Red Energy Accents */}
      <div className="relative overflow-x-auto bg-[#141419]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl before:absolute before:top-0 before:left-0 before:w-48 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1C1C24]/90 text-xs uppercase tracking-wider text-[#9E9EA8] font-mono border-b border-white/10">
            <tr>
              <th className="py-3.5 px-6">N° Reçu</th>
              <th className="py-3.5 px-6">Participant</th>
              <th className="py-3.5 px-6">Réf. Inscription</th>
              <th className="py-3.5 px-6">Saison</th>
              <th className="py-3.5 px-6">Motif</th>
              <th className="py-3.5 px-6">Montant perçu</th>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Encaissé par</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={9} className="py-4 px-6">
                    <div className="h-6 bg-white/5 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : payments.length > 0 ? (
              payments.map((pay) => {
                const part = pay.registration?.participant;
                return (
                  <tr key={pay.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6 font-mono font-bold text-[#FFD21F]">
                      {pay.receiptNumber}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">
                        {part?.firstName} {part?.lastName}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">{part?.phone}</div>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs">
                      <Link
                        href={`/admin/registrations/${pay.registration?.id}`}
                        className="text-gray-300 hover:text-white underline decoration-white/20"
                      >
                        {pay.registration?.reference}
                      </Link>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-300">
                      {pay.season?.code}
                    </td>

                    <td className="py-4 px-6 text-xs font-medium text-gray-200">
                      {pay.paymentPurpose}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-white text-base">
                        {pay.amount.toLocaleString()} DZD
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-semibold uppercase">
                        ESPÈCES
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-400">
                      {new Date(pay.paidAt || pay.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {pay.recordedBy?.phone || "Admin"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          title="Imprimer le reçu"
                          className="px-2.5 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 hover:text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition border border-white/5"
                        >
                          <FiPrinter className="w-3.5 h-3.5 text-[#FFD21F]" />
                          <span className="hidden sm:inline">Reçu</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(pay)}
                          title="Modifier le montant ou motif"
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPaymentToDelete(pay)}
                          title="Supprimer ce paiement"
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition"
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
                <td colSpan={9} className="py-12 text-center text-gray-500">
                  <FiDollarSign className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                  <p className="font-semibold text-white">Aucun versement enregistré</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Les versements en espèces apparaîtront ici dès leur encaissement.
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
            <strong className="text-white">{totalPages}</strong> ({totalCount} règlements)
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

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-[#141419] border border-white/10 rounded-2xl max-w-2xl w-full p-8 space-y-6 text-white print:bg-white print:text-black print:border-none print:w-full print:max-w-none">
            {/* Screen Controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FiPrinter className="w-5 h-5 text-[#FFD21F]" /> Reçu officiel de versement
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                >
                  <FiPrinter className="w-4 h-4" /> Imprimer
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* PRINTABLE TEMPLATE */}
            <div className="border border-white/20 p-6 rounded-xl space-y-6 print:border-black print:p-6 print:space-y-4">
              <div className="flex justify-between items-start border-b border-white/10 pb-4 print:border-black">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white print:text-black">
                    CLUB ART DU DÉPLACEMENT PARKOUR ORAN
                  </h1>
                  <p className="text-xs text-gray-400 print:text-gray-600">
                    Association Sportive Agréée • Oran, Algérie
                  </p>
                  <p className="text-xs text-gray-400 print:text-gray-600">
                    Email : contact@addoran.dz • Tél : +213 555 000 000
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[#E52421] text-white font-mono font-bold text-sm rounded print:border print:border-black">
                    REÇU DE CAISSE
                  </span>
                  <p className="text-xs font-mono font-bold text-[#FFD21F] print:text-black mt-1">
                    N° {selectedReceipt.receiptNumber}
                  </p>
                  <p className="text-[11px] text-gray-400 print:text-gray-600">
                    Date : {new Date(selectedReceipt.paidAt || selectedReceipt.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              {/* Dossier & Adhérent info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 print:text-gray-600 block">Adhérent(e) :</span>
                  <strong className="text-sm text-white print:text-black font-bold">
                    {selectedReceipt.registration?.participant?.firstName} {selectedReceipt.registration?.participant?.lastName}
                  </strong>
                  <p className="text-gray-400 print:text-gray-600 mt-0.5">
                    Tél : {selectedReceipt.registration?.participant?.phone}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 print:text-gray-600 block">Réf. Inscription & Saison :</span>
                  <strong className="text-sm font-mono text-white print:text-black font-bold">
                    {selectedReceipt.registration?.reference}
                  </strong>
                  <p className="text-gray-400 print:text-gray-600 mt-0.5">
                    Saison {selectedReceipt.season?.label || selectedReceipt.season?.code}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-white/10 print:border-black rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5 print:bg-gray-100 border-b border-white/10 print:border-black">
                    <tr>
                      <th className="p-2.5">Désignation</th>
                      <th className="p-2.5">Mode</th>
                      <th className="p-2.5 text-right">Montant perçu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 font-medium">{selectedReceipt.paymentPurpose}</td>
                      <td className="p-2.5 font-mono">ESPÈCES (CASH)</td>
                      <td className="p-2.5 text-right font-mono font-bold text-sm">
                        {selectedReceipt.amount.toLocaleString()} DZD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Physical Stamp & Signature Box */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="text-[11px] text-gray-400 print:text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-300 print:text-black">Mention légale :</p>
                  <p>
                    Reçu délivré contre versement d'espèces. Tout règlement est définitif conformément aux statuts du club.
                  </p>
                  <p className="font-mono text-[10px]">
                    Encaissé par l'administration du club (Agent : {selectedReceipt.recordedBy?.phone || "Admin"})
                  </p>
                </div>

                <div className="border-2 border-dashed border-white/20 print:border-black h-28 rounded-lg flex flex-col justify-between p-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 print:text-gray-600">
                    Cadre réservé au cachet & signature du club
                  </span>
                  <div className="text-[9px] text-gray-500 italic print:text-gray-500">
                    (Cachet officiel physique obligatoire)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Payment Modal */}
      {paymentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141419] border border-blue-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FiEdit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    Modifier le paiement
                  </h3>
                  <p className="font-mono text-xs text-blue-400">
                    Reçu N° {paymentToEdit.receiptNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentToEdit(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Target info preview */}
            <div className="bg-[#1C1C24] p-3.5 rounded-xl border border-white/5 space-y-1 text-xs">
              <div className="text-gray-400">
                Adhérent :{" "}
                <strong className="text-white">
                  {paymentToEdit.registration?.participant?.firstName}{" "}
                  {paymentToEdit.registration?.participant?.lastName}
                </strong>
                {paymentToEdit.registration?.participant?.phone && (
                  <span className="font-mono text-gray-400 ml-2">
                    ({paymentToEdit.registration.participant.phone})
                  </span>
                )}
              </div>
              <div className="text-gray-400">
                Dossier :{" "}
                <span className="font-mono text-[#FFD21F]">
                  {paymentToEdit.registration?.reference}
                </span>{" "}
                • Saison : <span className="text-gray-300">{paymentToEdit.season?.code}</span>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                  Montant perçu (DZD) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  placeholder="Ex : 4500"
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                  Motif du versement *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.paymentPurpose}
                  onChange={(e) => setEditForm({ ...editForm, paymentPurpose: e.target.value })}
                  placeholder="Ex : Cotisation annuelle, assurance & 1er mois"
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                  Date du versement *
                </label>
                <input
                  type="date"
                  required
                  value={editForm.paidAt}
                  onChange={(e) => setEditForm({ ...editForm, paidAt: e.target.value })}
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                  Notes / Observations (Facultatif)
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Remarques éventuelles sur la correction ou le mode..."
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPaymentToEdit(null)}
                  disabled={editLoading}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                  <span>{editLoading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Payment Modal */}
      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141419] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Supprimer ce versement ?
              </h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Êtes-vous certain de vouloir supprimer le reçu{" "}
                <strong className="text-[#FFD21F] font-mono">
                  {paymentToDelete.receiptNumber}
                </strong>{" "}
                d&apos;un montant de{" "}
                <strong className="text-white font-mono font-bold">
                  {paymentToDelete.amount.toLocaleString()} DZD
                </strong>{" "}
                encaissé pour{" "}
                <strong className="text-white">
                  {paymentToDelete.registration?.participant?.firstName}{" "}
                  {paymentToDelete.registration?.participant?.lastName}
                </strong>{" "}
                ?
              </p>
              <p className="text-xs text-amber-300/90 font-mono mt-3 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed">
                ℹ️ Si cette inscription ne compte aucun autre règlement, son statut sera automatiquement réinitialisé à &quot;En attente de paiement&quot;.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPaymentToDelete(null)}
                disabled={deleteLoading}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeletePayment}
                disabled={deleteLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>{deleteLoading ? "Suppression..." : "Confirmer la suppression"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
