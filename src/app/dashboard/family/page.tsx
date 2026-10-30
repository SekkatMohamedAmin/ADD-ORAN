"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Users,
  UserPlus,
  Shield,
  FileText,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  MapPin,
  Heart,
  Sparkles,
  Download,
  Coins,
} from "lucide-react";

export default function DashboardFamilyPage() {
  const { t } = useLanguage();
  const {
    userPhone,
    participants,
    selectedParticipantId,
    setSelectedParticipantId,
    selectedParticipant,
    isFamilyAccount,
    openAddChildModal,
  } = usePortal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#FFD21F]" />
            <h1 className="text-2xl font-black font-display text-white">
              {isFamilyAccount ? "Espace Famille & Tuteur Légal" : "Mon Profil Adhérent"}
            </h1>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Compte utilisateur rattaché au numéro : <span className="text-white font-bold">{userPhone}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={openAddChildModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#c91d1a] text-white text-xs font-bold shadow-lg shadow-[#E52421]/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inscrire un autre enfant</span>
        </button>
      </div>

      {/* Children / Adherents Roster */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-white/70 font-bold flex items-center gap-2">
          <span>Adhérents enregistrés sur ce compte ({participants.length})</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {participants.map((p) => {
            const age =
              new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
            const isSelected = p.id === selectedParticipantId;
            const reg = p.registrations?.[0];
            const hasCorrection =
              reg?.status === "NEEDS_CORRECTION" || reg?.status === "REJECTED";

            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border transition-all space-y-5 ${
                  isSelected
                    ? "bg-[#14141C] border-[#E52421] shadow-xl ring-1 ring-[#E52421]/40"
                    : "bg-[#111116] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                        isSelected
                          ? "bg-[#E52421] text-white"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {p.firstName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">
                          {p.firstName} {p.lastName}
                        </h3>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E52421]/20 text-[#E52421] border border-[#E52421]/30">
                            Actif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 font-mono mt-0.5">
                        {age} ans • Né(e) le {new Date(p.dateOfBirth).toLocaleDateString("fr-FR")} à {p.placeOfBirth || "Oran"}
                      </p>
                    </div>
                  </div>

                  {reg && <StatusBadge status={reg.status} />}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono text-white/70">
                  <div>
                    <span className="text-[10px] text-white/40 block">RÉFÉRENCE</span>
                    <span className="text-[#FFD21F] font-bold">
                      {reg?.reference || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">GROUPE SANGUIN</span>
                    <span className="text-white font-bold">
                      {p.bloodType || "Non renseigné"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">STATUT TUTEUR</span>
                    <span className="text-white">
                      {p.isMinor ? "Autorisation accordée" : "Majeur autonome"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">CARTE CLUB</span>
                    <span className="text-white">
                      {p.membershipCardNumber || "En attente"}
                    </span>
                  </div>
                </div>

                {/* Warning flag */}
                {hasCorrection && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Pièces à corriger pour ce dossier</span>
                    </span>
                    <Link
                      href="/dashboard/documents"
                      onClick={() => setSelectedParticipantId(p.id)}
                      className="font-bold underline text-red-200"
                    >
                      Corriger
                    </Link>
                  </div>
                )}

                {/* Disciplines */}
                {reg?.disciplines && reg.disciplines.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {reg.disciplines.map((d) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-white/70 border border-white/5"
                      >
                        {d.discipline.nameFr}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setSelectedParticipantId(p.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-white/10 text-white border border-white/15"
                        : "bg-[#E52421]/15 hover:bg-[#E52421]/25 text-white border border-[#E52421]/30"
                    }`}
                  >
                    {isSelected ? "Dossier en cours" : "Gérer ce dossier"}
                  </button>

                  <Link
                    href="/dashboard/documents"
                    onClick={() => setSelectedParticipantId(p.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Voir les documents"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/dashboard/card"
                    onClick={() => setSelectedParticipantId(p.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Voir la carte"
                  >
                    <CreditCard className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/dashboard/payments"
                    onClick={() => setSelectedParticipantId(p.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Voir les cotisations & reçus"
                  >
                    <Coins className="w-4 h-4 text-[#FFD21F]" />
                  </Link>

                  {reg && (
                    <a
                      href={`/paperwork/${reg.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E52421] text-white/60 hover:text-white transition-colors"
                      title="Télécharger le dossier complet officiel (PDF)"
                    >
                      <Download className="w-4 h-4 text-[#FFD21F]" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Another Child Callout Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FFD21F]/10 via-transparent to-transparent border border-[#FFD21F]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-display font-black text-lg text-white">
            Vous avez un autre enfant ou proche à inscrire pour la saison 2026 ?
          </h3>
          <p className="text-xs text-white/60 max-w-xl">
            Vous n&apos;avez pas besoin de créer un second compte. Ajoutez votre enfant directement à votre espace familial pour centraliser les documents, cartes et suivis d&apos;entraînements.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddChildModal}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFD21F] hover:bg-[#e6bd19] text-black font-bold text-xs shadow-lg shadow-[#FFD21F]/20 shrink-0 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inscrire un autre enfant</span>
        </button>
      </div>
    </div>
  );
}
