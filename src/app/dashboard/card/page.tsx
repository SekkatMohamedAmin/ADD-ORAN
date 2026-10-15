"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import MembershipCard from "@/components/MembershipCard";
import {
  CreditCard,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
} from "lucide-react";

export default function DashboardCardPage() {
  const { t } = useLanguage();
  const { selectedParticipant, activeRegistration } = usePortal();

  if (!selectedParticipant || !activeRegistration) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white/60">
        Aucun dossier actif trouvé.
      </div>
    );
  }

  const photoDoc = activeRegistration.documents?.find(
    (d) => d.type === "PHOTO"
  );
  const photoDocId = photoDoc?.id || null;

  const isActive = activeRegistration.status === "ACTIVE";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-[#E52421]" />
            <h1 className="text-2xl font-black font-display text-white">
              Carte d&apos;Adhérent Électronique
            </h1>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Licence officielle de {selectedParticipant.firstName} {selectedParticipant.lastName} • Saison 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/card/${selectedParticipant.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all"
          >
            <Printer className="w-4 h-4 text-[#FFD21F]" />
            <span>Imprimer la Carte</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Status Warning if not active */}
      {!isActive && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <Clock className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold">Dossier en cours de finalisation : </span>
            Cette carte est un aperçu préliminaire. Elle sera activée et reconnue par les scanners du club dès validation de votre cotisation.
          </div>
        </div>
      )}

      {/* Card Display Container */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-[#14141B] via-[#0E0E13] to-[#0A0A0D] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E52421]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <MembershipCard
            participant={{
              id: selectedParticipant.id,
              firstName: selectedParticipant.firstName,
              lastName: selectedParticipant.lastName,
              dateOfBirth: selectedParticipant.dateOfBirth,
              bloodType: selectedParticipant.bloodType,
              isMinor: selectedParticipant.isMinor,
              phone: selectedParticipant.phone,
              emergencyPhone: selectedParticipant.phone,
              membershipCardNumber:
                selectedParticipant.membershipCardNumber || "ADD-CARD-2026",
            }}
            registration={{
              reference: activeRegistration.reference,
              status: activeRegistration.status,
              season: {
                code: activeRegistration.season.code,
                label: activeRegistration.season.label,
              },
              disciplines: activeRegistration.disciplines,
            }}
            photoDocId={photoDocId}
          />
        </div>

        <p className="text-xs text-white/40 font-mono mt-6 text-center">
          Cliquez sur la carte ou sur le bouton de rotation pour afficher le verso
        </p>
      </div>

      {/* Features & Usage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111116] border border-white/10 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#FFD21F]">
            <QrCode className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-white">Check-in par QR Code</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            Présentez le code QR depuis votre smartphone à l&apos;entrée des salles et des parcs d&apos;entraînement partenaires.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111116] border border-white/10 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-white">Couverture Assurance</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            Certifie l&apos;adhésion en règle et la couverture d&apos;assurance responsabilité civile pour les disciplines déclarées.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111116] border border-white/10 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#E52421]">
            <Printer className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-white">Format Badge Plastifié</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            Vous pouvez imprimer ou plastifier le badge au format carte de crédit (CR80) via le lien d&apos;impression dédié.
          </p>
        </div>
      </div>
    </div>
  );
}
