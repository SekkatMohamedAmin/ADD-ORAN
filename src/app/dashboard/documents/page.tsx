"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import { compressImage } from "@/lib/imageCompression";
import {
  FileText,
  AlertTriangle,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Check,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function DashboardDocumentsPage() {
  const { t } = useLanguage();
  const {
    loading,
    selectedParticipant,
    activeRegistration,
    hasPendingCorrection,
    refreshUserData,
  } = usePortal();

  // Re-upload form state
  const [showReuploadDrawer, setShowReuploadDrawer] = useState(false);
  const [replacedPhoto, setReplacedPhoto] = useState<File | null>(null);
  const [replacedNationalId, setReplacedNationalId] = useState<File | null>(null);
  const [replacedMedical, setReplacedMedical] = useState<File | null>(null);
  const [replacedParentalId, setReplacedParentalId] = useState<File | null>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState("");
  const [resubmitError, setResubmitError] = useState("");

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-8 h-8 text-[#E52421] animate-spin" />
        <p className="text-xs font-mono text-white/50">Chargement des documents...</p>
      </div>
    );
  }

  if (!selectedParticipant || !activeRegistration) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white/60">
        Aucun dossier actif sélectionné.
      </div>
    );
  }

  const documents = activeRegistration.documents || [];

  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case "PHOTO":
        return "Photo d'identité officielle";
      case "NATIONAL_ID":
        return "Pièce d'identité (CNI / Passeport)";
      case "MEDICAL_CERTIFICATE":
        return "Certificat médical d'aptitude";
      case "PARENTAL_ID":
        return "Pièce d'identité du tuteur légal";
      case "PARENTAL_AUTHORIZATION":
        return "Autorisation parentale signée";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Vérifié</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            <span>À remplacer</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>En attente d&apos;examen</span>
          </span>
        );
    }
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacedPhoto && !replacedNationalId && !replacedMedical && !replacedParentalId) {
      setResubmitError("Veuillez sélectionner au moins un fichier de remplacement.");
      return;
    }

    setResubmitting(true);
    setResubmitError("");
    setResubmitSuccess("");

    try {
      const formData = new FormData();
      formData.append("registrationId", activeRegistration.id);

      if (replacedPhoto) {
        const compressed = await compressImage(replacedPhoto);
        formData.append("photo", compressed);
      }
      if (replacedNationalId) {
        const compressed = await compressImage(replacedNationalId);
        formData.append("nationalId", compressed);
      }
      if (replacedMedical) {
        const compressed = await compressImage(replacedMedical);
        formData.append("medicalCertificate", compressed);
      }
      if (replacedParentalId) {
        const compressed = await compressImage(replacedParentalId);
        formData.append("parentalId", compressed);
      }

      const res = await fetch("/api/participant/resubmit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour des pièces.");
      }

      setResubmitSuccess(
        "Vos nouvelles pièces ont été téléversées avec succès ! Votre dossier repasse en revue."
      );

      // Reset
      setReplacedPhoto(null);
      setReplacedNationalId(null);
      setReplacedMedical(null);
      setReplacedParentalId(null);

      await refreshUserData();
      setTimeout(() => setShowReuploadDrawer(false), 2000);
    } catch (err: any) {
      setResubmitError(err.message || "Erreur lors du téléversement.");
    } finally {
      setResubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-[#E52421]" />
            <h1 className="text-2xl font-black font-display text-white">
              Documents & Pièces Justificatives
            </h1>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Dossier de {selectedParticipant.firstName} {selectedParticipant.lastName} • Réf : {activeRegistration.reference}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReuploadDrawer(!showReuploadDrawer)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-[#FFD21F]" />
          <span>Remplacer / Ajouter un document</span>
        </button>
      </div>

      {/* Admin Rejection Callout if any */}
      {hasPendingCorrection && (
        <div className="p-6 rounded-3xl bg-red-950/40 border-2 border-red-500/50 shadow-2xl space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <h3 className="font-bold text-base text-red-200">
              Demande de correction de l&apos;administration du club
            </h3>
          </div>
          <p className="text-xs text-red-300/80">
            L&apos;équipe a vérifié les documents déposés et a relevé une non-conformité.
            Veuillez téléverser la nouvelle version ci-dessous.
          </p>
          {activeRegistration.correctionReason && (
            <div className="p-3.5 rounded-xl bg-black/50 border border-red-500/30 text-xs font-mono text-red-200">
              <span className="font-bold text-[#FFD21F]">Motif officiel : </span>
              « {activeRegistration.correctionReason} »
            </div>
          )}
        </div>
      )}

      {/* Re-upload Drawer / Form */}
      {showReuploadDrawer && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#FFD21F]/30 shadow-2xl space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFD21F]/15 flex items-center justify-center text-[#FFD21F]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Remplacement de pièces justificatives
                </h3>
                <p className="text-xs text-white/50">
                  Sélectionnez les nouveaux documents conformes puis cliquez sur &quot;Valider et renvoyer&quot;.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReuploadDrawer(false)}
              className="text-xs text-white/40 hover:text-white"
            >
              Fermer
            </button>
          </div>

          {resubmitError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resubmitError}</span>
            </div>
          )}

          {resubmitSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{resubmitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleResubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="block text-xs font-bold text-white">
                  Nouvelle Photo d&apos;identité
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setReplacedPhoto(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="block text-xs font-bold text-white">
                  Nouveau Certificat médical
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setReplacedMedical(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <label className="block text-xs font-bold text-white">
                  Nouvelle Pièce d&apos;identité (CNI / Passeport)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setReplacedNationalId(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>

              {selectedParticipant.isMinor && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <label className="block text-xs font-bold text-white">
                    Pièce d&apos;identité du Tuteur légal
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) =>
                      setReplacedParentalId(e.target.files?.[0] || null)
                    }
                    className="w-full text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={resubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#c91d1a] text-white text-xs font-bold shadow-lg shadow-[#E52421]/20 transition-all disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {resubmitting ? "Téléversement en cours..." : "Valider et renvoyer"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const isImage =
            doc.mimeType?.startsWith("image/") ||
            /\.(jpg|jpeg|png|webp)$/i.test(doc.originalFilename);

          return (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-[#111116] border border-white/10 shadow-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD21F] shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">
                      {getDocTypeLabel(doc.type)}
                    </h3>
                    <p className="text-[11px] font-mono text-white/40 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                      {doc.originalFilename}
                    </p>
                  </div>
                </div>

                {getStatusBadge(doc.status)}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
                <span>{(doc.fileSize / 1024).toFixed(0)} Ko</span>
                <span>{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`/api/documents/${doc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-white/50" />
                  <span>Visualiser</span>
                </a>
                <a
                  href={`/api/documents/${doc.id}`}
                  download={doc.originalFilename}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Club Official Templates */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-white/[0.02] to-white/[0.04] border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">
            Formats acceptés & exigences médicales
          </h3>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">
          Les certificats médicaux doivent dater de moins de 3 mois et mentionner l&apos;aptitude à la pratique du Parkour, de l&apos;Escalade ou du Trail en compétition ou loisir. Les photos d&apos;identité doivent être nettes, de face et sur fond clair.
        </p>
      </div>
    </div>
  );
}
