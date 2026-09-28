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
} from "lucide-react";

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
  const [selectedSeason, setSelectedSeason] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentItem | null>(null);

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

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement des versements.");

      const data = await res.json();
      setPayments(data.payments || []);
      setTotalRevenue(data.totalRevenue || 0);
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

      {/* Filters Toolbar */}
      <div className="p-4 bg-[#141419] border border-white/5 rounded-2xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° de reçu, participant, référence inscription..."
              className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421]"
            />
          </div>

          <select
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(e.target.value);
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

          {(search || selectedSeason) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedSeason("");
                setPage(1);
              }}
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-xl transition"
            >
              Effacer
            </button>
          )}
        </form>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto bg-[#141419] border border-white/5 rounded-2xl shadow-sm">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#0A0A0D] text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">N° Reçu</th>
              <th className="py-3.5 px-6">Participant</th>
              <th className="py-3.5 px-6">Réf. Inscription</th>
              <th className="py-3.5 px-6">Saison</th>
              <th className="py-3.5 px-6">Motif</th>
              <th className="py-3.5 px-6">Montant perçu</th>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Encaissé par</th>
              <th className="py-3.5 px-6 text-right">Reçu</th>
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
                      <button
                        onClick={() => setSelectedReceipt(pay)}
                        className="px-3 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 hover:text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition border border-white/5"
                      >
                        <FiPrinter className="w-3.5 h-3.5 text-[#FFD21F]" /> Reçu
                      </button>
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
    </div>
  );
}
