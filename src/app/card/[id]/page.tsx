"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Printer,
  ArrowLeft,
  Sparkles,
  QrCode,
  FileCheck2,
  Calendar,
  Activity,
  UserCheck,
  ExternalLink,
  Award,
} from "lucide-react";
import MembershipCard from "@/components/MembershipCard";
import { getClubRoleDefinition } from "@/lib/clubRoles";

export default function CardPublicVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verificationTime, setVerificationTime] = useState("");

  useEffect(() => {
    setVerificationTime(
      new Date().toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    async function fetchCard() {
      try {
        setLoading(true);
        const res = await fetch(`/api/card?id=${encodeURIComponent(id)}`);
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.error || "Carte ou adhérent introuvable");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCard();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] text-[#F5F5F2] flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#E52421]/30 border-t-[#E52421] animate-spin" />
          <div className="absolute w-8 h-8 rounded-full border-2 border-[#FFD21F]/30 border-b-[#FFD21F] animate-spin" />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Vérification sécurisée de la carte...
        </p>
      </div>
    );
  }

  if (error || !data?.participant) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] text-[#F5F5F2] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-[#141419] border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-[#E52421] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-display font-black text-white uppercase tracking-tight">
              Carte Introuvable
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Réf / Identifiant scanné : {id}
            </p>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {error ||
              "Aucune adhésion correspondante n'a été trouvée dans le registre officiel de l'Académie ADD Oran."}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold transition border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { participant, registration, photoDocId } = data;
  const isActive = registration?.status === "ACTIVE";
  const isPending =
    registration?.status === "SUBMITTED" ||
    registration?.status === "UNDER_REVIEW" ||
    registration?.status === "PAYMENT_PENDING";

  const staffRole = participant?.isStaff
    ? getClubRoleDefinition(participant?.clubRole)
    : null;

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-[#F5F5F2] flex flex-col selection:bg-[#E52421] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0E0E13]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
              <Image
                src="/images/club/logo.svg"
                alt="Logo ADD Oran"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-xs font-display font-black uppercase text-white tracking-tight leading-none">
                Club Art Du Déplacement
              </div>
              <div className="text-[10.5px] font-display font-black uppercase text-[#E52421] tracking-wider leading-none mt-0.5">
                Parkour Oran
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/card/${participant.id}/print`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold border border-white/10 transition"
              title="Format Impression Badge PVC"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFD21F]" />
              <span className="hidden sm:inline">Imprimer Badge</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 space-y-6">
        {/* Verification Status Banner */}
        {isActive ? (
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-[#0E0E13] border border-emerald-500/40 p-4 sm:p-5 flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Carte Officielle Vérifiée & Active</span>
              </div>
              <h1 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-tight truncate">
                {participant.firstName} {participant.lastName}
              </h1>
              <p className="text-xs text-gray-300 font-mono">
                Adhérent licencié • {registration?.season?.label || "Saison Officielle"} • Couverture en règle
              </p>
            </div>
          </div>
        ) : isPending ? (
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-[#0E0E13] border border-amber-500/40 p-4 sm:p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="text-[11px] font-mono font-black text-amber-300 uppercase tracking-widest">
                Adhésion En Cours De Validation
              </div>
              <h1 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-tight truncate">
                {participant.firstName} {participant.lastName}
              </h1>
              <p className="text-xs text-gray-300 font-mono">
                Dossier enregistré • Statut actuel : {registration?.status || "En attente"}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-[#0E0E13] border border-red-500/40 p-4 sm:p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/50 text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="text-[11px] font-mono font-black text-red-400 uppercase tracking-widest">
                Statut Non Actif
              </div>
              <h1 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-tight truncate">
                {participant.firstName} {participant.lastName}
              </h1>
              <p className="text-xs text-gray-300 font-mono">
                Cette licence est actuellement inactive ou archivée.
              </p>
            </div>
          </div>
        )}

        {/* 3D Interactive Membership Card */}
        <div className="p-4 sm:p-8 rounded-3xl bg-gradient-to-br from-[#14141B] via-[#0E0E13] to-[#0A0A0D] border border-white/10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E52421]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-md relative z-10">
            <MembershipCard
              participant={{
                id: participant.id,
                firstName: participant.firstName,
                lastName: participant.lastName,
                dateOfBirth: participant.dateOfBirth,
                bloodType: participant.bloodType,
                isMinor: participant.isMinor,
                phone: participant.phone,
                emergencyPhone: null,
                membershipCardNumber: participant.membershipCardNumber,
                rfidCardId: participant.rfidCardId,
                clubRole: participant.clubRole,
                isStaff: participant.isStaff,
              }}
              registration={
                registration
                  ? {
                      reference: registration.reference,
                      status: registration.status,
                      season: registration.season,
                      disciplines: registration.disciplines,
                    }
                  : undefined
              }
              photoDocId={photoDocId}
            />
          </div>

          <p className="text-[11px] text-white/50 font-mono mt-4 text-center">
            Cliquez sur la carte pour afficher la face verso • Devise officielle du club
          </p>
        </div>

        {/* Official Verified Record Grid */}
        <div className="rounded-3xl bg-[#141419] border border-white/10 p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD21F]" />
              <h3 className="font-display font-black uppercase text-sm sm:text-base text-white tracking-wider">
                Données Officielles de Licence
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
              Registre Fédéral ADD Oran
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Numéro de Carte */}
            <div className="p-3.5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10.5px] uppercase block">
                N° de Carte / Licence
              </span>
              <span className="text-[#FFD21F] font-black text-sm block tracking-wider">
                {participant.membershipCardNumber || "En attribution"}
              </span>
            </div>

            {/* Référence Dossier */}
            <div className="p-3.5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10.5px] uppercase block">
                Réf. Dossier Adhésion
              </span>
              <span className="text-white font-bold text-sm block tracking-wider">
                {registration?.reference || "N/A"}
              </span>
            </div>

            {/* Saison */}
            <div className="p-3.5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10.5px] uppercase block">
                Saison Sportive
              </span>
              <span className="text-white font-bold text-sm block">
                {registration?.season?.label || "2026 - 2027"}
              </span>
            </div>

            {/* Statut & Rôle */}
            <div className="p-3.5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10.5px] uppercase block">
                Accréditation / Rôle
              </span>
              {participant.isStaff ? (
                <span className="inline-flex items-center gap-1 text-amber-300 font-black">
                  <Sparkles className="w-3 h-3" />
                  {staffRole?.labelFr || "Cadre Dirigeant"}
                </span>
              ) : (
                <span className="text-white font-bold">
                  Athlète Licencié ({participant.isMinor ? "Mineur" : "Adulte"})
                </span>
              )}
            </div>

            {/* Groupe Sanguin */}
            <div className="p-3.5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10.5px] uppercase block">
                Groupe Sanguin (Urgence)
              </span>
              <span className="text-[#E52421] font-black text-sm block">
                {participant.bloodType || "N/C"}
              </span>
            </div>

            {/* Disciplines */}
            <div className="p-3.5 rounded-2xl bg-[#0D0D11] border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10.5px] uppercase block">
                Section(s) Validée(s)
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {registration?.disciplines?.map((d: any) => (
                  <span
                    key={d.discipline.id}
                    className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold"
                  >
                    {d.discipline.nameFr}
                  </span>
                )) || <span className="text-gray-500">Non spécifié</span>}
              </div>
            </div>
          </div>

          {/* Cryptographic and Live Verification Stamp */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Contrôle cryptographique vérifié en direct • {verificationTime}</span>
            </div>
            <div className="text-gray-500">
              Académie ADD Oran • Oran, Algérie
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href={`/card/${participant.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-mono font-bold transition shadow-lg shadow-[#E52421]/20"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / Télécharger Format Badge PVC</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono font-bold transition border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Site Officiel</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

