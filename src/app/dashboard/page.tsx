"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/StatusBadge";
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
} from "lucide-react";

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  // Correction Form State
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [replacedPhoto, setReplacedPhoto] = useState<File | null>(null);
  const [replacedNationalId, setReplacedNationalId] = useState<File | null>(null);
  const [replacedMedical, setReplacedMedical] = useState<File | null>(null);
  const [replacedParentalId, setReplacedParentalId] = useState<File | null>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState("");

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/login");
        return;
      }
      setUserData(data.user);
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration) return;
    setResubmitting(true);
    setResubmitSuccess("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("registrationId", registration.id);

      if (replacedPhoto) formData.append("photo", replacedPhoto);
      if (replacedNationalId) formData.append("nationalId", replacedNationalId);
      if (replacedMedical) formData.append("medicalCertificate", replacedMedical);
      if (replacedParentalId) formData.append("parentNationalId", replacedParentalId);

      const res = await fetch("/api/participant/resubmit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du renvoi du dossier.");
      }

      setResubmitSuccess("Votre dossier a été mis à jour et renvoyé avec succès.");
      setShowCorrectionForm(false);
      await fetchUserData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setResubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00141f] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#EDAE49] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#8faec5]">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const participant = userData?.participant;
  const registration = participant?.registrations?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#00141f] text-[#f4f7f9]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-[#072538] border-2 border-[#17425f] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#003D5B] border border-[#00798C] text-[#EDAE49] flex items-center justify-center font-display font-black text-3xl shadow-lg">
              {participant?.firstName?.[0] || "U"}
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-[#EDAE49] uppercase tracking-widest">
                ESPACE ADHÉRENT // SAISON 2026
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {participant?.firstName} {participant?.lastName}
              </h1>
              <div className="font-mono text-xs text-[#8faec5] mt-1 flex items-center gap-3">
                <span dir="ltr">{userData?.phone}</span>
                <span className="text-[#30638E]">•</span>
                <span className="text-[#38b6cb]">{participant?.isMinor ? "Adhérent Mineur" : "Adhérent Majeur"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#00141f] hover:bg-[#003D5B] text-[#8faec5] hover:text-white rounded-xl font-mono text-xs font-semibold border border-[#17425f] transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-[#f17887]" />
              <span>{t.common.logout}</span>
            </button>
          </div>
        </div>

        {/* If no registration exists */}
        {!registration ? (
          <div className="bg-[#072538] border border-[#17425f] rounded-3xl p-12 text-center space-y-5">
            <p className="font-body text-base text-[#8faec5]">{t.dashboard.noRegistrations}</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-base uppercase tracking-wider rounded-xl shadow-lg"
            >
              Créer mon adhésion
            </Link>
          </div>
        ) : (
          <>
            {resubmitSuccess && (
              <div className="p-4 bg-[#00798C]/20 border border-[#00798C] rounded-2xl text-[#38b6cb] font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EDAE49]" />
                <span>{resubmitSuccess}</span>
              </div>
            )}
            {error && (
              <div className="p-4 bg-[#D1495B]/20 border border-[#D1495B] rounded-2xl text-[#f17887] font-mono text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* CORRECTION REQUIRED BANNER */}
            {registration.status === "NEEDS_CORRECTION" && (
              <div className="bg-[#072538] border-2 border-[#EDAE49] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 text-[#EDAE49]">
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                  <h3 className="font-display font-black text-xl uppercase text-white">
                    {t.dashboard.actionRequiredTitle}
                  </h3>
                </div>
                <p className="font-body text-xs sm:text-sm text-[#8faec5] leading-relaxed">
                  {t.dashboard.actionRequiredDesc}
                </p>
                {registration.correctionReason && (
                  <div className="p-4 bg-[#00141f] border border-[#EDAE49]/40 rounded-xl space-y-1">
                    <span className="font-mono text-xs font-bold text-[#EDAE49] block uppercase">
                      {t.dashboard.correctionInstructions}
                    </span>
                    <p className="font-editorial italic text-base text-white">
                      « {registration.correctionReason} »
                    </p>
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowCorrectionForm(!showCorrectionForm)}
                    className="px-6 py-3 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {showCorrectionForm ? "Masquer le formulaire" : "Corriger mon dossier maintenant"}
                  </button>
                </div>
              </div>
            )}

            {/* CORRECTION FORM DRAWER */}
            {showCorrectionForm && (
              <form
                onSubmit={handleResubmit}
                className="bg-[#072538] border-2 border-[#00798C] rounded-3xl p-6 sm:p-8 space-y-6"
              >
                <div className="border-b border-[#17425f] pb-4">
                  <h4 className="font-display font-black text-lg uppercase text-white">
                    Remplacement des pièces justificatives
                  </h4>
                  <p className="font-body text-xs text-[#8faec5] mt-1">
                    Sélectionnez uniquement les fichiers nécessitant une correction.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#00141f] rounded-xl border border-[#17425f] space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[#8faec5] block">
                      Nouvelle Photo d&apos;identité
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReplacedPhoto(e.target.files?.[0] || null)}
                      className="text-xs text-[#8faec5] file:mr-3 file:py-1.5 file:px-3 file:rounded file:bg-[#072538] file:text-white file:border-0"
                    />
                  </div>

                  <div className="p-4 bg-[#00141f] rounded-xl border border-[#17425f] space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[#8faec5] block">
                      Nouvelle Pièce d&apos;identité
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setReplacedNationalId(e.target.files?.[0] || null)}
                      className="text-xs text-[#8faec5] file:mr-3 file:py-1.5 file:px-3 file:rounded file:bg-[#072538] file:text-white file:border-0"
                    />
                  </div>

                  <div className="p-4 bg-[#00141f] rounded-xl border border-[#17425f] space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[#8faec5] block">
                      Nouveau Certificat Médical
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setReplacedMedical(e.target.files?.[0] || null)}
                      className="text-xs text-[#8faec5] file:mr-3 file:py-1.5 file:px-3 file:rounded file:bg-[#072538] file:text-white file:border-0"
                    />
                  </div>

                  {participant?.isMinor && (
                    <div className="p-4 bg-[#00141f] rounded-xl border border-[#17425f] space-y-2">
                      <label className="font-mono text-xs font-bold uppercase text-[#EDAE49] block">
                        Nouvelle Pièce d&apos;identité du Tuteur
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setReplacedParentalId(e.target.files?.[0] || null)}
                        className="text-xs text-[#8faec5] file:mr-3 file:py-1.5 file:px-3 file:rounded file:bg-[#072538] file:text-white file:border-0"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionForm(false)}
                    className="px-4 py-2 bg-[#00141f] text-[#8faec5] hover:text-white rounded-xl font-mono text-xs font-semibold border border-[#17425f]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={resubmitting}
                    className="px-6 py-2.5 bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50"
                  >
                    {resubmitting ? t.dashboard.resubmitting : t.dashboard.resubmitButton}
                  </button>
                </div>
              </form>
            )}

            {/* STATUS & DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Registration Status */}
              <div className="bg-[#072538] border border-[#17425f] rounded-3xl p-6 space-y-4">
                <div className="font-mono text-xs font-bold uppercase text-[#8faec5]">
                  {t.dashboard.currentStatus}
                </div>
                <div>
                  <StatusBadge status={registration.status} size="lg" />
                </div>
                <div className="pt-3 text-xs font-mono text-[#8faec5] space-y-1.5 border-t border-[#17425f]/50">
                  <div>
                    Référence : <span className="font-bold text-[#EDAE49]">{registration.reference}</span>
                  </div>
                  <div>
                    Saison : <span className="font-bold text-white">{registration.season?.label}</span>
                  </div>
                  <div>
                    Soumis le : <span className="font-medium text-white">{new Date(registration.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Disciplines */}
              <div className="bg-[#072538] border border-[#17425f] rounded-3xl p-6 space-y-4">
                <div className="font-mono text-xs font-bold uppercase text-[#8faec5]">
                  {t.dashboard.selectedDisciplines}
                </div>
                <div className="flex flex-wrap gap-2">
                  {registration.disciplines?.map((d: any) => (
                    <span
                      key={d.discipline.slug}
                      className="px-3 py-1.5 bg-[#003D5B] border border-[#00798C] rounded-xl font-display font-bold text-xs uppercase text-[#EDAE49] flex items-center gap-1.5"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      {locale === "ar" ? d.discipline.nameAr : locale === "en" ? d.discipline.nameEn : d.discipline.nameFr}
                    </span>
                  ))}
                </div>
                <div className="font-body text-xs text-[#8faec5] pt-2">
                  Entraînements officiels encadrés par les éducateurs certifiés du club.
                </div>
              </div>

              {/* Card 3: Cash Payment & Membership */}
              <div className="bg-[#072538] border border-[#17425f] rounded-3xl p-6 space-y-4">
                <div className="font-mono text-xs font-bold uppercase text-[#8faec5]">
                  Cotisation & Règlement
                </div>
                {registration.payments && registration.payments.length > 0 ? (
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#38b6cb]">
                      <CheckCircle2 className="w-4 h-4 text-[#EDAE49]" /> Cotisation réglée
                    </span>
                    <div className="font-mono text-xs text-[#8faec5]">
                      Reçu : <span className="font-bold text-white">{registration.payments[0].receiptNumber}</span>
                    </div>
                    <div className="font-display font-black text-xl text-white">
                      {registration.payments[0].amount.toLocaleString()} DZD (Espèces)
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#EDAE49]">
                      <CreditCard className="w-4 h-4" /> En attente de paiement
                    </span>
                    <p className="font-body text-xs text-[#8faec5] leading-relaxed">
                      Rendez-vous au siège du club à Oran pour régler votre adhésion en espèces et retirer votre reçu officiel tamponné.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* MY DOCUMENTS & SECURE VIEWER */}
            <div className="bg-[#072538] border border-[#17425f] rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#EDAE49]" />
                <span>{t.dashboard.myDocuments}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {registration.documents?.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-[#00141f] border border-[#17425f] rounded-2xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase text-[#8faec5] tracking-wider">
                        {doc.type === "PHOTO" && "Photo d'identité"}
                        {doc.type === "NATIONAL_ID" && "Pièce d'identité"}
                        {doc.type === "MEDICAL_CERTIFICATE" && "Certificat médical"}
                        {doc.type === "PARENT_NATIONAL_ID" && "ID Parent / Tuteur"}
                      </div>
                      <div className="font-body text-xs font-medium text-white truncate mt-1">
                        {doc.originalFilename}
                      </div>
                      <div className="font-mono text-[10px] text-[#8faec5]/60 mt-0.5">
                        {(doc.fileSize / 1024).toFixed(0)} Ko
                      </div>
                    </div>
                    <a
                      href={`/api/documents/${doc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#EDAE49] hover:text-[#ffc266]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Visualiser
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* OFFICIAL PAPERWORK DOWNLOADS */}
            <div className="bg-[#072538] border border-[#17425f] rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-[#EDAE49]" />
                <span>{t.dashboard.paperworkTitle}</span>
              </h3>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/paperwork/${registration.id}`}
                  className="flex items-center gap-2 px-5 py-3 bg-[#003D5B] hover:bg-[#30638E] text-white rounded-xl font-display font-bold text-sm uppercase tracking-wider border border-[#00798C] transition-all"
                >
                  <Download className="w-4 h-4 text-[#EDAE49]" />
                  Dossier Complet Officiel (PDF)
                </Link>
                {participant?.isMinor && (
                  <Link
                    href="/parental-doc"
                    target="_blank"
                    className="flex items-center gap-2 px-5 py-3 bg-[#00141f] hover:bg-[#003D5B] text-white rounded-xl font-mono text-xs border border-[#17425f] transition-all"
                  >
                    <Download className="w-4 h-4 text-[#EDAE49]" />
                    Autorisation Parentale (Imprimer / Légaliser)
                  </Link>
                )}
                <Link
                  href="/regulations"
                  target="_blank"
                  className="flex items-center gap-2 px-5 py-3 bg-[#00141f] hover:bg-[#003D5B] text-white rounded-xl font-mono text-xs border border-[#17425f] transition-all"
                >
                  <Download className="w-4 h-4 text-[#EDAE49]" />
                  Charte & Règlement Intérieur
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
