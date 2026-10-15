"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ShieldCheck,
  Receipt,
  FileCheck,
  Building,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function DashboardPaymentsPage() {
  const { t } = useLanguage();
  const { selectedParticipant, activeRegistration } = usePortal();

  if (!selectedParticipant || !activeRegistration) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white/60">
        Aucun dossier actif trouvé.
      </div>
    );
  }

  const payments = activeRegistration.payments || [];
  const latestPayment = payments[0] || null;
  const isPaid = activeRegistration.status === "ACTIVE" || Boolean(latestPayment);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-black font-display text-white">
              Cotisations & Reçus de Paiement
            </h1>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Gestion financière pour {selectedParticipant.firstName} {selectedParticipant.lastName} • Saison 2026
          </p>
        </div>

        {isPaid ? (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cotisation Réglée</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 self-start sm:self-auto">
            <Clock className="w-4 h-4" />
            <span>Règlement en Attente</span>
          </span>
        )}
      </div>

      {/* Main Financial Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Status & Details */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#111116] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
                Cotisation Annuelle 2026
              </span>
              <div className="text-3xl sm:text-4xl font-display font-black text-white mt-1">
                {latestPayment ? `${latestPayment.amount.toLocaleString()} DZD` : "3 000 DZD"}
              </div>
              <p className="text-xs text-white/60 mt-1">
                Comprend l&apos;adhésion au club ADD Oran et la couverture d&apos;assurance sportive.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD21F]">
              <Receipt className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/70">
              Détail des prestations incluses :
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-center justify-between">
                <span>Accès illimité aux entraînements hebdomadaires</span>
                <span className="text-emerald-400 font-mono">Inclus</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Participation aux Jams & Sorties Extérieures</span>
                <span className="text-emerald-400 font-mono">Inclus</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Assurance responsabilité civile & corporelle</span>
                <span className="text-emerald-400 font-mono">Inclus</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Carte officielle d&apos;adhérent avec QR Code</span>
                <span className="text-emerald-400 font-mono">Inclus</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions if not yet paid */}
          {!isPaid && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Modalités de règlement :</span>
              </div>
              <p>
                Le règlement s&apos;effectue en espèces directement au siège du club à Oran lors des horaires d&apos;entraînement ou de permanence administrative. Un reçu numéroté officiel vous sera remis sur place et votre statut sera activé immédiatement.
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Official Receipt Action */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-white/10 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
              Reçu Officiel
            </span>

            {latestPayment ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-1.5">
                  <div className="text-white/50 text-[10px]">NUMÉRO DE QUITTANCE</div>
                  <div className="text-sm font-bold text-[#FFD21F]">
                    {latestPayment.receiptNumber}
                  </div>
                  <div className="text-[10px] text-white/50 pt-2 border-t border-white/5">
                    Payé le {new Date(latestPayment.paidAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="text-[10px] text-white/50">
                    Mode : {latestPayment.paymentMethod === "CASH" ? "Espèces au club" : latestPayment.paymentMethod}
                  </div>
                </div>

                <Link
                  href={`/receipt/${latestPayment.receiptNumber}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#E52421] hover:bg-[#c91d1a] text-white font-bold text-xs shadow-lg shadow-[#E52421]/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le Reçu Officiel</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                <Receipt className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-xs text-white/50">
                  Aucun reçu n&apos;est encore émis pour ce dossier. Le reçu sera disponible dès l&apos;encaissement.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-white/40 space-y-1">
            <div>Club ADD Parkour Oran</div>
            <div>Agrément n° 2026/042</div>
            <div>Wilaya d&apos;Oran, Algérie</div>
          </div>
        </div>
      </div>

      {/* Payment History List */}
      <div className="p-6 rounded-3xl bg-[#111116] border border-white/10 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#FFD21F]" />
          <span>Historique des Transactions</span>
        </h3>

        {payments.length === 0 ? (
          <p className="text-xs text-white/50 py-4">
            Aucun historique de paiement pour cette saison.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {payments.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white font-mono">
                      {p.receiptNumber}
                    </div>
                    <div className="text-[11px] text-white/50">
                      {p.paymentPurpose || "Cotisation annuelle"} • {new Date(p.paidAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="font-mono font-bold text-white text-sm">
                    {p.amount.toLocaleString()} DZD
                  </span>
                  <Link
                    href={`/receipt/${p.receiptNumber}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Voir le reçu"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
