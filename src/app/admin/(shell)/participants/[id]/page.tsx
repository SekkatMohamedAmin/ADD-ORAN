"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import {
  ArrowLeft as FiArrowLeft,
  User as FiUser,
  Phone as FiPhone,
  Mail as FiMail,
  MapPin as FiMapPin,
  Calendar as FiCalendar,
  Activity as FiActivity,
  FileText as FiFileText,
  DollarSign as FiDollarSign,
  Clock as FiClock,
  ExternalLink as FiExternalLink,
  AlertTriangle as FiAlertTriangle,
  Shield as FiShield,
  CreditCard as FiCreditCard,
  CheckCircle2 as FiCheckCircle,
} from "lucide-react";

interface ParticipantProfile {
  id: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  gender?: string | null;
  dateOfBirth: string;
  placeOfBirth: string;
  bloodType?: string | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  isMinor: boolean;
  rfidCardId?: string | null;
  membershipCardNumber?: string | null;
  createdAt: string;
  user: {
    phone: string;
    role: string;
    createdAt: string;
  };
  registrations: Array<{
    id: string;
    reference: string;
    status: string;
    createdAt: string;
    season: {
      id: string;
      name: string;
      code: string;
    };
    disciplines: Array<{
      discipline: {
        id: string;
        slug: string;
        nameFr: string;
        nameAr: string;
      };
    }>;
    payments: Array<{
      id: string;
      receiptNumber: string;
      amount: number;
      paymentPurpose: string;
      status: string;
      paidAt?: string | null;
      createdAt: string;
    }>;
    documents: Array<{
      id: string;
      type: string;
      status: string;
      mimeType: string;
      fileSize: number;
    }>;
  }>;
  documents: Array<{
    id: string;
    type: string;
    status: string;
    mimeType: string;
    fileSize: number;
    createdAt: string;
  }>;
}

export default function ParticipantProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t, locale, isRtl } = useLanguage();

  const [member, setMember] = useState<ParticipantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/participants/${id}`);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Adhérent introuvable.");
      }
      const data = await res.json();
      setMember(data.participant);
    } catch (err: any) {
      setError(err.message || "Erreur de chargement du profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400 gap-4">
        <div className="w-12 h-12 border-4 border-[#E52421] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Chargement du profil adhérent...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-[#E52421]/10 text-[#E52421] rounded-2xl flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Adhérent introuvable</h2>
        <p className="text-sm text-gray-400">{error || "Cet adhérent n'existe pas."}</p>
        <Link
          href="/admin/participants"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1C24] text-white hover:bg-[#252530] rounded-xl text-sm font-medium transition"
        >
          <FiArrowLeft className="w-4 h-4" />
          Retour au répertoire
        </Link>
      </div>
    );
  }

  const age = Math.floor(
    (new Date().getTime() - new Date(member.dateOfBirth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Profile Banner with Background Image */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 bg-[#141419] shadow-xl">
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <Image
            src="/images/hero/hero-trail.jpg"
            alt="Profile Header Backdrop"
            fill
            sizes="100vw"
            className="object-cover object-top opacity-20 filter contrast-125 grayscale mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D] via-[#0A0A0D]/90 to-[#E52421]/20" />
          <div className="absolute inset-0 sports-grid-pattern opacity-30" />
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/participants"
              className="p-3 bg-[#1C1C24]/80 hover:bg-[#252530] text-gray-400 hover:text-white rounded-2xl border border-white/10 transition flex items-center justify-center backdrop-blur-sm"
              title="Retour au répertoire"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {member.firstName} {member.lastName}
                </h1>
                {member.isMinor ? (
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg">
                    Mineur
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg">
                    Majeur
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2 font-mono">
                <span className="text-[#FFD21F] font-bold">ID: {member.id}</span>
                <span>•</span>
                <span>Membre depuis le {new Date(member.createdAt).toLocaleDateString("fr-FR")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity & Card Info */}
        <div className="space-y-6">
          <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <FiUser className="w-4 h-4 text-[#E52421]" />
              Fiche Individuelle
            </h3>

            <div className="space-y-3.5 text-sm">
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Nom & Prénom (Latin)</span>
                <span className="font-bold text-white text-base">
                  {member.firstName} {member.lastName}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Nom & Prénom (Arabe)</span>
                <span className="font-arabic text-lg text-white font-medium" dir="rtl">
                  {member.firstNameAr || member.lastNameAr
                    ? `${member.lastNameAr || ""} ${member.firstNameAr || ""}`
                    : "—"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Date de Naissance</span>
                  <span className="text-gray-200 text-xs flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(member.dateOfBirth).toLocaleDateString("fr-FR")} ({age} ans)
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Groupe Sanguin</span>
                  <span className="font-mono font-bold text-[#FFD21F]">
                    {member.bloodType || "Inconnu"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Lieu de Naissance</span>
                <span className="text-gray-200 text-xs">{member.placeOfBirth || "—"}</span>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-xs text-gray-400 block mb-0.5">Téléphone Principal</span>
                <span className="text-gray-200 font-mono text-xs flex items-center gap-1.5">
                  <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`tel:${member.phone}`} className="hover:text-white">
                    {member.phone}
                  </a>
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-0.5">WhatsApp</span>
                <span className="text-gray-200 font-mono text-xs">
                  {member.whatsapp ? (
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {member.whatsapp} <FiExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Adresse Email</span>
                <span className="text-gray-200 text-xs flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5 text-gray-400" />
                  {member.email ? <a href={`mailto:${member.email}`}>{member.email}</a> : "—"}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Adresse de Résidence</span>
                <span className="text-gray-200 text-xs flex items-start gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  {member.address || "Non renseignée"}
                </span>
              </div>
            </div>
          </div>

          {/* Club Card / RFID Badge */}
          <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <FiCreditCard className="w-4 h-4 text-[#FFD21F]" />
              Carte Club & Accès
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block">N° Carte Adhérent</span>
                <span className="font-mono font-bold text-white text-sm">
                  {member.membershipCardNumber || "Non attribué"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Identifiant Badge RFID</span>
                <span className="font-mono text-gray-300">
                  {member.rfidCardId || "Non assigné"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Multi-Season Registration History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FiActivity className="w-4 h-4 text-[#E52421]" />
                  Historique des Inscriptions & Saisons ({member.registrations.length})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Suivi pluriannuel du parcours de l'adhérent au sein du club
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {member.registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-5 bg-[#1C1C24] border border-white/5 rounded-2xl space-y-4 hover:border-white/10 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white">
                          Saison {reg.season.name || reg.season.code}
                        </span>
                        <StatusBadge status={reg.status} />
                      </div>
                      <p className="text-xs font-mono text-[#FFD21F] mt-0.5 font-bold">
                        {reg.reference}
                      </p>
                    </div>

                    <Link
                      href={`/admin/registrations/${reg.id}`}
                      className="px-3.5 py-1.5 bg-[#252530] hover:bg-[#303040] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      Ouvrir dossier <FiExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Disciplines in season */}
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Disciplines pratiquées :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {reg.disciplines.map((d: any) => (
                        <span
                          key={d.discipline.id}
                          className="px-2.5 py-1 bg-[#141419] text-gray-200 text-xs font-medium rounded-lg border border-white/5"
                        >
                          {d.discipline.nameFr || d.discipline.slug}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Payments in season */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-gray-400">Règlements enregistrés : </span>
                      {reg.payments.length > 0 ? (
                        <span className="text-emerald-400 font-bold font-mono">
                          {reg.payments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} DZD
                          {" "}({reg.payments.length} versement(s))
                        </span>
                      ) : (
                        <span className="text-amber-400 italic">Aucun règlement</span>
                      )}
                    </div>
                    <span className="text-gray-500 font-mono text-[11px]">
                      Inscrit le {new Date(reg.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))}

              {member.registrations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Aucune inscription archivée pour cet adhérent.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
