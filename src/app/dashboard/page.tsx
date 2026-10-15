"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import MembershipCard from "@/components/MembershipCard";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  LogOut,
  CreditCard,
  Eye,
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Hash,
  Upload,
  MapPin,
  Clock,
  Sparkles,
  Users,
  UserPlus,
  UserCheck,
  ChevronRight,
  X,
  FileCheck,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface DocumentItem {
  id: string;
  type: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
}

interface PaymentItem {
  id: string;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  paymentPurpose: string;
  status: string;
  paidAt: string;
}

interface DisciplineItem {
  id: string;
  discipline: {
    id: string;
    slug: string;
    nameFr: string;
    nameAr: string;
    nameEn: string;
  };
}

interface RegistrationItem {
  id: string;
  reference: string;
  status: string;
  correctionReason?: string | null;
  correctionFields?: string | null;
  submittedAt: string;
  season: {
    id: string;
    code: string;
    label: string;
  };
  disciplines: DisciplineItem[];
  documents: DocumentItem[];
  payments: PaymentItem[];
  parentalAuthorization?: {
    id: string;
    guardianName?: string | null;
    declarationAccepted: boolean;
  } | null;
}

interface ParticipantData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  phone: string;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  bloodType?: string | null;
  isMinor: boolean;
  membershipCardNumber?: string | null;
  registrations: RegistrationItem[];
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  discipline: string;
  category: string;
  date: string;
  location: string;
  capacity?: number | null;
  attendeeCount: number;
  isAttending: boolean;
}

export default function DashboardPage() {
  const { t, locale, isRtl } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState("");
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");
  const [error, setError] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);

  // Events State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [togglingEventId, setTogglingEventId] = useState<string | null>(null);

  // Correction & Re-upload Form State
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [replacedPhoto, setReplacedPhoto] = useState<File | null>(null);
  const [replacedNationalId, setReplacedNationalId] = useState<File | null>(null);
  const [replacedMedical, setReplacedMedical] = useState<File | null>(null);
  const [replacedParentalId, setReplacedParentalId] = useState<File | null>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState("");

  // Quick Add Child Modal State
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [childPob, setChildPob] = useState("");
  const [childBloodType, setChildBloodType] = useState("");
  const [childAddress, setChildAddress] = useState("");
  const [childDisciplines, setChildDisciplines] = useState<string[]>(["parkour"]);
  const [childPhoto, setChildPhoto] = useState<File | null>(null);
  const [childNationalId, setChildNationalId] = useState<File | null>(null);
  const [childMedical, setChildMedical] = useState<File | null>(null);
  const [reuseParentId, setReuseParentId] = useState(true);
  const [childParentalId, setChildParentalId] = useState<File | null>(null);
  const [childGuardianName, setChildGuardianName] = useState("");
  const [childParentalAccepted, setChildParentalAccepted] = useState(true);
  const [childEngagementAccepted, setChildEngagementAccepted] = useState(true);
  const [addingChild, setAddingChild] = useState(false);
  const [addChildError, setAddChildError] = useState("");
  const [addChildSuccess, setAddChildSuccess] = useState("");

  // Fetch full user data including all participants
  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/login");
        return;
      }

      setUserPhone(data.user.phone || "");
      const fetchedParticipants: ParticipantData[] = data.user.participants || [];
      setParticipants(fetchedParticipants);

      // Default selected participant
      if (fetchedParticipants.length > 0) {
        setSelectedParticipantId((prev) => {
          if (prev && fetchedParticipants.some((p) => p.id === prev)) {
            return prev;
          }
          // Prioritize participant needing correction if any
          const needsFix = fetchedParticipants.find((p) =>
            p.registrations.some(
              (r) => r.status === "NEEDS_CORRECTION" || r.status === "REJECTED"
            )
          );
          return needsFix ? needsFix.id : fetchedParticipants[0].id;
        });
      }
    } catch {
      setError("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch upcoming events from DB
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error("Failed to fetch events:", e);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // Active selected participant & their latest registration
  const selectedParticipant = useMemo(() => {
    return (
      participants.find((p) => p.id === selectedParticipantId) ||
      participants[0] ||
      null
    );
  }, [participants, selectedParticipantId]);

  const activeRegistration = useMemo(() => {
    return selectedParticipant?.registrations?.[0] || null;
  }, [selectedParticipant]);

  // Check if this account is a family with children or solo adult
  const isFamilyAccount = useMemo(() => {
    return participants.length > 1 || participants.some((p) => p.isMinor);
  }, [participants]);

  // Calculate age helper
  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Copy registration reference
  const handleCopyRef = (refText: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(refText);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Document photo ID for MembershipCard
  const photoDocId = useMemo(() => {
    const doc = activeRegistration?.documents.find((d) => d.type === "PHOTO");
    return doc ? doc.id : null;
  }, [activeRegistration]);

  // Toggle Event RSVP for selected participant
  const handleToggleEventAttendance = async (eventId: string) => {
    if (!selectedParticipant) return;
    setTogglingEventId(eventId);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          participantId: selectedParticipant.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId
              ? {
                  ...ev,
                  isAttending: data.isAttending,
                  attendeeCount: data.attendeeCount,
                }
              : ev
          )
        );
      }
    } catch (err) {
      console.error("Attendance toggle error:", err);
    } finally {
      setTogglingEventId(null);
    }
  };

  // Handle Resubmit / Correction of Documents
  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRegistration) return;
    setResubmitting(true);
    setResubmitSuccess("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("registrationId", activeRegistration.id);

      if (replacedPhoto) {
        const optPhoto = await compressImage(replacedPhoto, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.82,
        });
        formData.append("photo", optPhoto);
      }
      if (replacedNationalId) {
        const optId = await compressImage(replacedNationalId, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
        });
        formData.append("nationalId", optId);
      }
      if (replacedMedical) {
        const optMed = await compressImage(replacedMedical, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
        });
        formData.append("medicalCertificate", optMed);
      }
      if (replacedParentalId) {
        const optPar = await compressImage(replacedParentalId, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
        });
        formData.append("parentNationalId", optPar);
      }

      const res = await fetch("/api/participant/resubmit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du renvoi du dossier.");
      }

      setResubmitSuccess(
        "Les pièces justificatives ont été mises à jour avec succès. Le dossier a été renvoyé pour réexamen par les administrateurs."
      );
      setShowCorrectionForm(false);
      setReplacedPhoto(null);
      setReplacedNationalId(null);
      setReplacedMedical(null);
      setReplacedParentalId(null);

      await fetchUserData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setResubmitting(false);
    }
  };

  // Handle Quick Add Child Submit
  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingChild(true);
    setAddChildError("");
    setAddChildSuccess("");

    try {
      if (!childFirstName || !childLastName || !childDob || !childPob) {
        throw new Error("Veuillez renseigner les informations d'identité de l'enfant.");
      }

      if (childDisciplines.length === 0) {
        throw new Error("Veuillez sélectionner au moins une discipline.");
      }

      if (!childPhoto || !childNationalId || !childMedical) {
        throw new Error("La photo, la pièce d'identité et le certificat médical sont requis.");
      }

      const formData = new FormData();
      formData.append("firstName", childFirstName);
      formData.append("lastName", childLastName);
      formData.append("dateOfBirth", childDob);
      formData.append("placeOfBirth", childPob);
      if (childAddress) formData.append("address", childAddress);
      if (childBloodType) formData.append("bloodType", childBloodType);
      formData.append("disciplines", JSON.stringify(childDisciplines));

      const optPhoto = await compressImage(childPhoto, { maxWidth: 1000, maxHeight: 1000, quality: 0.82 });
      formData.append("photo", optPhoto);

      const optId = await compressImage(childNationalId, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      formData.append("nationalId", optId);

      const optMed = await compressImage(childMedical, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      formData.append("medicalCertificate", optMed);

      if (childParentalId) {
        const optPar = await compressImage(childParentalId, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
        formData.append("parentalId", optPar);
      }

      formData.append("guardianName", childGuardianName || "Parent / Tuteur Légal");
      formData.append("parentalAccepted", childParentalAccepted ? "true" : "false");
      formData.append("engagementAccepted", childEngagementAccepted ? "true" : "false");

      const res = await fetch("/api/participant/add-child", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de l'enfant.");
      }

      setAddChildSuccess(data.message || "Enfant inscrit avec succès !");
      // Reset form
      setChildFirstName("");
      setChildLastName("");
      setChildDob("");
      setChildPob("");
      setChildBloodType("");
      setChildAddress("");
      setChildPhoto(null);
      setChildNationalId(null);
      setChildMedical(null);
      setChildParentalId(null);

      // Re-fetch user data & select new child
      await fetchUserData();
      if (data.participantId) {
        setSelectedParticipantId(data.participantId);
      }
      setTimeout(() => {
        setShowAddChildModal(false);
        setAddChildSuccess("");
      }, 1500);
    } catch (err) {
      setAddChildError((err as Error).message);
    } finally {
      setAddingChild(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#E52421] border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-[#E52421]/20" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#9E9EA8]">
            {t.common.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2] relative overflow-hidden">
      <Navbar />

      {/* Atmospheric Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/hero/hero-parkour.jpg"
          alt="ADD Oran Background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-15 filter contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/90 to-[#0A0A0D]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0D_85%)]" />
        <div className="absolute inset-0 sports-grid-pattern opacity-25" />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-slide-up">
        {/* ========================================================
            1. MASTER HEADER CARD (PARENT OR ADHERENT CONTEXT)
           ======================================================== */}
        <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E52421]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#E52421]/15 border border-[#E52421]/30 text-[#E52421] flex items-center justify-center font-display font-black text-3xl shadow-lg shadow-[#E52421]/15 shrink-0">
              {isFamilyAccount ? (
                <Users className="w-8 h-8 text-[#FFD21F]" />
              ) : (
                selectedParticipant?.firstName?.[0] || "A"
              )}
            </div>
            <div>
              <div className="font-mono text-[10px] sm:text-xs font-bold text-[#FFD21F] uppercase tracking-widest flex items-center gap-2">
                <span>
                  {isFamilyAccount ? t.dashboard.parentSpace : t.dashboard.adherentSpace}
                </span>
                <span>// SAISON 2026</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                {isFamilyAccount ? (
                  <span>
                    Famille & Enfants Inscrits
                  </span>
                ) : (
                  <span>
                    {selectedParticipant?.firstName} {selectedParticipant?.lastName}
                  </span>
                )}
              </h1>
              <div className="font-mono text-xs text-[#9E9EA8] mt-1.5 flex flex-wrap items-center gap-3">
                <span dir="ltr" className="text-white/80 font-bold">
                  {userPhone}
                </span>
                <span className="text-white/20">•</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/10">
                  {participants.length} {participants.length > 1 ? "Adhérents enregistrés" : "Adhérent"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0A0A0D]/80 hover:bg-[#E52421]/15 text-[#9E9EA8] hover:text-white rounded-xl font-mono text-xs font-semibold border border-white/10 hover:border-[#E52421]/40 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-[#FF3030]" />
              <span>{t.common.logout}</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {resubmitSuccess && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-300 font-mono text-xs flex items-center gap-2.5 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{resubmitSuccess}</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-[#E52421]/15 border border-[#E52421]/40 rounded-2xl text-[#FF8585] font-mono text-xs flex items-center gap-2.5 animate-fade-in shadow-lg">
            <AlertTriangle className="w-5 h-5 text-[#FF3030] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================
            2. MULTI-CHILD SELECTOR TABS & QUICK-ENROLL ACTION
           ======================================================== */}
        {participants.length > 0 && (
          <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FFD21F]" />
                  <span>{isFamilyAccount ? t.dashboard.myChildren : "Adhérent actif"}</span>
                </h3>
                <p className="text-xs text-[#9E9EA8] mt-0.5 font-body">
                  {isFamilyAccount
                    ? "Sélectionnez un enfant pour consulter son dossier, ses pièces, sa carte et ses présences."
                    : "Votre dossier d'adhésion officiel et informations de saison."}
                </p>
              </div>

              {/* Quick Add Child Button */}
              <button
                type="button"
                onClick={() => {
                  setChildLastName(selectedParticipant?.lastName || "");
                  setShowAddChildModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#E52421]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.dashboard.addChild}</span>
              </button>
            </div>

            {/* Child Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {participants.map((p) => {
                const isSelected = p.id === selectedParticipantId;
                const reg = p.registrations?.[0];
                const age = calculateAge(p.dateOfBirth);
                const needsAttention =
                  reg?.status === "NEEDS_CORRECTION" || reg?.status === "REJECTED";

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedParticipantId(p.id);
                      setShowCorrectionForm(false);
                      setResubmitSuccess("");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center gap-3.5 cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#1C1C24] border-[#E52421] shadow-lg shadow-[#E52421]/15 ring-1 ring-[#E52421]/50"
                        : "bg-[#0A0A0D]/70 border-white/10 hover:border-white/20 hover:bg-[#141419]"
                    }`}
                  >
                    {/* Active Accent Pill */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-2 h-full bg-[#E52421]" />
                    )}

                    {/* Avatar */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-lg shrink-0 ${
                        isSelected
                          ? "bg-[#E52421] text-white"
                          : "bg-white/5 text-[#9E9EA8] border border-white/10"
                      }`}
                    >
                      {p.firstName[0]}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-sm text-white uppercase truncate">
                          {p.firstName} {p.lastName}
                        </span>
                        {needsAttention && (
                          <span
                            title="Action requise"
                            className="w-2.5 h-2.5 rounded-full bg-[#FF3030] animate-ping shrink-0"
                          />
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-[#9E9EA8] flex items-center gap-2 mt-0.5">
                        <span>{p.isMinor ? `Mineur (${age} ${t.dashboard.childAge})` : "Majeur"}</span>
                        <span>•</span>
                        <span className="truncate">
                          {reg ? reg.reference : "Sans dossier"}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        {reg ? (
                          <StatusBadge status={reg.status} size="sm" />
                        ) : (
                          <span className="text-[10px] font-mono text-[#9E9EA8]">Incomplet</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            3. SELECTED PARTICIPANT DETAIL VIEW
           ======================================================== */}
        {!selectedParticipant || !activeRegistration ? (
          <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-12 text-center space-y-5 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#FFD21F] flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8" />
            </div>
            <p className="font-body text-base text-[#9E9EA8]">
              {t.dashboard.noRegistrations}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-[#E52421]/25 hover:scale-[1.01] transition-all"
            >
              <span>Créer une première adhésion</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rtl-flip" : ""}`} />
            </Link>
          </div>
        ) : (
          <>
            {/* ========================================================
                4. REJECTION / CORRECTION REQUIRED ACTION BANNER
               ======================================================== */}
            {(activeRegistration.status === "NEEDS_CORRECTION" ||
              activeRegistration.status === "REJECTED") && (
              <div className="bg-[#1C1C24] border-2 border-[#FFD21F] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FFD21F]/10 blur-3xl pointer-events-none" />

                <div className="flex items-center gap-3 text-[#FFD21F] relative z-10">
                  <AlertTriangle className="w-6 h-6 shrink-0 text-[#FF3030]" />
                  <h3 className="font-display font-black text-xl uppercase tracking-tight text-white">
                    {activeRegistration.status === "REJECTED"
                      ? t.dashboard.rejectionAlertTitle
                      : t.dashboard.actionRequiredTitle}
                  </h3>
                </div>

                <p className="font-body text-xs sm:text-sm text-[#9E9EA8] leading-relaxed relative z-10">
                  {activeRegistration.status === "REJECTED"
                    ? t.dashboard.rejectionAlertDesc
                    : t.dashboard.actionRequiredDesc}
                </p>

                {activeRegistration.correctionReason && (
                  <div className="p-4 bg-[#0A0A0D]/90 border border-[#FFD21F]/40 rounded-xl space-y-1 relative z-10">
                    <span className="font-mono text-xs font-bold text-[#FFD21F] block uppercase tracking-wider">
                      {t.dashboard.correctionInstructions}
                    </span>
                    <p className="font-editorial italic text-base text-white">
                      « {activeRegistration.correctionReason} »
                    </p>
                  </div>
                )}

                <div className="relative z-10 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionForm(!showCorrectionForm)}
                    className="px-6 py-3 bg-[#FFD21F] hover:bg-[#FFB800] text-[#0A0A0D] font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>
                      {showCorrectionForm
                        ? "Masquer le formulaire de correction"
                        : "Remplacer les pièces et corriger le dossier"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* CORRECTION / RE-UPLOAD DRAWER FORM */}
            {showCorrectionForm && (
              <form
                onSubmit={handleResubmit}
                className="bg-[#141419] border border-[#FFD21F]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in"
              >
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-display font-black text-lg uppercase text-white tracking-tight flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#E52421]" />
                    <span>
                      Remplacement des pièces pour {selectedParticipant.firstName}{" "}
                      {selectedParticipant.lastName}
                    </span>
                  </h4>
                  <p className="font-body text-xs text-[#9E9EA8] mt-1">
                    Sélectionnez uniquement les fichiers nécessitant une correction ou une mise à jour.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A0A0D]/90 rounded-2xl border border-white/10 space-y-2 hover:border-[#E52421]/30 transition-colors">
                    <label className="font-mono text-xs font-bold uppercase text-[#9E9EA8] block">
                      Nouvelle Photo d&apos;identité
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReplacedPhoto(e.target.files?.[0] || null)}
                      className="text-xs text-[#9E9EA8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs file:cursor-pointer hover:file:border-[#E52421] w-full"
                    />
                    {replacedPhoto && (
                      <span className="text-[10px] font-mono text-emerald-400 block truncate">
                        ✓ {replacedPhoto.name}
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-[#0A0A0D]/90 rounded-2xl border border-white/10 space-y-2 hover:border-[#E52421]/30 transition-colors">
                    <label className="font-mono text-xs font-bold uppercase text-[#9E9EA8] block">
                      Nouvelle Pièce d&apos;identité / Livret
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setReplacedNationalId(e.target.files?.[0] || null)}
                      className="text-xs text-[#9E9EA8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs file:cursor-pointer hover:file:border-[#E52421] w-full"
                    />
                    {replacedNationalId && (
                      <span className="text-[10px] font-mono text-emerald-400 block truncate">
                        ✓ {replacedNationalId.name}
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-[#0A0A0D]/90 rounded-2xl border border-white/10 space-y-2 hover:border-[#E52421]/30 transition-colors">
                    <label className="font-mono text-xs font-bold uppercase text-[#9E9EA8] block">
                      Nouveau Certificat Médical
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setReplacedMedical(e.target.files?.[0] || null)}
                      className="text-xs text-[#9E9EA8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs file:cursor-pointer hover:file:border-[#E52421] w-full"
                    />
                    {replacedMedical && (
                      <span className="text-[10px] font-mono text-emerald-400 block truncate">
                        ✓ {replacedMedical.name}
                      </span>
                    )}
                  </div>

                  {selectedParticipant.isMinor && (
                    <div className="p-4 bg-[#0A0A0D]/90 rounded-2xl border border-[#FFD21F]/30 space-y-2">
                      <label className="font-mono text-xs font-bold uppercase text-[#FFD21F] block">
                        Nouvelle Pièce d&apos;identité du Tuteur Légal
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setReplacedParentalId(e.target.files?.[0] || null)}
                        className="text-xs text-[#9E9EA8] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs file:cursor-pointer hover:file:border-[#FFD21F] w-full"
                      />
                      {replacedParentalId && (
                        <span className="text-[10px] font-mono text-emerald-400 block truncate">
                          ✓ {replacedParentalId.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionForm(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-[#9E9EA8] hover:text-white font-mono text-xs cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={
                      resubmitting ||
                      (!replacedPhoto &&
                        !replacedNationalId &&
                        !replacedMedical &&
                        !replacedParentalId)
                    }
                    className="px-6 py-2.5 bg-[#E52421] hover:bg-[#FF3030] disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {resubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmission...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{t.dashboard.resubmitButton}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================
                5. MAIN DOSSIER & STATUS OVERVIEW
               ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Disciplines */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
                  {/* Reference & Status Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <span className="font-mono text-xs uppercase text-[#9E9EA8] tracking-widest block">
                        {t.dashboard.refNumber}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xl sm:text-2xl font-black text-white">
                          {activeRegistration.reference}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(activeRegistration.reference)}
                          title="Copier la référence"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9E9EA8] hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedRef ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-xs uppercase text-[#9E9EA8] tracking-widest block mb-1">
                        {t.dashboard.currentStatus}
                      </span>
                      <StatusBadge status={activeRegistration.status} size="lg" />
                    </div>
                  </div>

                  {/* Identity Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono text-[#9E9EA8] uppercase block">
                        Pratiquant
                      </span>
                      <span className="font-display font-bold text-sm text-white uppercase block mt-0.5">
                        {selectedParticipant.firstName} {selectedParticipant.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#9E9EA8] uppercase block">
                        Âge & Catégorie
                      </span>
                      <span className="font-mono text-sm text-white font-bold block mt-0.5">
                        {calculateAge(selectedParticipant.dateOfBirth)} ans (
                        {selectedParticipant.isMinor ? "Mineur" : "Majeur"})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#9E9EA8] uppercase block">
                        Groupe Sanguin
                      </span>
                      <span className="font-mono text-sm text-[#FFD21F] font-bold block mt-0.5">
                        {selectedParticipant.bloodType || "Non renseigné"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#9E9EA8] uppercase block">
                        Lieu de Naissance
                      </span>
                      <span className="font-body text-sm text-white block mt-0.5 truncate">
                        {selectedParticipant.placeOfBirth}
                      </span>
                    </div>
                  </div>

                  {/* Enrolled Disciplines */}
                  <div className="space-y-3">
                    <span className="font-mono text-xs uppercase text-[#9E9EA8] tracking-widest block">
                      {t.dashboard.selectedDisciplines} ({activeRegistration.season.label})
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {activeRegistration.disciplines.map((d) => (
                        <div
                          key={d.id}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2"
                        >
                          <Activity className="w-4 h-4 text-[#E52421]" />
                          <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                            {locale === "ar"
                              ? d.discipline.nameAr
                              : locale === "en"
                              ? d.discipline.nameEn
                              : d.discipline.nameFr}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step Progression Timeline */}
                  <div className="space-y-3 pt-2">
                    <span className="font-mono text-[10px] uppercase text-[#9E9EA8] tracking-widest block">
                      Progression de l&apos;adhésion
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          1. Dossier Soumis
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 ${
                          activeRegistration.status === "UNDER_REVIEW" ||
                          activeRegistration.status === "SUBMITTED"
                            ? "bg-[#FFD21F]/10 border-[#FFD21F]/40 text-[#FFD21F]"
                            : activeRegistration.status === "NEEDS_CORRECTION" ||
                              activeRegistration.status === "REJECTED"
                            ? "bg-[#FF3030]/10 border-[#FF3030]/40 text-[#FF3030]"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-mono font-bold">
                          2. Examen Club
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 ${
                          activeRegistration.status === "PAYMENT_PENDING"
                            ? "bg-[#FFD21F]/10 border-[#FFD21F]/40 text-[#FFD21F]"
                            : activeRegistration.payments.length > 0 ||
                              activeRegistration.status === "PAID" ||
                              activeRegistration.status === "ACTIVE"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 border-white/10 text-[#9E9EA8]"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-mono font-bold">
                          3. Cotisation
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 ${
                          activeRegistration.status === "ACTIVE" ||
                          activeRegistration.status === "PAID"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                            : "bg-white/5 border-white/10 text-[#9E9EA8]"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-mono font-bold">
                          4. Membre Actif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    6. VERIFIED DOCUMENTS VAULT
                   ======================================================== */}
                <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#E52421]" />
                      <span>{t.dashboard.myDocuments}</span>
                    </h3>
                    <span className="text-xs font-mono text-[#9E9EA8]">
                      {activeRegistration.documents.length} pièces archivées
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeRegistration.documents.map((doc) => {
                      const labelMap: Record<string, string> = {
                        PHOTO: "Photo d'identité",
                        NATIONAL_ID: "Pièce d'identité / Livret",
                        MEDICAL_CERTIFICATE: "Certificat Médical",
                        PARENT_NATIONAL_ID: "Pièce d'identité Tuteur",
                      };

                      return (
                        <div
                          key={doc.id}
                          className="p-3.5 bg-[#0A0A0D]/90 border border-white/10 rounded-2xl flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                        >
                          <div className="min-w-0">
                            <span className="font-display font-bold text-xs text-white uppercase block truncate">
                              {labelMap[doc.type] || doc.type}
                            </span>
                            <span className="font-mono text-[10px] text-[#9E9EA8] block truncate">
                              {doc.originalFilename} • {(doc.fileSize / 1024).toFixed(0)} KB
                            </span>
                            <div className="mt-1">
                              {doc.status === "VALID" ? (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Validé
                                </span>
                              ) : doc.status === "INVALID" ? (
                                <span className="text-[10px] font-mono text-[#FF3030] font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Rejeté
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-[#FFD21F] font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> En examen
                                </span>
                              )}
                            </div>
                          </div>

                          <a
                            href={`/api/documents/${doc.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono flex items-center gap-1 transition-colors shrink-0"
                            title="Ouvrir le document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Voir</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ========================================================
                    7. PAYMENTS & OFFICIAL RECEIPTS
                   ======================================================== */}
                {activeRegistration.payments.length > 0 && (
                  <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        <span>Règlements & Reçus Officiels</span>
                      </h3>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {activeRegistration.payments.length} reçu(s) émis
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activeRegistration.payments.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 bg-[#0A0A0D]/90 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-white">
                                {p.receiptNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                                {p.status}
                              </span>
                            </div>
                            <p className="font-body text-xs text-[#9E9EA8] mt-1">
                              {p.paymentPurpose} • Espèces au siège
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-display font-black text-lg text-emerald-400">
                              {p.amount.toLocaleString()} DZD
                            </span>
                            <Link
                              href={`/receipt/${p.receiptNumber}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 flex items-center gap-1.5 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Reçu PDF</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Col: Electronic Membership Card & Official PDFs */}
              <div className="space-y-6">
                {/* Electronic Membership Card */}
                {["ACCEPTED", "PAYMENT_PENDING", "PAID", "ACTIVE"].includes(
                  activeRegistration.status
                ) ? (
                  <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-display font-black text-base uppercase text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#FFD21F]" />
                        <span>Carte Officielle 2026</span>
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        Active
                      </span>
                    </div>

                    <MembershipCard
                      participant={{
                        id: selectedParticipant.id,
                        firstName: selectedParticipant.firstName,
                        lastName: selectedParticipant.lastName,
                        dateOfBirth: selectedParticipant.dateOfBirth,
                        bloodType: selectedParticipant.bloodType,
                        isMinor: selectedParticipant.isMinor,
                        phone: userPhone,
                        membershipCardNumber: selectedParticipant.membershipCardNumber,
                      }}
                      registration={{
                        reference: activeRegistration.reference,
                        status: activeRegistration.status,
                        season: {
                          code: activeRegistration.season.code,
                          label: activeRegistration.season.label,
                        },
                        disciplines: activeRegistration.disciplines.map((d) => ({
                          discipline: {
                            id: d.discipline.id,
                            slug: d.discipline.slug,
                            nameFr: d.discipline.nameFr,
                            nameAr: d.discipline.nameAr,
                          },
                        })),
                      }}
                      photoDocId={photoDocId}
                    />
                  </div>
                ) : (
                  <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FFD21F]">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-black text-sm uppercase text-white">
                      Carte de membre en attente
                    </h4>
                    <p className="font-body text-xs text-[#9E9EA8] leading-relaxed">
                      Votre carte électronique avec QR code sera générée dès la validation du dossier par l&apos;encadrement.
                    </p>
                  </div>
                )}

                {/* Official Paperwork PDF Downloads */}
                <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-3">
                  <h4 className="font-display font-black text-sm uppercase text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <FileText className="w-4 h-4 text-[#E52421]" />
                    <span>Documents Officiels</span>
                  </h4>

                  <div className="space-y-2">
                    <a
                      href={`/api/paperwork/data?reference=${activeRegistration.reference}&type=confirmation`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-[#0A0A0D]/90 border border-white/10 rounded-xl flex items-center justify-between text-xs font-mono text-[#9E9EA8] hover:text-white hover:border-[#E52421]/40 transition-colors"
                    >
                      <span className="truncate">Récépissé de Dépôt</span>
                      <Download className="w-3.5 h-3.5 text-[#E52421] shrink-0" />
                    </a>

                    <a
                      href={`/api/paperwork/data?reference=${activeRegistration.reference}&type=dossier`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 bg-[#0A0A0D]/90 border border-white/10 rounded-xl flex items-center justify-between text-xs font-mono text-[#9E9EA8] hover:text-white hover:border-[#E52421]/40 transition-colors"
                    >
                      <span className="truncate">Dossier d&apos;Adhésion Complet</span>
                      <Download className="w-3.5 h-3.5 text-[#E52421] shrink-0" />
                    </a>

                    {selectedParticipant.isMinor && (
                      <a
                        href={`/api/paperwork/data?reference=${activeRegistration.reference}&type=parental`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full p-3 bg-[#0A0A0D]/90 border border-white/10 rounded-xl flex items-center justify-between text-xs font-mono text-[#FFD21F] hover:border-[#FFD21F]/40 transition-colors"
                      >
                        <span className="truncate">Autorisation Parentale APC</span>
                        <Download className="w-3.5 h-3.5 text-[#FFD21F] shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                8. UPCOMING CLUB EVENTS & SESSIONS
               ======================================================== */}
            <div
              id="events"
              className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display font-black text-xl uppercase text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#FFD21F]" />
                    <span>{t.dashboard.eventsTitle} // Sessions & Sorties</span>
                  </h3>
                  <p className="text-xs text-[#9E9EA8] mt-1 font-body">
                    Agenda officiel des entraînements extérieurs, masterclasses et jams de l&apos;Académie ADD Oran. Confirmez votre présence pour {selectedParticipant.firstName}.
                  </p>
                </div>
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD21F]" />
                  <span>{events.length} Sessions Ouvertes</span>
                </span>
              </div>

              {eventsLoading ? (
                <div className="py-12 text-center text-[#9E9EA8] font-mono text-xs">
                  Chargement de l&apos;agenda des événements...
                </div>
              ) : events.length === 0 ? (
                <div className="py-8 text-center text-[#9E9EA8] font-body text-sm">
                  Aucun événement programmé pour le moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {events.map((ev) => {
                    const evDate = new Date(ev.date);
                    const formattedDate = evDate.toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const isUpdating = togglingEventId === ev.id;

                    return (
                      <div
                        key={ev.id}
                        className="p-5 bg-[#0A0A0D]/90 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#E52421]/40 transition-all group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#E52421]/15 text-[#FF3030] border border-[#E52421]/30 text-[10px] font-mono font-bold uppercase">
                              {ev.discipline}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {ev.attendeeCount} participant(s)
                            </span>
                          </div>

                          <h4 className="font-display font-black text-base text-white uppercase group-hover:text-[#FFD21F] transition-colors">
                            {ev.title}
                          </h4>

                          <p className="font-body text-xs text-[#9E9EA8] leading-relaxed line-clamp-3">
                            {ev.description}
                          </p>

                          <div className="space-y-1.5 pt-2 border-t border-white/5 font-mono text-xs text-gray-300">
                            <div className="flex items-center gap-2 text-white/90">
                              <Clock className="w-3.5 h-3.5 text-[#FFD21F] shrink-0" />
                              <span className="capitalize">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin className="w-3.5 h-3.5 text-[#E52421] shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleToggleEventAttendance(ev.id)}
                          className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                            ev.isAttending
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          }`}
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : ev.isAttending ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{t.dashboard.rsvpConfirmed}</span>
                            </>
                          ) : (
                            <span>{t.dashboard.rsvpJoin}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ========================================================
          9. QUICK ADD CHILD MODAL (PARENT MULTI-CHILD ENROLLMENT)
         ======================================================== */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#141419] border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display font-black text-xl uppercase text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#E52421]" />
                  <span>Inscrire un autre enfant</span>
                </h3>
                <p className="text-xs text-[#9E9EA8] font-body mt-0.5">
                  Rattachement immédiat sous votre compte parent ({userPhone}).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddChildModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addChildError && (
              <div className="p-4 bg-[#E52421]/15 border border-[#E52421]/40 rounded-2xl text-[#FF8585] font-mono text-xs flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-[#FF3030] shrink-0" />
                <span>{addChildError}</span>
              </div>
            )}
            {addChildSuccess && (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{addChildSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddChildSubmit} className="space-y-6">
              {/* Identity Details */}
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block">
                  1. Identité de l&apos;enfant
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-[#9E9EA8] block mb-1">
                      Prénom de l&apos;enfant *
                    </label>
                    <input
                      type="text"
                      required
                      value={childFirstName}
                      onChange={(e) => setChildFirstName(e.target.value)}
                      placeholder="Ex: Yanis"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white font-body text-sm focus:border-[#E52421] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-[#9E9EA8] block mb-1">
                      Nom de famille *
                    </label>
                    <input
                      type="text"
                      required
                      value={childLastName}
                      onChange={(e) => setChildLastName(e.target.value)}
                      placeholder="Ex: Benali"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white font-body text-sm focus:border-[#E52421] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-mono text-xs text-[#9E9EA8] block mb-1">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={childDob}
                      onChange={(e) => setChildDob(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white font-body text-sm focus:border-[#E52421] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-[#9E9EA8] block mb-1">
                      Lieu de naissance *
                    </label>
                    <input
                      type="text"
                      required
                      value={childPob}
                      onChange={(e) => setChildPob(e.target.value)}
                      placeholder="Ex: Oran"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white font-body text-sm focus:border-[#E52421] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-[#9E9EA8] block mb-1">
                      Groupe sanguin
                    </label>
                    <select
                      value={childBloodType}
                      onChange={(e) => setChildBloodType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0D] border border-white/10 text-white font-body text-sm focus:border-[#E52421] focus:outline-none cursor-pointer"
                    >
                      <option value="">Sélectionner</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Disciplines Selection */}
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block">
                  2. Discipline(s) sportive(s)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { slug: "parkour", name: "Parkour" },
                    { slug: "escalade-montagne", name: "Escalade" },
                    { slug: "trail", name: "Trail" },
                  ].map((disc) => {
                    const isChecked = childDisciplines.includes(disc.slug);
                    return (
                      <button
                        type="button"
                        key={disc.slug}
                        onClick={() => {
                          setChildDisciplines((prev) =>
                            isChecked
                              ? prev.filter((s) => s !== disc.slug)
                              : [...prev, disc.slug]
                          );
                        }}
                        className={`p-3 rounded-xl border font-mono text-xs font-bold uppercase transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? "bg-[#E52421]/20 border-[#E52421] text-white"
                            : "bg-[#0A0A0D] border-white/10 text-[#9E9EA8]"
                        }`}
                      >
                        <span>{disc.name}</span>
                        {isChecked && <Check className="w-4 h-4 text-[#E52421]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Document Files */}
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block">
                  3. Pièces justificatives de l&apos;enfant
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#0A0A0D] rounded-xl border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#9E9EA8] block">
                      Photo d&apos;identité *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => setChildPhoto(e.target.files?.[0] || null)}
                      className="text-xs text-[#9E9EA8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs w-full"
                    />
                  </div>
                  <div className="p-3 bg-[#0A0A0D] rounded-xl border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#9E9EA8] block">
                      Pièce d&apos;identité / Livret *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/*,application/pdf"
                      onChange={(e) => setChildNationalId(e.target.files?.[0] || null)}
                      className="text-xs text-[#9E9EA8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs w-full"
                    />
                  </div>
                  <div className="p-3 bg-[#0A0A0D] rounded-xl border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#9E9EA8] block">
                      Certificat Médical *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/*,application/pdf"
                      onChange={(e) => setChildMedical(e.target.files?.[0] || null)}
                      className="text-xs text-[#9E9EA8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs w-full"
                    />
                  </div>
                  <div className="p-3 bg-[#0A0A0D] rounded-xl border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#FFD21F] block">
                      Pièce d&apos;identité du Tuteur
                    </label>
                    <div className="flex items-center gap-2 mb-1.5">
                      <input
                        type="checkbox"
                        id="reuseParentDoc"
                        checked={reuseParentId}
                        onChange={(e) => setReuseParentId(e.target.checked)}
                        className="rounded accent-[#E52421]"
                      />
                      <label htmlFor="reuseParentDoc" className="text-[10px] font-body text-[#9E9EA8]">
                        Utiliser la pièce du tuteur déjà enregistrée
                      </label>
                    </div>
                    {!reuseParentId && (
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setChildParentalId(e.target.files?.[0] || null)}
                        className="text-xs text-[#9E9EA8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-[#141419] file:text-white file:border file:border-white/10 file:font-mono file:text-xs w-full"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Legal Guardian Declaration */}
              <div className="p-4 bg-[#0A0A0D] rounded-2xl border border-white/10 space-y-3">
                <div>
                  <label className="font-mono text-xs text-[#9E9EA8] block mb-1">
                    Nom complet du tuteur légal
                  </label>
                  <input
                    type="text"
                    value={childGuardianName}
                    onChange={(e) => setChildGuardianName(e.target.value)}
                    placeholder="Nom et prénom du responsable légal"
                    className="w-full px-4 py-2 rounded-xl bg-[#141419] border border-white/10 text-white font-body text-xs focus:border-[#E52421] focus:outline-none"
                  />
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={childParentalAccepted}
                    onChange={(e) => setChildParentalAccepted(e.target.checked)}
                    className="mt-0.5 rounded accent-[#E52421]"
                  />
                  <span className="text-xs font-body text-[#9E9EA8]">
                    En tant que représentant légal, j&apos;autorise cet enfant à pratiquer les activités du club ADD Oran et certifie l&apos;exactitude des informations.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-[#9E9EA8] hover:text-white font-mono text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addingChild}
                  className="px-6 py-2.5 bg-[#E52421] hover:bg-[#FF3030] disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {addingChild ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Valider l&apos;inscription</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
