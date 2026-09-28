"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import {
  ArrowLeft as FiArrowLeft,
  CheckCircle2 as FiCheckCircle,
  XCircle as FiXCircle,
  AlertTriangle as FiAlertTriangle,
  DollarSign as FiDollarSign,
  Archive as FiArchive,
  Printer as FiPrinter,
  User as FiUser,
  FileText as FiFileText,
  Shield as FiShield,
  Activity as FiActivity,
  Calendar as FiCalendar,
  Phone as FiPhone,
  Mail as FiMail,
  MapPin as FiMapPin,
  Clock as FiClock,
  ExternalLink as FiExternalLink,
  AlertCircle as FiAlertCircle,
  Eye as FiEye,
  Check as FiCheck,
  X as FiX,
} from "lucide-react";

interface RegistrationDetail {
  id: string;
  reference: string;
  seasonId: string;
  participantId: string;
  status: string;
  correctionReason?: string | null;
  correctionFields?: string | null;
  isMarkedDuplicate: boolean;
  duplicateNotes?: string | null;
  engagementAccepted: boolean;
  engagementAcceptedAt?: string | null;
  internalNotes?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    firstNameAr?: string | null;
    lastNameAr?: string | null;
    gender: string;
    dateOfBirth: string;
    placeOfBirth: string;
    bloodType?: string | null;
    phone: string;
    whatsapp?: string | null;
    email?: string | null;
    address: string;
    hasEmergencyContact: boolean;
    emergencyName?: string | null;
    emergencyPhone?: string | null;
    emergencyRelation?: string | null;
  };
  season: {
    id: string;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
  };
  disciplines: Array<{
    id: string;
    discipline: {
      id: string;
      code: string;
      name: string;
      nameAr: string;
    };
  }>;
  documents: Array<{
    id: string;
    type: string;
    status: string;
    mimeType: string;
    fileSize: number;
    rejectionReason?: string | null;
    createdAt: string;
  }>;
  parentalAuthorization?: {
    id: string;
    guardianFullName: string;
    guardianKinship: string;
    guardianPhone: string;
    emergencyPhone?: string | null;
    guardianIdNumber?: string | null;
    signedAt: string;
  } | null;
  payments: Array<{
    id: string;
    receiptNumber: string;
    amount: number;
    paymentMethod: string;
    paymentPurpose: string;
    status: string;
    paidAt?: string | null;
    createdAt: string;
    recordedBy?: {
      phone: string;
      role: string;
    } | null;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    createdAt: string;
    details?: string | null;
    user?: {
      phone: string;
      role: string;
    } | null;
  }>;
}

export default function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, locale, isRtl } = useLanguage();
  const router = useRouter();

  const [registration, setRegistration] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"identity" | "documents" | "payments" | "history">("identity");

  // Action Modals State
  const [actionLoading, setActionLoading] = useState(false);
  const [actionModal, setActionModal] = useState<
    "ACCEPT" | "REJECT" | "REQUEST_CORRECTION" | "ARCHIVE" | "ACTIVATE" | "PAYMENT" | null
  >(null);

  // Form states for modals
  const [rejectReason, setRejectReason] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionFields, setCorrectionFields] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("5000");
  const [paymentPurpose, setPaymentPurpose] = useState("Cotisation annuelle, assurance & 1er mois");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Printable receipt state
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Fetch full details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/registrations/${id}`);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Impossible de charger le dossier d'inscription.");
      }
      const data = await res.json();
      setRegistration(data.registration);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Execute workflow action
  const handleWorkflowAction = async (action: string, payload: any = {}) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/registrations/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors du traitement de l'action.");
        return;
      }

      setActionModal(null);
      fetchDetails();
    } catch (err: any) {
      alert(err.message || "Erreur réseau.");
    } finally {
      setActionLoading(false);
    }
  };

  // Record Cash Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: id,
          amount: parseFloat(paymentAmount),
          paymentPurpose,
          notes: paymentNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors de l'enregistrement du paiement.");
        return;
      }

      setActionModal(null);
      // Auto open printable receipt modal
      setSelectedReceipt(data.payment);
      fetchDetails();
    } catch (err: any) {
      alert(err.message || "Erreur de connexion.");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick document status validation/rejection
  const handleQuickDocUpdate = async (docId: string, status: "VALID" | "INVALID") => {
    try {
      const reason = status === "INVALID" ? prompt("Motif du rejet du document :") : null;
      if (status === "INVALID" && !reason) return;

      const res = await fetch(`/api/admin/documents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, status, rejectionReason: reason }),
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Erreur lors de la mise à jour du document.");
        return;
      }

      fetchDetails();
    } catch (err: any) {
      alert(err.message || "Erreur réseau.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400 gap-4">
        <div className="w-12 h-12 border-4 border-[#E52421] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Chargement du dossier...</p>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-[#E52421]/10 text-[#E52421] rounded-2xl flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Dossier introuvable</h2>
        <p className="text-sm text-gray-400">{error || "Ce dossier n'existe pas ou a été supprimé."}</p>
        <Link
          href="/admin/registrations"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1C24] text-white hover:bg-[#252530] rounded-xl text-sm font-medium transition"
        >
          <FiArrowLeft className="w-4 h-4" />
          Retour aux inscriptions
        </Link>
      </div>
    );
  }

  const p = registration.participant;
  const isMinor = registration.parentalAuthorization !== null && registration.parentalAuthorization !== undefined;
  const age = Math.floor(
    (new Date().getTime() - new Date(p.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Quick Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/registrations"
            className="p-2.5 bg-[#141419] hover:bg-[#1C1C24] text-gray-400 hover:text-white rounded-xl border border-white/5 transition flex items-center justify-center"
            title="Retour à la liste"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {p.firstName} {p.lastName}
              </h1>
              <StatusBadge status={registration.status} />
              {registration.isMarkedDuplicate && (
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                  <FiAlertTriangle className="w-3.5 h-3.5" /> Doublon signalé
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <span className="font-mono text-gray-300 font-bold">{registration.reference}</span>
              <span>•</span>
              <span>Saison {registration.season.name} ({registration.season.code})</span>
              <span>•</span>
              <span>Créé le {new Date(registration.createdAt).toLocaleDateString("fr-FR")}</span>
            </p>
          </div>
        </div>

        {/* State Machine Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {registration.status === "UNDER_REVIEW" && (
            <>
              <button
                onClick={() => setActionModal("ACCEPT")}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <FiCheckCircle className="w-4 h-4" />
                Valider le dossier
              </button>
              <button
                onClick={() => setActionModal("REQUEST_CORRECTION")}
                className="px-4 py-2.5 bg-[#FFD21F]/15 hover:bg-[#FFD21F]/25 text-[#FFD21F] border border-[#FFD21F]/30 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <FiAlertCircle className="w-4 h-4" />
                Demander correction
              </button>
              <button
                onClick={() => setActionModal("REJECT")}
                className="px-4 py-2.5 bg-[#E52421]/15 hover:bg-[#E52421]/25 text-[#E52421] border border-[#E52421]/30 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <FiXCircle className="w-4 h-4" />
                Refuser
              </button>
            </>
          )}

          {registration.status === "PAYMENT_PENDING" && (
            <>
              <button
                onClick={() => setActionModal("PAYMENT")}
                className="px-4 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#E52421]/20"
              >
                <FiDollarSign className="w-4 h-4" />
                Encaisser espèces (CASH)
              </button>
              <button
                onClick={() => handleWorkflowAction("ACTIVATE")}
                className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <FiCheckCircle className="w-4 h-4" />
                Activer manuellement
              </button>
            </>
          )}

          {registration.status === "ACTIVE" && (
            <>
              <button
                onClick={() => setActionModal("PAYMENT")}
                className="px-4 py-2.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 border border-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <FiDollarSign className="w-4 h-4 text-[#FFD21F]" />
                Enregistrer un versement
              </button>
              <button
                onClick={() => setActionModal("ARCHIVE")}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <FiArchive className="w-4 h-4" />
                Archiver
              </button>
            </>
          )}

          {registration.status === "NEEDS_CORRECTION" && (
            <button
              onClick={() => handleWorkflowAction("ACCEPT")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
            >
              <FiCheckCircle className="w-4 h-4" />
              Réaccepter après révision
            </button>
          )}

          {/* Duplicate toggle button */}
          <button
            onClick={() =>
              handleWorkflowAction(
                registration.isMarkedDuplicate ? "MARK_LEGITIMATE" : "MARK_DUPLICATE"
              )
            }
            className={`px-3 py-2.5 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              registration.isMarkedDuplicate
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                : "bg-[#141419] text-gray-400 border-white/5 hover:text-white hover:bg-[#1C1C24]"
            }`}
          >
            <FiShield className="w-4 h-4" />
            {registration.isMarkedDuplicate ? "Résoudre doublon" : "Signaler doublon"}
          </button>
        </div>
      </div>

      {/* Alert banner if correction requested or rejected */}
      {registration.status === "NEEDS_CORRECTION" && (
        <div className="p-4 bg-[#FFD21F]/10 border border-[#FFD21F]/30 rounded-2xl flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-[#FFD21F] shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold text-[#FFD21F]">Dossier en attente de correction par le participant</h4>
            <p className="text-gray-300 mt-1">{registration.correctionReason}</p>
            {registration.correctionFields && (
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Pièces/champs concernés : {registration.correctionFields}
              </p>
            )}
          </div>
        </div>
      )}

      {registration.status === "REJECTED" && (
        <div className="p-4 bg-[#E52421]/10 border border-[#E52421]/30 rounded-2xl flex items-start gap-3">
          <FiXCircle className="w-5 h-5 text-[#E52421] shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold text-[#E52421]">Dossier refusé</h4>
            <p className="text-gray-300 mt-1">{registration.correctionReason}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-8">
        <button
          onClick={() => setActiveTab("identity")}
          className={`pb-4 text-sm font-semibold tracking-wide flex items-center gap-2 border-b-2 transition ${
            activeTab === "identity"
              ? "border-[#E52421] text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <FiUser className="w-4 h-4" />
          Identité & Disciplines
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-4 text-sm font-semibold tracking-wide flex items-center gap-2 border-b-2 transition ${
            activeTab === "documents"
              ? "border-[#E52421] text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <FiFileText className="w-4 h-4" />
          Justificatifs & Pièces ({registration.documents.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-4 text-sm font-semibold tracking-wide flex items-center gap-2 border-b-2 transition ${
            activeTab === "payments"
              ? "border-[#E52421] text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <FiDollarSign className="w-4 h-4" />
          Règlements & Reçus ({registration.payments.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-4 text-sm font-semibold tracking-wide flex items-center gap-2 border-b-2 transition ${
            activeTab === "history"
              ? "border-[#E52421] text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <FiActivity className="w-4 h-4" />
          Historique & Audit ({registration.auditLogs.length})
        </button>
      </div>

      {/* TAB 1: IDENTITY & DISCIPLINES */}
      {activeTab === "identity" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity Card */}
            <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <FiUser className="w-4 h-4 text-[#E52421]" />
                État Civil & Coordonnées
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Nom et Prénom (Latin)</span>
                  <span className="font-semibold text-white text-base">
                    {p.firstName} {p.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Nom et Prénom (Arabe)</span>
                  <span className="font-arabic text-lg text-white font-medium" dir="rtl">
                    {p.firstNameAr || p.lastNameAr ? `${p.lastNameAr || ""} ${p.firstNameAr || ""}` : "—"}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Date et Âge</span>
                  <span className="text-gray-200 flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(p.dateOfBirth).toLocaleDateString("fr-FR")} ({age} ans)
                    {isMinor ? (
                      <span className="ml-2 px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded">
                        Mineur
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded">
                        Majeur
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Lieu de Naissance</span>
                  <span className="text-gray-200">{p.placeOfBirth || "—"}</span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Sexe</span>
                  <span className="text-gray-200">{p.gender === "MALE" ? "Homme (Masculin)" : "Femme (Féminin)"}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Groupe Sanguin</span>
                  <span className="text-gray-200 font-bold px-2 py-0.5 bg-[#1C1C24] rounded-md inline-block">
                    {p.bloodType || "Non renseigné"}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Téléphone Principal</span>
                  <span className="text-gray-200 font-mono font-medium flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`tel:${p.phone}`} className="hover:text-[#FFD21F] underline decoration-white/20">
                      {p.phone}
                    </a>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">WhatsApp</span>
                  <span className="text-gray-200 font-mono">
                    {p.whatsapp ? (
                      <a
                        href={`https://wa.me/${p.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {p.whatsapp} <FiExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Email</span>
                  <span className="text-gray-200 flex items-center gap-1.5">
                    <FiMail className="w-3.5 h-3.5 text-gray-400" />
                    {p.email ? <a href={`mailto:${p.email}`} className="hover:text-white">{p.email}</a> : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Adresse de Résidence</span>
                  <span className="text-gray-200 flex items-start gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    {p.address}
                  </span>
                </div>
              </div>

              {p.hasEmergencyContact && (
                <div className="mt-4 pt-4 border-t border-white/5 bg-[#1C1C24]/50 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Contact d'urgence déclaré
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block">Nom du contact</span>
                      <span className="text-gray-200 font-medium">{p.emergencyName || "—"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Relation</span>
                      <span className="text-gray-200">{p.emergencyRelation || "—"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Téléphone d'urgence</span>
                      <span className="text-gray-200 font-mono font-medium">{p.emergencyPhone || "—"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Disciplines Card */}
            <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <FiActivity className="w-4 h-4 text-[#FFD21F]" />
                Disciplines Choisies ({registration.disciplines.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {registration.disciplines.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 bg-[#1C1C24] border border-white/5 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">{(d.discipline as any).nameFr || (d.discipline as any).name}</span>
                      <span className="font-arabic text-xs text-gray-400" dir="rtl">{d.discipline.nameAr}</span>
                    </div>
                    <span className="px-2 py-1 bg-white/5 text-gray-300 font-mono text-xs rounded">
                      {(d.discipline as any).slug || (d.discipline as any).code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Column: Legal & Administrative */}
          <div className="space-y-6">
            {/* Parental Authorization if Minor */}
            {isMinor ? (
              <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <FiShield className="w-4 h-4 text-amber-400" />
                  Autorisation Parentale (Mineur)
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-400 block">Tuteur Légal</span>
                    <span className="font-semibold text-white">
                      {(registration.parentalAuthorization as any)?.guardianName || (registration.parentalAuthorization as any)?.guardianFullName || "Tuteur Légal"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Lien de parenté</span>
                    <span className="text-gray-200">{(registration.parentalAuthorization as any)?.guardianKinship || "Parent / Tuteur"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Téléphone Tuteur</span>
                    <span className="text-gray-200 font-mono">{(registration.parentalAuthorization as any)?.guardianPhone || p.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Date de signature</span>
                    <span className="text-gray-200 text-xs">
                      {new Date((registration.parentalAuthorization as any)?.acceptedAt || (registration.parentalAuthorization as any)?.signedAt || registration.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <FiShield className="w-4 h-4 text-emerald-400" />
                  Statut Majeur
                </h3>
                <p className="text-xs text-gray-400">
                  Le participant est majeur. Aucune autorisation parentale n'est requise.
                </p>
              </div>
            )}

            {/* Engagement & Disclaimers */}
            <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                Engagement & Règlements
              </h3>
              <div className="text-xs space-y-2 text-gray-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <FiCheck className="w-4 h-4" /> Règlements intérieurs acceptés
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <FiCheck className="w-4 h-4" /> Décharge de responsabilité signée
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <FiCheck className="w-4 h-4" /> Autorisation de prise de vue & médias
                </div>
                {registration.engagementAcceptedAt && (
                  <p className="text-gray-400 text-[11px] pt-2 border-t border-white/5 font-mono">
                    Accepté le : {new Date(registration.engagementAcceptedAt).toLocaleString("fr-FR")}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions to Participant Directory */}
            <div className="p-5 bg-[#1C1C24] border border-white/5 rounded-2xl text-center space-y-3">
              <p className="text-xs text-gray-400">Consulter la fiche adhérent complète et son historique pluriannuel</p>
              <Link
                href={`/admin/participants/${p.id}`}
                className="w-full py-2.5 px-4 bg-[#252530] hover:bg-[#303040] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <FiUser className="w-4 h-4" /> Voir profil adhérent
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Justificatifs fournis</h3>
            <span className="text-xs text-gray-400">
              Streaming sécurisé et authentifié via <code className="text-gray-300">/api/documents/[id]</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registration.documents.map((doc) => {
              const isPdf = doc.mimeType === "application/pdf";
              const isImage = doc.mimeType.startsWith("image/");
              const docUrl = `/api/documents/${doc.id}`;

              return (
                <div
                  key={doc.id}
                  className="p-5 bg-[#141419] border border-white/5 rounded-2xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-white text-base">
                          {doc.type === "PHOTO" && "Photo d'identité"}
                          {doc.type === "ID_CARD" && "Pièce d'identité (CNI / Passeport)"}
                          {doc.type === "MEDICAL_CERTIFICATE" && "Certificat médical d'aptitude"}
                          {doc.type === "PARENTAL_AUTHORIZATION" && "Autorisation parentale signée"}
                          {doc.type === "OTHER" && "Autre justificatif"}
                        </h4>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {doc.mimeType} • {(doc.fileSize / 1024).toFixed(0)} Ko
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                          doc.status === "VALID"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : doc.status === "INVALID"
                            ? "bg-[#E52421]/10 text-[#E52421] border border-[#E52421]/30"
                            : "bg-[#FFD21F]/10 text-[#FFD21F] border border-[#FFD21F]/30"
                        }`}
                      >
                        {doc.status === "VALID" ? "Validé" : doc.status === "INVALID" ? "Rejeté" : "En attente"}
                      </span>
                    </div>

                    {/* Preview box */}
                    <div className="h-48 w-full bg-[#0A0A0D] rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center">
                      {isImage ? (
                        <img
                          src={docUrl}
                          alt={doc.type}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : isPdf ? (
                        <div className="text-center p-4">
                          <FiFileText className="w-12 h-12 text-[#E52421] mx-auto mb-2" />
                          <span className="text-xs text-gray-300 font-medium block">Document PDF</span>
                        </div>
                      ) : (
                        <FiFileText className="w-10 h-10 text-gray-500" />
                      )}
                    </div>

                    {doc.rejectionReason && (
                      <p className="text-xs text-[#E52421] bg-[#E52421]/10 p-2.5 rounded-lg border border-[#E52421]/20">
                        Motif rejet : {doc.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Document Controls */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <FiEye className="w-3.5 h-3.5" /> Ouvrir en grand
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickDocUpdate(doc.id, "VALID")}
                        className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        title="Valider la pièce"
                      >
                        <FiCheck className="w-3.5 h-3.5" /> Valider
                      </button>
                      <button
                        onClick={() => handleQuickDocUpdate(doc.id, "INVALID")}
                        className="px-3 py-2 bg-[#E52421]/20 hover:bg-[#E52421]/30 text-[#E52421] border border-[#E52421]/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        title="Rejeter la pièce"
                      >
                        <FiX className="w-3.5 h-3.5" /> Invalider
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {registration.documents.length === 0 && (
              <div className="col-span-2 p-12 bg-[#141419] border border-white/5 rounded-2xl text-center text-gray-400">
                <FiFileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">Aucun document joint</h4>
                <p className="text-xs text-gray-500 mt-1">Le participant n'a pas encore téléversé ses pièces justificatives.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS & RECEIPTS */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Historique financier & Reçus de paiement</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Règlements en espèces exclusivement (CASH V1). Tout versement génère un reçu séquentiel numéroté.
              </p>
            </div>
            <button
              onClick={() => setActionModal("PAYMENT")}
              className="px-4 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#E52421]/20"
            >
              <FiDollarSign className="w-4 h-4" />
              Encaisser un paiement
            </button>
          </div>

          <div className="overflow-x-auto bg-[#141419] border border-white/5 rounded-2xl">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0A0A0D] text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-6">N° Reçu</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Motif</th>
                  <th className="py-3.5 px-6">Montant</th>
                  <th className="py-3.5 px-6">Mode</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6">Encaissé par</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registration.payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6 font-mono font-bold text-[#FFD21F]">
                      {pay.receiptNumber}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400">
                      {new Date(pay.paidAt || pay.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-4 px-6 font-medium text-white">{pay.paymentPurpose}</td>
                    <td className="py-4 px-6 font-mono font-bold text-white text-base">
                      {pay.amount.toLocaleString()} DZD
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded">
                        ESPÈCES
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded">
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {pay.recordedBy?.phone || "Admin"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedReceipt(pay)}
                        className="px-3 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-gray-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                      >
                        <FiPrinter className="w-3.5 h-3.5 text-[#FFD21F]" /> Imprimer reçu
                      </button>
                    </td>
                  </tr>
                ))}

                {registration.payments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      Aucun versement enregistré pour cette inscription.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Journal d'audit du dossier</h3>
            <span className="text-xs text-gray-400">Traçabilité complète des actions administratives</span>
          </div>

          <div className="bg-[#141419] border border-white/5 rounded-2xl divide-y divide-white/5">
            {registration.auditLogs.map((log) => {
              let parsedDetails = null;
              try {
                if (log.details) parsedDetails = JSON.parse(log.details);
              } catch (e) {}

              return (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white/5 font-mono text-xs text-white rounded font-bold">
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-400">
                        par <strong className="text-gray-300">{log.user?.phone || "Système"}</strong>
                      </span>
                    </div>
                    {parsedDetails && (
                      <p className="text-xs text-gray-400 font-mono">
                        {JSON.stringify(parsedDetails)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" />
                    {new Date(log.createdAt).toLocaleString("fr-FR")}
                  </span>
                </div>
              );
            })}

            {registration.auditLogs.length === 0 && (
              <div className="p-12 text-center text-gray-500">Aucun historique d'audit disponible.</div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ACCEPT */}
      {actionModal === "ACCEPT" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141419] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Valider le dossier d'inscription</h3>
                <p className="text-xs text-gray-400">Passer le statut à "EN ATTENTE DE PAIEMENT"</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Confirmez-vous que les pièces et renseignements de <strong>{p.firstName} {p.lastName}</strong> sont conformes ? Le participant sera notifié qu'il peut venir au club régler sa cotisation.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleWorkflowAction("ACCEPT")}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                {actionLoading ? "Validation..." : "Confirmer la validation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST CORRECTION */}
      {actionModal === "REQUEST_CORRECTION" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141419] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD21F]/10 text-[#FFD21F] rounded-xl flex items-center justify-center">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Demande de correction</h3>
                <p className="text-xs text-gray-400">Inviter le participant à mettre à jour son dossier</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-2">
                  Sélectionnez les pièces ou sections à corriger :
                </label>
                <div className="space-y-2">
                  {[
                    { key: "PHOTO", label: "Photo d'identité non conforme" },
                    { key: "ID_CARD", label: "Pièce d'identité illisible / expirée" },
                    { key: "MEDICAL_CERTIFICATE", label: "Certificat médical manquant ou invalide" },
                    { key: "PARENTAL_AUTHORIZATION", label: "Autorisation parentale incomplète" },
                    { key: "CIVIL_INFO", label: "Erreur dans les informations d'état civil" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-2 bg-[#1C1C24] rounded-lg cursor-pointer hover:bg-[#252530]"
                    >
                      <input
                        type="checkbox"
                        checked={correctionFields.includes(item.key)}
                        onChange={(e) => {
                          if (e.target.checked) setCorrectionFields([...correctionFields, item.key]);
                          else setCorrectionFields(correctionFields.filter((f) => f !== item.key));
                        }}
                        className="accent-[#E52421]"
                      />
                      <span className="text-xs text-gray-200">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">
                  Instructions détaillées pour le participant : *
                </label>
                <textarea
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="Ex : Merci de fournir un certificat médical daté de moins de 3 mois..."
                  rows={3}
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={actionLoading || !correctionReason.trim()}
                onClick={() =>
                  handleWorkflowAction("REQUEST_CORRECTION", {
                    reason: correctionReason,
                    fields: correctionFields,
                  })
                }
                className="px-5 py-2.5 bg-[#FFD21F] hover:bg-[#FFB800] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
              >
                {actionLoading ? "Envoi..." : "Envoyer la demande"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT */}
      {actionModal === "REJECT" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141419] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E52421]/10 text-[#E52421] rounded-xl flex items-center justify-center">
                <FiXCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Refuser l'inscription</h3>
                <p className="text-xs text-gray-400">Action irréversible pour cette saison</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <label className="text-xs text-gray-300 font-semibold block">Motif du refus : *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex : Capacité d'accueil atteinte pour la discipline choisie..."
                rows={3}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectReason.trim()}
                onClick={() => handleWorkflowAction("REJECT", { reason: rejectReason })}
                className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
              >
                {actionLoading ? "Refus..." : "Confirmer le refus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CASH PAYMENT RECORDING */}
      {actionModal === "PAYMENT" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleRecordPayment}
            className="bg-[#141419] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                <FiDollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Encaisser un versement en espèces</h3>
                <p className="text-xs text-gray-400">Génération automatique du reçu officiel</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Montant perçu (DZD) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    min="100"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-[#E52421]"
                    required
                  />
                  <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">DZD</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Motif de versement *</label>
                <input
                  type="text"
                  value={paymentPurpose}
                  onChange={(e) => setPaymentPurpose(e.target.value)}
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Observations / Numéro de quittance</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Optionnel"
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                />
              </div>

              <div className="p-3 bg-[#1C1C24] rounded-xl text-xs text-gray-300 border border-white/5 space-y-1">
                <span className="font-semibold text-[#FFD21F] block">Rappel financier :</span>
                <p>Ce versement passe automatiquement le dossier à l'état <strong>ACTIF</strong>.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                {actionLoading ? "Enregistrement..." : "Confirmer l'encaissement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: PRINTABLE RECEIPT */}
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

            {/* PRINTABLE RECEIPT TEMPLATE (A5 style) */}
            <div className="border border-white/20 p-6 rounded-xl space-y-6 print:border-black print:p-6 print:space-y-4">
              {/* Header */}
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
                    {p.firstName} {p.lastName}
                  </strong>
                  <p className="text-gray-400 print:text-gray-600 mt-0.5">Tél : {p.phone}</p>
                </div>
                <div>
                  <span className="text-gray-400 print:text-gray-600 block">Réf. Inscription & Saison :</span>
                  <strong className="text-sm font-mono text-white print:text-black font-bold">
                    {registration.reference}
                  </strong>
                  <p className="text-gray-400 print:text-gray-600 mt-0.5">Saison {registration.season.name}</p>
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

                {/* Stamp box */}
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
