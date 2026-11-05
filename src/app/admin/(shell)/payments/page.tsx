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
  Plus as FiPlus,
  Coins as FiCoins,
  Clock as FiClock,
  Sparkles as FiSparkles,
  ExternalLink as FiExternalLink,
  ShieldCheck as FiShieldCheck,
  Users as FiUsers,
  Check as FiCheck,
  AlertCircle as FiAlertCircle,
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

interface CalendarMonthSchedule {
  id: string;
  label: string;
  labelShort: string;
  year: number;
  month: number;
  monthlyAmountDzd: number;
  isPaid: boolean;
  isLate: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  receiptNumber?: string | null;
  paidAt?: string | null;
}

interface CalendarAdherentItem {
  registrationId: string;
  reference: string;
  status: string;
  type?: string;
  participantId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  isMinor: boolean;
  isStaff: boolean;
  clubRole?: string | null;
  disciplines: string[];
  annualTotalDzd: number;
  monthlyTotalDzd: number;
  totalPaidDzd: number;
  paymentsCount: number;
  schedule: CalendarMonthSchedule[];
  userState: "UP_TO_DATE" | "OVERDUE" | "PENDING_INITIAL" | "EXEMPT_STAFF";
  overdueMonths: string[];
}

export default function PaymentsPage() {
  const { t, locale, isRtl } = useLanguage();

  // Mode: "CALENDAR" (Matrice mensuelle par adhérent) | "RECEIPTS" (Journal des quittances)
  const [viewMode, setViewMode] = useState<"CALENDAR" | "RECEIPTS">("CALENDAR");

  // Receipts State
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [seasons, setSeasons] = useState<Array<{ id: string; code: string; label: string }>>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination for Receipts
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(() => getStoredAdminSeason() || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Calendar State
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarMonths, setCalendarMonths] = useState<any[]>([]);
  const [calendarAdherents, setCalendarAdherents] = useState<CalendarAdherentItem[]>([]);
  const [calendarStats, setCalendarStats] = useState({
    totalMembers: 0,
    upToDateCount: 0,
    overdueCount: 0,
    pendingCount: 0,
    exemptStaffCount: 0,
    totalCollectedDzd: 0,
    expectedMonthlyRevenueDzd: 0,
  });
  const [calendarStateFilter, setCalendarStateFilter] = useState<string>("ALL"); // ALL | OVERDUE | UP_TO_DATE | PENDING | EXEMPT
  const [calendarSearch, setCalendarSearch] = useState("");

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

  // Encaissement Modal State (Monthly & General)
  const [showEncaisseModal, setShowEncaisseModal] = useState(false);
  const [encaisseAdherentSearch, setEncaisseAdherentSearch] = useState("");
  const [selectedAdherentForEncaisse, setSelectedAdherentForEncaisse] = useState<CalendarAdherentItem | null>(null);
  const [encaisseForm, setEncaisseForm] = useState({
    amount: "1500",
    paymentPurpose: "Mensualité en cours",
    paidAt: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [encaisseSubmitting, setEncaisseSubmitting] = useState(false);
  const [encaisseSuccessReceipt, setEncaisseSuccessReceipt] = useState<any | null>(null);

  // Fetch Calendar Data
  const fetchCalendarData = async () => {
    try {
      setCalendarLoading(true);
      const params = new URLSearchParams();
      if (selectedSeason && selectedSeason !== "ALL") params.append("season", selectedSeason);
      if (calendarSearch.trim()) params.append("search", calendarSearch.trim());
      if (calendarStateFilter !== "ALL") params.append("state", calendarStateFilter);

      const res = await fetch(`/api/admin/payments/calendar?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erreur de chargement du calendrier.");

      const data = await res.json();
      if (data.success) {
        setCalendarMonths(data.months || []);
        setCalendarAdherents(data.adherents || []);
        if (data.stats) setCalendarStats(data.stats);
        if (data.seasons) setSeasons(data.seasons);
        if (!selectedSeason && data.currentSeasonCode) {
          setSelectedSeason(data.currentSeasonCode);
          setStoredAdminSeason(data.currentSeasonCode);
        }
      }
    } catch (err: any) {
      console.error("Calendar fetch error:", err);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Fetch Receipts List
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });

      if (search.trim()) params.append("search", search.trim());
      if (selectedSeason && selectedSeason !== "ALL") params.append("season", selectedSeason);

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
    fetchCalendarData();
  }, [selectedSeason]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCalendarData();
    }, 300);
    return () => clearTimeout(timer);
  }, [calendarSearch, calendarStateFilter]);

  // Open Encaissement Modal
  const handleOpenEncaissement = (adherent?: CalendarAdherentItem, defaultMonth?: CalendarMonthSchedule) => {
    setEncaisseSuccessReceipt(null);
    if (adherent) {
      setSelectedAdherentForEncaisse(adherent);
      setEncaisseAdherentSearch(adherent.fullName);
      const defaultAmount = adherent.monthlyTotalDzd > 0 ? adherent.monthlyTotalDzd : (adherent.annualTotalDzd || 1500);
      const purpose = defaultMonth
        ? `Mensualité ${defaultMonth.label}`
        : adherent.totalPaidDzd === 0
        ? "Cotisation annuelle & assurance + 1er mois"
        : `Mensualité de cours`;
      setEncaisseForm({
        amount: defaultAmount.toString(),
        paymentPurpose: purpose,
        paidAt: new Date().toISOString().split("T")[0],
        notes: "",
      });
    } else {
      setSelectedAdherentForEncaisse(null);
      setEncaisseAdherentSearch("");
      setEncaisseForm({
        amount: "1500",
        paymentPurpose: "Cotisation annuelle, assurance & 1er mois",
        paidAt: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
    setShowEncaisseModal(true);
  };

  // Submit Encaissement
  const handleSaveEncaissement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdherentForEncaisse) {
      alert("Veuillez sélectionner un adhérent.");
      return;
    }
    const amountNum = parseFloat(encaisseForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }

    setEncaisseSubmitting(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: selectedAdherentForEncaisse.registrationId,
          amount: amountNum,
          paymentPurpose: encaisseForm.paymentPurpose,
          notes: encaisseForm.notes || undefined,
          paidAt: encaisseForm.paidAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement.");

      setEncaisseSuccessReceipt(data.payment);
      // Refresh views
      fetchCalendarData();
      fetchPayments();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'enregistrement de l'encaissement.");
    } finally {
      setEncaisseSubmitting(false);
    }
  };

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
      fetchCalendarData();
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
      fetchCalendarData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Autocomplete candidates for encaissement modal
  const filteredCandidates = calendarAdherents.filter((a) => {
    if (!encaisseAdherentSearch.trim()) return true;
    const q = encaisseAdherentSearch.toLowerCase();
    return (
      a.fullName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.reference.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiDollarSign className="w-6 h-6 text-[#FFD21F]" />
            Caisse & Calendrier des Cotisations
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Supervision mensuelle des règlements, calendrier des échéances, encaissement physique et reçus officiels.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenEncaissement()}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            <span>Encaisser un paiement</span>
          </button>

          <div className="px-4 py-2 bg-[#141419] border border-white/5 rounded-2xl flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Recettes :
            </span>
            <strong className="text-sm font-extrabold text-[#FFD21F] font-mono">
              {(calendarStats.totalCollectedDzd || totalRevenue).toLocaleString()} DZD
            </strong>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          type="button"
          onClick={() => setViewMode("CALENDAR")}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 ${
            viewMode === "CALENDAR"
              ? "bg-[#1C1C24] text-white border-[#E52421] shadow-lg"
              : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
          }`}
        >
          <FiCalendar className="w-4 h-4 text-[#FFD21F]" />
          <span>Calendrier des Paiements (Matrice Adhérents)</span>
          <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono">
            {calendarStats.totalMembers}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("RECEIPTS")}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 ${
            viewMode === "RECEIPTS"
              ? "bg-[#1C1C24] text-white border-[#E52421] shadow-lg"
              : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
          }`}
        >
          <FiFileText className="w-4 h-4 text-emerald-400" />
          <span>Journal des Quittances & Reçus</span>
          <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono">
            {totalCount}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CALENDAR VIEW (MONTHLY TRACKING & USER STATES)                         */}
      {/* ========================================================================= */}
      {viewMode === "CALENDAR" && (
        <div className="space-y-6">
          {/* Calendar Stats Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-[#141419] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Total Inscrits</span>
              <span className="text-xl font-black text-white font-display block">
                {calendarStats.totalMembers}
              </span>
              <span className="text-[10px] text-gray-500">Adhérents & Dirigeants</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-300 block">À jour</span>
              <span className="text-xl font-black text-emerald-400 font-display block">
                {calendarStats.upToDateCount}
              </span>
              <span className="text-[10px] text-emerald-300/80">
                {calendarStats.totalMembers > 0
                  ? `${Math.round((calendarStats.upToDateCount / calendarStats.totalMembers) * 100)}% de conformité`
                  : "0%"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
              <span className="text-[10px] font-mono uppercase text-red-300 block">En retard</span>
              <span className="text-xl font-black text-red-400 font-display block">
                {calendarStats.overdueCount}
              </span>
              <span className="text-[10px] text-red-300/80">Mensualités impayées</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-300 block">1er versement en attente</span>
              <span className="text-xl font-black text-amber-400 font-display block">
                {calendarStats.pendingCount}
              </span>
              <span className="text-[10px] text-amber-300/80">Non encore encaissé</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Membres Staff</span>
              <span className="text-xl font-black text-[#FFD21F] font-display block">
                {calendarStats.exemptStaffCount}
              </span>
              <span className="text-[10px] text-gray-500">Exonérés de cotisation</span>
            </div>
          </div>

          {/* Calendar Filter Toolbar */}
          <div className="p-4 bg-[#141419]/90 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-3 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  value={calendarSearch}
                  onChange={(e) => setCalendarSearch(e.target.value)}
                  placeholder="Rechercher par nom, téléphone, référence..."
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E52421] font-mono"
                />
              </div>

              <select
                value={selectedSeason}
                onChange={(e) => {
                  setSelectedSeason(e.target.value);
                  setStoredAdminSeason(e.target.value);
                }}
                className="bg-[#1C1C24] border border-white/10 text-xs text-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#E52421] font-mono"
              >
                <option value="ALL">Toutes les saisons</option>
                {seasons.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.label || `Saison ${s.code}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick State Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setCalendarStateFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  calendarStateFilter === "ALL"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-[#1C1C24] text-gray-400 hover:text-white"
                }`}
              >
                Tous ({calendarStats.totalMembers})
              </button>

              <button
                type="button"
                onClick={() => setCalendarStateFilter("OVERDUE")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  calendarStateFilter === "OVERDUE"
                    ? "bg-red-500 text-white font-bold"
                    : "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                }`}
              >
                <FiAlertTriangle className="w-3.5 h-3.5" />
                <span>En retard ({calendarStats.overdueCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setCalendarStateFilter("UP_TO_DATE")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  calendarStateFilter === "UP_TO_DATE"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                <FiCheck className="w-3.5 h-3.5" />
                <span>À jour ({calendarStats.upToDateCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setCalendarStateFilter("PENDING")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  calendarStateFilter === "PENDING"
                    ? "bg-amber-500 text-black font-bold"
                    : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                }`}
              >
                En attente ({calendarStats.pendingCount})
              </button>

              <button
                type="button"
                onClick={() => setCalendarStateFilter("EXEMPT")}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  calendarStateFilter === "EXEMPT"
                    ? "bg-[#FFD21F] text-black font-bold"
                    : "bg-[#FFD21F]/10 text-[#FFD21F] hover:bg-[#FFD21F]/20"
                }`}
              >
                Staff ({calendarStats.exemptStaffCount})
              </button>
            </div>
          </div>

          {/* Adherent Payment Calendar Matrix Table */}
          <div className="relative overflow-x-auto bg-[#141419]/90 border border-white/10 rounded-2xl shadow-2xl">
            <table className="w-full text-left text-xs text-gray-300 border-collapse">
              <thead className="bg-[#1C1C24] text-[11px] uppercase tracking-wider text-[#9E9EA8] font-mono border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 sticky left-0 bg-[#1C1C24] z-20 min-w-[200px]">Adhérent</th>
                  <th className="py-3 px-3 min-w-[110px]">État Financier</th>
                  <th className="py-3 px-3 text-right min-w-[90px]">Total Réglé</th>
                  {calendarMonths.map((m) => (
                    <th key={m.id} className="py-3 px-2 text-center min-w-[75px]">
                      {m.labelFr ? m.labelFr.split(" ")[0].slice(0, 4) : m.id}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right sticky right-0 bg-[#1C1C24] z-20 min-w-[110px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {calendarLoading ? (
                  <tr>
                    <td colSpan={3 + calendarMonths.length + 1} className="py-12 text-center text-gray-400 font-mono">
                      <div className="w-6 h-6 border-2 border-[#E52421] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Calcul et synchronisation de la matrice des paiements...
                    </td>
                  </tr>
                ) : calendarAdherents.length === 0 ? (
                  <tr>
                    <td colSpan={3 + calendarMonths.length + 1} className="py-12 text-center text-gray-400 font-mono">
                      Aucun adhérent ne correspond aux critères de filtre.
                    </td>
                  </tr>
                ) : (
                  calendarAdherents.map((item) => (
                    <tr key={item.registrationId} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Adherent Info (Sticky Col) */}
                      <td className="py-3 px-4 sticky left-0 bg-[#141419] group-hover:bg-[#181820] z-10">
                        <div className="font-display font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                          <span>{item.fullName}</span>
                          {item.isStaff && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold uppercase">
                              ★ {item.clubRole || "Staff"}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>{item.phone}</span>
                          <span>•</span>
                          <span className="text-[#FFD21F] font-bold">{item.reference}</span>
                        </div>
                      </td>

                      {/* State Badge */}
                      <td className="py-3 px-3">
                        {item.userState === "EXEMPT_STAFF" ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                            ★ Exonéré (Staff)
                          </span>
                        ) : item.userState === "OVERDUE" ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold flex items-center gap-1">
                            <FiAlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                            <span>Retard ({item.overdueMonths.length})</span>
                          </span>
                        ) : item.userState === "PENDING_INITIAL" ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                            En attente
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <FiCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>À jour</span>
                          </span>
                        )}
                      </td>

                      {/* Total Paid */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-white text-xs">
                          {item.totalPaidDzd.toLocaleString()} DA
                        </span>
                        <span className="block text-[10px] text-gray-500 font-sans">
                          {item.paymentsCount} reçu(s)
                        </span>
                      </td>

                      {/* Month Matrix Cells */}
                      {item.schedule.map((m) => {
                        return (
                          <td key={m.id} className="py-2 px-1 text-center">
                            {m.isPaid ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (m.receiptNumber) {
                                    window.open(`/receipt/${m.receiptNumber}`, "_blank");
                                  }
                                }}
                                title={m.receiptNumber ? `Payé • Reçu ${m.receiptNumber}` : "Cotisation validée"}
                                className="w-full py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center justify-center gap-0.5 transition cursor-pointer"
                              >
                                <FiCheck className="w-3 h-3" />
                                <span>OK</span>
                              </button>
                            ) : m.isLate ? (
                              <button
                                type="button"
                                onClick={() => handleOpenEncaissement(item, m)}
                                title={`En retard pour ${m.label}. Cliquez pour encaisser.`}
                                className="w-full py-1 rounded bg-red-500/20 hover:bg-red-500/35 text-red-300 border border-red-500/40 text-[10px] font-bold flex items-center justify-center gap-0.5 transition cursor-pointer animate-pulse"
                              >
                                <FiPlus className="w-2.5 h-2.5" />
                                <span>Dû</span>
                              </button>
                            ) : m.isCurrent ? (
                              <button
                                type="button"
                                onClick={() => handleOpenEncaissement(item, m)}
                                title={`Mois en cours (${m.label}). Cliquez pour encaisser.`}
                                className="w-full py-1 rounded bg-[#FFD21F]/15 hover:bg-[#FFD21F]/30 text-[#FFD21F] border border-[#FFD21F]/30 text-[10px] font-bold flex items-center justify-center gap-0.5 transition cursor-pointer"
                              >
                                <FiPlus className="w-2.5 h-2.5" />
                                <span>En cours</span>
                              </button>
                            ) : (
                              <span className="text-gray-600 text-[10px] select-none">—</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Row Action (Sticky Right) */}
                      <td className="py-3 px-4 text-right sticky right-0 bg-[#141419] group-hover:bg-[#181820] z-10">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEncaissement(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 font-bold text-[11px] transition border border-emerald-500/20 cursor-pointer flex items-center gap-1"
                            title="Encaisser un paiement pour cet adhérent"
                          >
                            <FiPlus className="w-3 h-3" />
                            <span>Encaisser</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RECEIPTS JOURNAL VIEW                                                  */}
      {/* ========================================================================= */}
      {viewMode === "RECEIPTS" && (
        <div className="space-y-4">
          {/* Filters Toolbar */}
          <div className="p-4 bg-[#141419]/85 border border-white/10 rounded-2xl flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher par N° de reçu, participant, référence..."
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
          </div>

          {/* Payments Table */}
          <div className="relative overflow-x-auto bg-[#141419]/80 border border-white/10 rounded-2xl shadow-xl">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1C1C24]/90 text-xs uppercase tracking-wider text-[#9E9EA8] font-mono border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-6">N° Reçu</th>
                  <th className="py-3.5 px-6">Participant</th>
                  <th className="py-3.5 px-6">Réf. Inscription</th>
                  <th className="py-3.5 px-6">Motif</th>
                  <th className="py-3.5 px-6">Montant perçu</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Chargement des quittances...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Aucun reçu enregistré pour cette sélection.
                    </td>
                  </tr>
                ) : (
                  payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-6 font-bold text-[#FFD21F]">
                        {pay.receiptNumber}
                      </td>
                      <td className="py-3.5 px-6 font-sans">
                        <div className="font-bold text-white text-sm">
                          {pay.registration?.participant?.firstName} {pay.registration?.participant?.lastName}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {pay.registration?.participant?.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-gray-300">
                        {pay.registration?.reference}
                      </td>
                      <td className="py-3.5 px-6 font-sans text-gray-300">
                        {pay.paymentPurpose}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-emerald-400 text-sm">
                        {pay.amount.toLocaleString()} DZD
                      </td>
                      <td className="py-3.5 px-6 text-gray-400">
                        {new Date(pay.paidAt || pay.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(pay)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition"
                            title="Imprimer le reçu"
                          >
                            <FiPrinter className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(pay)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition"
                            title="Modifier"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentToDelete(pay)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
              <span>
                Page <strong className="text-white">{page}</strong> sur <strong className="text-white">{totalPages}</strong> ({totalCount} reçus)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 bg-[#141419] hover:bg-[#1C1C24] rounded-lg disabled:opacity-30 transition"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 bg-[#141419] hover:bg-[#1C1C24] rounded-lg disabled:opacity-30 transition"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: ENCAISSER UN PAIEMENT (PAR MOIS OU GÉNÉRAL)                     */}
      {/* ========================================================================= */}
      {showEncaisseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141419] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FiPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    Encaisser un paiement
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">
                    Enregistrement de versement & quittance officielle
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEncaisseModal(false);
                  setEncaisseSuccessReceipt(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Success Feedback View */}
            {encaisseSuccessReceipt ? (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <FiCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white font-display">
                    Paiement Encaissé avec Succès !
                  </h4>
                  <p className="text-xs text-gray-400">
                    La quittance séquentielle a été générée. Le statut de l&apos;adhérent a été mis à jour.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C24] border border-white/10 font-mono text-center space-y-1 max-w-sm mx-auto">
                  <span className="text-[10px] text-gray-400 uppercase block">Numéro de Reçu Officiel</span>
                  <strong className="text-lg text-[#FFD21F] block">{encaisseSuccessReceipt.receiptNumber}</strong>
                  <span className="text-xs text-emerald-400 font-bold block">{encaisseSuccessReceipt.amount} DZD (Espèces)</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    href={`/receipt/${encaisseSuccessReceipt.receiptNumber}`}
                    target="_blank"
                    className="px-5 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
                  >
                    <FiPrinter className="w-4 h-4" />
                    <span>Imprimer la quittance</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEncaisseModal(false);
                      setEncaisseSuccessReceipt(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Encaissement Form */
              <form onSubmit={handleSaveEncaissement} className="space-y-5">
                {/* 1. Adherent Selector / Search */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                    Adhérent(e) concerné(e) *
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3.5 top-3 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      value={encaisseAdherentSearch}
                      onChange={(e) => {
                        setEncaisseAdherentSearch(e.target.value);
                        setSelectedAdherentForEncaisse(null);
                      }}
                      placeholder="Tapez le nom, téléphone ou référence..."
                      className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Dropdown Candidate list when searching and not selected */}
                  {!selectedAdherentForEncaisse && encaisseAdherentSearch.trim().length > 0 && (
                    <div className="max-h-48 overflow-y-auto bg-[#1C1C24] border border-white/15 rounded-xl divide-y divide-white/5 shadow-2xl">
                      {filteredCandidates.slice(0, 8).map((cand) => (
                        <button
                          key={cand.registrationId}
                          type="button"
                          onClick={() => {
                            setSelectedAdherentForEncaisse(cand);
                            setEncaisseAdherentSearch(cand.fullName);
                            const amount = cand.monthlyTotalDzd > 0 ? cand.monthlyTotalDzd : (cand.annualTotalDzd || 1500);
                            setEncaisseForm((prev) => ({
                              ...prev,
                              amount: amount.toString(),
                              paymentPurpose: cand.totalPaidDzd === 0
                                ? "Cotisation annuelle & assurance + 1er mois"
                                : "Mensualité en cours",
                            }));
                          }}
                          className="w-full p-2.5 text-left hover:bg-white/5 transition flex items-center justify-between text-xs cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-white block">{cand.fullName}</span>
                            <span className="text-[11px] text-gray-400 font-mono">{cand.phone} • Réf: {cand.reference}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold">
                            Choisir
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Adherent Preview Card */}
                  {selectedAdherentForEncaisse && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <strong className="text-white text-sm font-bold block">{selectedAdherentForEncaisse.fullName}</strong>
                        <div className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
                          Tél : {selectedAdherentForEncaisse.phone} • {selectedAdherentForEncaisse.reference}
                        </div>
                        <div className="text-[11px] text-gray-300 font-mono mt-1">
                          Tarif mensuel : <strong>{selectedAdherentForEncaisse.monthlyTotalDzd} DZD</strong> • Déjà réglé : <strong>{selectedAdherentForEncaisse.totalPaidDzd} DZD</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAdherentForEncaisse(null);
                          setEncaisseAdherentSearch("");
                        }}
                        className="text-gray-400 hover:text-white p-1"
                        title="Changer d'adhérent"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Quick Month Selector Pills (if adherent selected) */}
                {selectedAdherentForEncaisse && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                      Sélectionnez le mois / l&apos;échéance à encaisser :
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {selectedAdherentForEncaisse.schedule.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setEncaisseForm((prev) => ({
                              ...prev,
                              paymentPurpose: `Mensualité ${m.label}`,
                              amount: (selectedAdherentForEncaisse.monthlyTotalDzd || 1500).toString(),
                            }));
                          }}
                          className={`p-2 rounded-xl text-center text-xs font-mono transition border cursor-pointer ${
                            encaisseForm.paymentPurpose === `Mensualité ${m.label}`
                              ? "bg-emerald-500 text-white font-bold border-emerald-400 shadow-md"
                              : m.isPaid
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : m.isLate
                              ? "bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500/25"
                              : "bg-[#1C1C24] border-white/5 text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          <span className="block font-bold text-[11px]">{m.label.split(" ")[0]}</span>
                          <span className="block text-[9px] opacity-75">
                            {m.isPaid ? "✓ Payé" : m.isLate ? "⚠️ Retard" : "À payer"}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Common Shortcuts */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setEncaisseForm((prev) => ({
                            ...prev,
                            paymentPurpose: "Cotisation annuelle & assurance + 1er mois",
                            amount: (
                              selectedAdherentForEncaisse.annualTotalDzd +
                              selectedAdherentForEncaisse.monthlyTotalDzd
                            ).toString(),
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-mono border border-white/10"
                      >
                        Assurance + 1er mois
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEncaisseForm((prev) => ({
                            ...prev,
                            paymentPurpose: "Trimestre de cours (3 mois)",
                            amount: (selectedAdherentForEncaisse.monthlyTotalDzd * 3).toString(),
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-mono border border-white/10"
                      >
                        Trimestre (3 mois)
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Purpose & Amount Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                      Montant encaissé (DZD) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={encaisseForm.amount}
                      onChange={(e) => setEncaisseForm({ ...encaisseForm, amount: e.target.value })}
                      placeholder="Ex : 1500"
                      className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                      Date du règlement *
                    </label>
                    <input
                      type="date"
                      required
                      value={encaisseForm.paidAt}
                      onChange={(e) => setEncaisseForm({ ...encaisseForm, paidAt: e.target.value })}
                      className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                    Désignation / Motif sur le reçu *
                  </label>
                  <input
                    type="text"
                    required
                    value={encaisseForm.paymentPurpose}
                    onChange={(e) => setEncaisseForm({ ...encaisseForm, paymentPurpose: e.target.value })}
                    placeholder="Ex : Mensualité Mars 2026"
                    className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1.5">
                    Notes / Remarques de caisse (Facultatif)
                  </label>
                  <input
                    type="text"
                    value={encaisseForm.notes}
                    onChange={(e) => setEncaisseForm({ ...encaisseForm, notes: e.target.value })}
                    placeholder="Ex : Règlement reçu en espèces par le trésorier..."
                    className="w-full bg-[#1C1C24] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowEncaisseModal(false)}
                    disabled={encaisseSubmitting}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={encaisseSubmitting || !selectedAdherentForEncaisse}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>{encaisseSubmitting ? "Enregistrement..." : "Confirmer l'encaissement (Caisse)"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PRINTABLE RECEIPT MODAL                                                */}
      {/* ========================================================================= */}
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
                    Reçu délivré contre versement d&apos;espèces. Tout règlement est définitif conformément aux statuts du club.
                  </p>
                  <p className="font-mono text-[10px]">
                    Encaissé par l&apos;administration du club (Agent : {selectedReceipt.recordedBy?.phone || "Admin"})
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

      {/* ========================================================================= */}
      {/* 5. EDIT PAYMENT MODAL                                                     */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 6. DELETE PAYMENT MODAL                                                   */}
      {/* ========================================================================= */}
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
