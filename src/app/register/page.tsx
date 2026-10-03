"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  User,
  Shield,
  Activity,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Download,
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

export default function RegisterPage() {
  const { t, isRtl } = useLanguage();

  // Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Form State - 01 Account
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Form State - 02 Identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [isMinor, setIsMinor] = useState(false);
  const [age, setAge] = useState<number | null>(null);

  // Form State - 03 Disciplines
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(["parkour"]);

  // Form State - 04 Documents
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [medicalFile, setMedicalFile] = useState<File | null>(null);
  const [parentalIdFile, setParentalIdFile] = useState<File | null>(null);

  // Form State - 05 Engagement & Parental
  const [engagementAccepted, setEngagementAccepted] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [parentalAccepted, setParentalAccepted] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false);
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);

  // Confirmation Result
  const [registrationResult, setRegistrationResult] = useState<{
    reference: string;
    registrationId: string;
    isMinor: boolean;
  } | null>(null);

  const regImages = [
    "/images/lastseason/5893075819293249614.jpg",
    "/images/lastseason/5893075819293249609.jpg",
    "/images/registration/reg-campaign.jpg",
    "/images/lastseason/5893075819293249589.jpg",
  ];
  const [bgIdx, setBgIdx] = useState(0);

  React.useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setBgIdx((prev) => (prev + 1) % regImages.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [regImages.length]);

  const fileInputPhotoRef = useRef<HTMLInputElement>(null);
  const cameraInputPhotoRef = useRef<HTMLInputElement>(null);

  // Calculate age automatically from date of birth
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateOfBirth(val);
    if (!val) {
      setAge(null);
      setIsMinor(false);
      return;
    }
    const dob = new Date(val);
    if (!isNaN(dob.getTime())) {
      const today = new Date();
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
      setIsMinor(calculatedAge < 18);
    }
  };

  const handlePhotoSelect = async (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    const optimized = await compressImage(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.82 });
    setPhotoFile(optimized);
    const url = URL.createObjectURL(optimized);
    setPhotoPreview(url);
  };

  const handleNationalIdSelect = async (file: File | null) => {
    if (!file) {
      setNationalIdFile(null);
      return;
    }
    const optimized = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
    setNationalIdFile(optimized);
  };

  const handleMedicalSelect = async (file: File | null) => {
    if (!file) {
      setMedicalFile(null);
      return;
    }
    const optimized = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
    setMedicalFile(optimized);
  };

  const handleParentalIdSelect = async (file: File | null) => {
    if (!file) {
      setParentalIdFile(null);
      return;
    }
    const optimized = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
    setParentalIdFile(optimized);
  };

  const toggleDiscipline = (slug: string) => {
    if (selectedDisciplines.includes(slug)) {
      if (selectedDisciplines.length > 1) {
        setSelectedDisciplines(selectedDisciplines.filter((s) => s !== slug));
      }
    } else {
      setSelectedDisciplines([...selectedDisciplines, slug]);
    }
  };

  // Step Validation before proceeding
  const validateStep = (step: number): boolean => {
    setErrorMessage("");
    if (step === 1) {
      if (!phone.trim()) {
        setErrorMessage("Le numéro de téléphone est obligatoire.");
        return false;
      }
      if (!password || password.length < 6) {
        setErrorMessage(t.registration.account.passwordMinLength);
        return false;
      }
      if (password !== passwordConfirm) {
        setErrorMessage(t.registration.account.passwordMismatch);
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMessage("Le prénom et le nom sont obligatoires.");
        return false;
      }
      if (!dateOfBirth) {
        setErrorMessage("La date de naissance est obligatoire.");
        return false;
      }
      if (!placeOfBirth.trim()) {
        setErrorMessage("Le lieu de naissance est obligatoire.");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (selectedDisciplines.length === 0) {
        setErrorMessage(t.registration.disciplinesStep.minOneRequired);
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!photoFile) {
        setErrorMessage("La photo d'identité est obligatoire.");
        return false;
      }
      if (!nationalIdFile) {
        setErrorMessage("La pièce d'identité est obligatoire.");
        return false;
      }
      if (!medicalFile) {
        setErrorMessage("Le certificat médical est obligatoire.");
        return false;
      }
      if (isMinor && !parentalIdFile) {
        setErrorMessage("La pièce d'identité du parent/tuteur légal est obligatoire pour les mineurs.");
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (!engagementAccepted) {
        setErrorMessage(t.registration.engagementStep.engagementRequiredError);
        return false;
      }
      if (isMinor) {
        if (!guardianName.trim() || !parentalAccepted) {
          setErrorMessage(t.registration.engagementStep.parentalRequiredError);
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Submission to Server
  const handleSubmit = async (dismissDuplicate = false) => {
    setErrorMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("password", password);
      if (email) formData.append("email", email);
      if (whatsapp) formData.append("whatsapp", whatsapp);

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("placeOfBirth", placeOfBirth);
      if (address) formData.append("address", address);
      if (bloodType) formData.append("bloodType", bloodType);

      formData.append("disciplines", JSON.stringify(selectedDisciplines));

      if (photoFile) {
        const optPhoto = await compressImage(photoFile, { maxWidth: 1000, maxHeight: 1000, quality: 0.82 });
        formData.append("photo", optPhoto);
      }
      if (nationalIdFile) {
        const optId = await compressImage(nationalIdFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
        formData.append("nationalId", optId);
      }
      if (medicalFile) {
        const optMed = await compressImage(medicalFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
        formData.append("medicalCertificate", optMed);
      }
      if (isMinor && parentalIdFile) {
        const optPar = await compressImage(parentalIdFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
        formData.append("parentalId", optPar);
      }

      formData.append("engagementAccepted", engagementAccepted ? "true" : "false");
      if (isMinor) {
        formData.append("guardianName", guardianName);
        formData.append("parentalAccepted", parentalAccepted ? "true" : "false");
      }

      if (dismissDuplicate) {
        formData.append("duplicateWarningDismissed", "true");
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.warning && data.matches) {
          setDuplicateWarning(true);
          setDuplicateMatches(data.matches);
          setSubmitting(false);
          return;
        }
        setErrorMessage(data.error || "Une erreur est survenue lors de l'inscription.");
        setSubmitting(false);
        return;
      }

      setRegistrationResult({
        reference: data.reference,
        registrationId: data.registrationId,
        isMinor: data.isMinor,
      });
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: "01", label: t.registration.steps.account },
    { num: "02", label: t.registration.steps.identity },
    { num: "03", label: t.registration.steps.disciplines },
    { num: "04", label: t.registration.steps.documents },
    { num: "05", label: t.registration.steps.engagement },
    { num: "06", label: t.registration.steps.review },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] relative selection:bg-[#FFD21F] selection:text-[#0A0A0D]">
      <Navbar />

      <main className="relative z-10 flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: CAMPAIGN POSTER COLUMN (Sticky on Desktop) */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-28 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E52421]/25 bg-[#121217] p-8 shadow-2xl">
              {/* Background Real Photography */}
              <div className="absolute inset-0 z-0">
                {regImages.map((src, idx) => (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === bgIdx ? "opacity-35 z-0" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="Club Real Photography"
                      fill
                      priority={idx === 0}
                      className="object-cover select-none"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/80 to-transparent z-10" />
              </div>

              {/* Graphic Elements & Typography */}
              <div className="relative z-10 space-y-6">
                <div className="font-mono text-xs text-[#FFD21F] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD23F] animate-pulse" />
                  <span>ART DU DÉPLACEMENT // ORAN</span>
                </div>

                <h1 className="font-display text-5xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.9]">
                  JOIN <br />
                  THE <br />
                  <span className="text-[#E52421]">MOVEMENT.</span>
                </h1>

                <p className="font-mono text-xs text-[#9E9EA8] uppercase tracking-wider leading-relaxed">
                  PARKOUR • ESCALADE • TRAIL.
                </p>

                {/* Step Progression Rail */}
                <div className="pt-6 border-t border-[#E52421]/20 space-y-3 font-mono text-xs">
                  {stepsList.map((s, idx) => {
                    const stepNum = idx + 1;
                    const isActive = currentStep === stepNum;
                    const isPassed = currentStep > stepNum;
                    return (
                      <div
                        key={s.num}
                        className={`flex items-center gap-3 transition-colors ${
                          isActive
                            ? "text-[#FFD21F] font-bold"
                            : isPassed
                            ? "text-[#F5F5F2] opacity-90"
                            : "text-[#9E9EA8]/50"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-[#FFD21F] text-[#0A0A0D]"
                              : isPassed
                              ? "bg-[#E52421] text-white"
                              : "bg-[#16161D] border border-[#E52421]/20 text-[#9E9EA8]"
                          }`}
                        >
                          {isPassed ? "✓" : s.num}
                        </span>
                        <span className="tracking-wider uppercase">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: ACTUAL REGISTRATION FORM */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header for Mobile / Tablet */}
            <div className="lg:hidden space-y-2 mb-6">
              <div className="font-mono text-xs text-[#FFD21F] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFD23F] animate-pulse" />
                <span>ART DU DÉPLACEMENT // ORAN</span>
              </div>
              <h2 className="font-display text-4xl font-black uppercase text-[#F5F5F2] tracking-tight">
                JOIN THE MOVEMENT
              </h2>
            </div>

            {/* Mobile Progress Bar */}
            {currentStep < 7 && (
              <div className="bg-[#16161D] border border-[#E52421]/30 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[#9E9EA8] mb-2">
                  <span className="text-[#FFD21F] flex items-center gap-2">
                    <span className="font-display font-black text-lg text-white">0{currentStep}</span>
                    <span>/ 0{totalSteps - 1} — </span>
                    <span className="text-white">
                      {currentStep === 1 && t.registration.steps.account}
                      {currentStep === 2 && t.registration.steps.identity}
                      {currentStep === 3 && t.registration.steps.disciplines}
                      {currentStep === 4 && t.registration.steps.documents}
                      {currentStep === 5 && t.registration.steps.engagement}
                      {currentStep === 6 && t.registration.steps.review}
                    </span>
                  </span>
                  <span className="text-[#FFD21F]">{Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}%</span>
                </div>

                <div className="w-full bg-[#0A0A0D] h-2 rounded-full overflow-hidden p-0.5 border border-[#E52421]/20">
                  <div
                    className="bg-gradient-to-r from-[#E52421] to-[#FFD21F] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="p-4 bg-[#FF4D6D]/15 border border-[#FF4D6D] rounded-xl text-[#fbd2d7] text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white font-mono uppercase">Vérification requise :</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* DUPLICATE WARNING MODAL */}
            {duplicateWarning && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#16161D] border-2 border-[#FFD23F] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl text-left">
                  <div className="flex items-center gap-3 text-[#FFD23F]">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <h3 className="font-display font-black text-xl uppercase text-white">
                      {t.registration.reviewStep.duplicateWarningTitle}
                    </h3>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[#9E9EA8] leading-relaxed">
                    {t.registration.reviewStep.duplicateWarningMessage}
                  </p>
                  {duplicateMatches.length > 0 && (
                    <div className="bg-[#0A0A0D] p-3 rounded-lg border border-[#E52421]/30 text-xs space-y-1">
                      <div className="font-mono font-bold text-[#9E9EA8]">Dossier similaire existant :</div>
                      {duplicateMatches.map((m, idx) => (
                        <div key={idx} className="text-[#F5F5F2] font-mono">
                          • {m.firstName} {m.lastName} ({m.phone}) — {m.reason}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setDuplicateWarning(false)}
                      className="px-4 py-2.5 text-xs font-semibold rounded bg-[#0A0A0D] hover:bg-[#E52421]/20 text-white border border-[#E52421]/30"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDuplicateWarning(false);
                        handleSubmit(true);
                      }}
                      className="px-5 py-2.5 text-xs font-display font-black uppercase tracking-wider rounded bg-[#FFD21F] hover:bg-white text-[#0A0A0D] shadow-lg"
                    >
                      {t.common.continueAnyway}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP CONTENT CONTAINER */}
            <div className="bg-[#16161D]/90 border border-[#E52421]/30 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
              {/* STEP 1: ACCOUNT */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E52421]/20 pb-5">
                    <div className="font-mono text-xs font-bold text-[#FFD21F] uppercase tracking-widest mb-1">
                      01 // {t.registration.steps.account}
                    </div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#F5F5F2] tracking-tight flex items-center gap-2">
                      <User className="w-6 h-6 text-[#FFD21F]" />
                      <span>{t.registration.account.title}</span>
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase mt-1">
                      Créez vos accès sécurisés pour gérer votre saison sportive.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.account.phoneLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.registration.account.phonePlaceholder}
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.account.passwordLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.account.passwordConfirmLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase text-[#9E9EA8] font-mono">
                          {t.registration.account.emailLabel}
                        </label>
                        <span className="text-[10px] font-mono text-[#9E9EA8]/60 uppercase">(Optionnel)</span>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@email.com"
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase text-[#9E9EA8] font-mono">
                          {t.registration.account.whatsappLabel}
                        </label>
                        <span className="text-[10px] font-mono text-[#9E9EA8]/60 uppercase">(Optionnel)</span>
                      </div>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Numéro WhatsApp"
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <Link
                      href="/login"
                      className="font-mono text-xs text-[#9E9EA8] hover:text-[#FFD21F] transition-colors underline underline-offset-4"
                    >
                      {t.registration.account.alreadyHaveAccount}
                    </Link>
                  </div>
                </div>
              )}

              {/* STEP 2: IDENTITY */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E52421]/20 pb-5">
                    <div className="font-mono text-xs font-bold text-[#FFD21F] uppercase tracking-widest mb-1">
                      02 // {t.registration.steps.identity}
                    </div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#F5F5F2] tracking-tight flex items-center gap-2">
                      <User className="w-6 h-6 text-[#FFD21F]" />
                      <span>{t.registration.identity.title}</span>
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase mt-1">
                      Renseignez l&apos;identité officielle de l&apos;adhérent.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.identity.firstNameLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Prénom"
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.identity.lastNameLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom de famille"
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.identity.dobLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={handleDobChange}
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#9E9EA8] mb-1.5 font-mono">
                        {t.registration.identity.pobLabel} <span className="text-[#FFD21F]">*</span>
                      </label>
                      <input
                        type="text"
                        value={placeOfBirth}
                        onChange={(e) => setPlaceOfBirth(e.target.value)}
                        placeholder="Lieu de naissance (ex: Oran)"
                        required
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase text-[#9E9EA8] font-mono">
                          {t.registration.identity.bloodTypeLabel}
                        </label>
                        <span className="text-[10px] font-mono text-[#9E9EA8]/60 uppercase">(Optionnel)</span>
                      </div>
                      <select
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none font-mono"
                      >
                        <option value="">{t.registration.identity.selectBloodType}</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="Unknown">Inconnu / Non précisé</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase text-[#9E9EA8] font-mono">
                          {t.registration.identity.addressLabel}
                        </label>
                        <span className="text-[10px] font-mono text-[#9E9EA8]/60 uppercase">(Optionnel)</span>
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Adresse de résidence (ex: Oran centre)"
                        className="w-full px-4 py-3.5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] outline-none"
                      />
                    </div>
                  </div>

                  {/* Dynamic Age Detection Notice */}
                  {age !== null && (
                    <div
                      className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
                        isMinor
                          ? "bg-[#FF4D6D]/15 border-[#FF4D6D] text-[#fbd2d7]"
                          : "bg-[#E52421]/15 border-[#E52421] text-[#FFEAA7]"
                      }`}
                    >
                      <Shield className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="font-mono font-bold block text-sm">
                          Âge calculé : {age} an{age > 1 ? "s" : ""}
                        </span>
                        <span>
                          {isMinor
                            ? t.registration.identity.minorDetectedNotice
                            : t.registration.identity.adultDetectedNotice}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: DISCIPLINES */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E52421]/20 pb-5">
                    <div className="font-mono text-xs font-bold text-[#FFD21F] uppercase tracking-widest mb-1">
                      03 // {t.registration.steps.disciplines}
                    </div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#F5F5F2] tracking-tight flex items-center gap-2">
                      <Activity className="w-6 h-6 text-[#FFD21F]" />
                      <span>{t.registration.disciplinesStep.title}</span>
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase mt-1">
                      {t.registration.disciplinesStep.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* 1. Parkour */}
                    <div
                      onClick={() => toggleDiscipline("parkour")}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                        selectedDisciplines.includes("parkour")
                          ? "bg-[#0A0A0D] border-[#FFD21F] shadow-lg shadow-[#FFD21F]/10"
                          : "bg-[#0A0A0D]/60 border-[#E52421]/30 hover:border-[#E52421]"
                      }`}
                    >
                      <div>
                        <div className="font-display font-black text-white uppercase text-xl flex items-center gap-3">
                          <span>{t.disciplines.parkour.name}</span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded font-mono font-bold bg-[#FFD21F] text-[#0A0A0D]">
                            01 / URBAN
                          </span>
                        </div>
                        <p className="font-body text-xs text-[#9E9EA8] mt-1.5 max-w-xl">{t.disciplines.parkour.desc}</p>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${
                          selectedDisciplines.includes("parkour")
                            ? "bg-[#FFD21F] border-[#FFD21F] text-[#0A0A0D]"
                            : "border-[#E52421]/30"
                        }`}
                      >
                        {selectedDisciplines.includes("parkour") && "✓"}
                      </div>
                    </div>

                    {/* 2. Escalade */}
                    <div
                      onClick={() => toggleDiscipline("escalade-montagne")}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                        selectedDisciplines.includes("escalade-montagne")
                          ? "bg-[#0A0A0D] border-[#FFD23F] shadow-lg shadow-[#FFD23F]/10"
                          : "bg-[#0A0A0D]/60 border-[#E52421]/30 hover:border-[#E52421]"
                      }`}
                    >
                      <div>
                        <div className="font-display font-black text-white uppercase text-xl flex items-center gap-3">
                          <span>{t.disciplines.escalade.name}</span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded font-mono font-bold bg-[#FFD23F] text-[#0A0A0D]">
                            02 / VERTICAL
                          </span>
                        </div>
                        <p className="font-body text-xs text-[#9E9EA8] mt-1.5 max-w-xl">{t.disciplines.escalade.desc}</p>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${
                          selectedDisciplines.includes("escalade-montagne")
                            ? "bg-[#FFD23F] border-[#FFD23F] text-[#0A0A0D]"
                            : "border-[#E52421]/30"
                        }`}
                      >
                        {selectedDisciplines.includes("escalade-montagne") && "✓"}
                      </div>
                    </div>

                    {/* 3. Trail */}
                    <div
                      onClick={() => toggleDiscipline("trail")}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                        selectedDisciplines.includes("trail")
                          ? "bg-[#0A0A0D] border-[#E52421] shadow-lg shadow-[#E52421]/10"
                          : "bg-[#0A0A0D]/60 border-[#E52421]/30 hover:border-[#E52421]"
                      }`}
                    >
                      <div>
                        <div className="font-display font-black text-white uppercase text-xl flex items-center gap-3">
                          <span>{t.disciplines.trail.name}</span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded font-mono font-bold bg-[#E52421] text-white">
                            03 / OUTDOOR
                          </span>
                        </div>
                        <p className="font-body text-xs text-[#9E9EA8] mt-1.5 max-w-xl">{t.disciplines.trail.desc}</p>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${
                          selectedDisciplines.includes("trail")
                            ? "bg-[#E52421] border-[#E52421] text-white"
                            : "border-[#E52421]/30"
                        }`}
                      >
                        {selectedDisciplines.includes("trail") && "✓"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENTS */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E52421]/20 pb-5">
                    <div className="font-mono text-xs font-bold text-[#FFD21F] uppercase tracking-widest mb-1">
                      04 // {t.registration.steps.documents}
                    </div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#F5F5F2] tracking-tight flex items-center gap-2">
                      <FileText className="w-6 h-6 text-[#FFD21F]" />
                      <span>{t.registration.documentsStep.title}</span>
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase mt-1">
                      {t.registration.documentsStep.subtitle} — {t.registration.documentsStep.maxSizeNotice}
                    </p>
                  </div>

                  {/* Photo Upload + Mobile Camera */}
                  <div className="p-5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase text-white block font-mono">
                          {t.registration.documentsStep.photoLabel} <span className="text-[#FFD21F]">*</span>
                        </label>
                        <p className="text-xs text-[#9E9EA8]">
                          {t.registration.documentsStep.photoHelp}
                        </p>
                      </div>
                      {photoFile && (
                        <span className="text-xs font-semibold text-[#FFD21F] flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-4 h-4 text-[#FFD21F]" /> Prêt
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <input
                        type="file"
                        ref={fileInputPhotoRef}
                        accept="image/*"
                        onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={cameraInputPhotoRef}
                        accept="image/*"
                        capture="user"
                        onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputPhotoRef.current?.click()}
                        className="px-4 py-2.5 bg-[#16161D] hover:bg-[#E52421] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 border border-[#E52421]/40 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#FFD21F]" />
                        Parcourir un fichier
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputPhotoRef.current?.click()}
                        className="px-4 py-2.5 bg-[#16161D] hover:bg-[#E52421] text-[#FFD21F] hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 border border-[#E52421]/40 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Prendre une photo (Caméra)
                      </button>

                      {photoPreview && (
                        <div className="flex items-center gap-2 ml-auto">
                          <img
                            src={photoPreview}
                            alt="Photo d'identité"
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD21F]"
                          />
                          <span className="text-xs text-[#9E9EA8] font-mono">
                            {photoFile?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* National ID Upload */}
                  <div className="p-5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase text-white block font-mono">
                          {t.registration.documentsStep.idLabel} <span className="text-[#FFD21F]">*</span>
                        </label>
                        <p className="text-xs text-[#9E9EA8]">
                          {t.registration.documentsStep.idHelp}
                        </p>
                      </div>
                      {nationalIdFile && (
                        <span className="text-xs font-semibold text-[#FFD21F] flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-4 h-4 text-[#FFD21F]" /> Prêt
                        </span>
                      )}
                    </div>

                    <div className="pt-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleNationalIdSelect(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-[#9E9EA8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#16161D] file:text-white hover:file:bg-[#E52421] cursor-pointer"
                      />
                      {nationalIdFile && (
                        <p className="text-xs text-[#FFD21F] mt-1 font-mono">
                          Fichier : {nationalIdFile.name} ({(nationalIdFile.size / 1024).toFixed(0)} Ko)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medical Certificate Upload */}
                  <div className="p-5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase text-white block font-mono">
                          {t.registration.documentsStep.medicalLabel} <span className="text-[#FFD21F]">*</span>
                        </label>
                        <p className="text-xs text-[#9E9EA8]">
                          {t.registration.documentsStep.medicalHelp}
                        </p>
                      </div>
                      {medicalFile && (
                        <span className="text-xs font-semibold text-[#FFD21F] flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-4 h-4 text-[#FFD21F]" /> Prêt
                        </span>
                      )}
                    </div>

                    <div className="pt-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleMedicalSelect(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-[#9E9EA8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#16161D] file:text-white hover:file:bg-[#E52421] cursor-pointer"
                      />
                      {medicalFile && (
                        <p className="text-xs text-[#FFD21F] mt-1 font-mono">
                          Fichier : {medicalFile.name} ({(medicalFile.size / 1024).toFixed(0)} Ko)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Parent ID if minor */}
                  {isMinor && (
                    <div className="p-5 bg-[#0A0A0D] border-2 border-[#FFD23F] rounded-2xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold uppercase text-[#FFD23F] block font-mono">
                              {t.registration.documentsStep.parentalIdLabel} <span className="text-[#FFD23F]">*</span>
                            </label>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#FFD23F] text-[#0A0A0D]">
                              Adhérent Mineur
                            </span>
                          </div>
                          <p className="text-xs text-[#9E9EA8]">
                            {t.registration.documentsStep.parentalIdHelp}
                          </p>
                        </div>
                        {parentalIdFile && (
                          <span className="text-xs font-semibold text-[#FFD21F] flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-4 h-4 text-[#FFD23F]" /> Prêt
                          </span>
                        )}
                      </div>

                      <div className="pt-2">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleParentalIdSelect(e.target.files?.[0] || null)}
                          className="block w-full text-xs text-[#9E9EA8] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#16161D] file:text-white hover:file:bg-[#E52421] cursor-pointer"
                        />
                        {parentalIdFile && (
                          <p className="text-xs text-[#FFD23F] mt-1 font-mono">
                            Fichier : {parentalIdFile.name} ({(parentalIdFile.size / 1024).toFixed(0)} Ko)
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: ENGAGEMENT */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E52421]/20 pb-5">
                    <div className="font-mono text-xs font-bold text-[#FFD21F] uppercase tracking-widest mb-1">
                      05 // {t.registration.steps.engagement}
                    </div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#F5F5F2] tracking-tight flex items-center gap-2">
                      <Shield className="w-6 h-6 text-[#FFD21F]" />
                      <span>{t.registration.engagementStep.title}</span>
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase mt-1">
                      Adhésion aux règles du club, respect mutuel et cadre de pratique.
                    </p>
                  </div>

                  {/* Club Commitment */}
                  <div className="p-6 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-4">
                    <h3 className="font-display font-bold text-lg uppercase text-[#FFD21F]">
                      {t.registration.engagementStep.clubCommitmentTitle}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-[#9E9EA8] leading-relaxed text-justify">
                      {t.registration.engagementStep.clubCommitmentText}
                    </p>
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={engagementAccepted}
                          onChange={(e) => setEngagementAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-[#E52421] focus:ring-[#FFD21F] bg-[#16161D] border-[#E52421]/40"
                        />
                        <span className="font-body text-xs sm:text-sm font-semibold text-white">
                          {t.registration.engagementStep.acceptEngagement}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Parental Declaration if minor */}
                  {isMinor && (
                    <div className="p-6 bg-[#0A0A0D] border-2 border-[#FFD23F] rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-lg uppercase text-[#FFD23F]">
                          {t.registration.engagementStep.parentalTitle}
                        </h3>
                        <Link
                          href="/parental-doc"
                          target="_blank"
                          className="text-xs text-[#FFD21F] hover:text-[#FFD23F] flex items-center gap-1 font-semibold underline underline-offset-4"
                        >
                          {t.registration.engagementStep.readParentalDoc}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <p className="font-body text-xs text-[#9E9EA8] leading-relaxed text-justify">
                        {t.registration.engagementStep.parentalDeclarationText}
                      </p>

                      <div>
                        <label className="block text-xs font-bold uppercase text-white mb-1.5 font-mono">
                          {t.registration.engagementStep.parentalGuardianLabel} <span className="text-[#FFD23F]">*</span>
                        </label>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="Nom et prénom du tuteur légal"
                          required
                          className="w-full px-4 py-3 bg-[#16161D] border border-[#E52421]/30 rounded-xl text-white text-sm focus:border-[#FFD23F] focus:ring-1 focus:ring-[#FFD23F] outline-none"
                        />
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer pt-2">
                        <input
                          type="checkbox"
                          checked={parentalAccepted}
                          onChange={(e) => setParentalAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-[#FFD23F] focus:ring-[#FFD23F] bg-[#16161D] border-[#E52421]/40"
                        />
                        <span className="font-body text-xs sm:text-sm font-semibold text-white">
                          {t.registration.engagementStep.acceptParentalDeclaration}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: REVIEW */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E52421]/20 pb-5">
                    <div className="font-mono text-xs font-bold text-[#FFD21F] uppercase tracking-widest mb-1">
                      06 // {t.registration.steps.review}
                    </div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#F5F5F2] tracking-tight flex items-center gap-2">
                      <FileCheck className="w-6 h-6 text-[#FFD21F]" />
                      <span>{t.registration.reviewStep.title}</span>
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase mt-1">
                      {t.registration.reviewStep.summaryNotice}
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="p-5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-2">
                      <div className="font-display font-bold text-base uppercase text-[#FFD21F]">
                        {t.registration.reviewStep.identitySummary}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#9E9EA8] pt-1">
                        <div>Prénom & Nom : <span className="text-white font-semibold">{firstName} {lastName}</span></div>
                        <div>Téléphone : <span className="text-white font-semibold" dir="ltr">{phone}</span></div>
                        <div>Date de naissance : <span className="text-white font-semibold">{dateOfBirth} ({age} ans)</span></div>
                        <div>Lieu de naissance : <span className="text-white font-semibold">{placeOfBirth}</span></div>
                        <div>Statut : <span className="text-[#FFD21F] font-semibold">{isMinor ? "Adhérent Mineur" : "Adhérent Majeur"}</span></div>
                        <div>Groupe sanguin : <span className="text-white font-semibold">{bloodType || "N/A"}</span></div>
                      </div>
                    </div>

                    <div className="p-5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-2">
                      <div className="font-display font-bold text-base uppercase text-[#FFD21F]">
                        {t.registration.reviewStep.disciplinesSummary}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedDisciplines.map((slug) => (
                          <span key={slug} className="px-3 py-1 bg-[#16161D] text-[#FFD21F] border border-[#E52421]/40 rounded font-bold uppercase">
                            ✓ {slug === "parkour" ? "Parkour" : slug === "escalade-montagne" ? "Escalade & sports de montagne" : "Trail"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl space-y-2">
                      <div className="font-display font-bold text-base uppercase text-[#FFD21F]">
                        {t.registration.reviewStep.documentsSummary}
                      </div>
                      <ul className="space-y-1.5 text-[#9E9EA8] pt-1">
                        <li>✓ Photo d&apos;identité : <span className="text-white">{photoFile?.name}</span></li>
                        <li>✓ Pièce d&apos;identité : <span className="text-white">{nationalIdFile?.name}</span></li>
                        <li>✓ Certificat médical : <span className="text-white">{medicalFile?.name}</span></li>
                        {isMinor && <li>✓ Pièce d&apos;identité du tuteur : <span className="text-white">{parentalIdFile?.name} (Tuteur : {guardianName})</span></li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: CONFIRMATION */}
              {currentStep === 7 && registrationResult && (
                <div className="space-y-8 text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-[#FFD21F]/20 border-2 border-[#FFD21F] text-[#FFD21F] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,217,255,0.3)]">
                    <CheckCircle2 className="w-10 h-10 text-[#FFD21F]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-display text-4xl font-black uppercase text-white tracking-tight">
                      {t.registration.confirmationStep.title}
                    </h2>
                    <p className="font-mono text-xs text-[#9E9EA8] uppercase max-w-lg mx-auto">
                      {t.registration.confirmationStep.subtitle}
                    </p>
                  </div>

                  <div className="bg-[#0A0A0D] border-2 border-[#FFD21F] rounded-2xl p-6 max-w-md mx-auto space-y-1 shadow-2xl">
                    <span className="font-mono text-xs font-semibold text-[#9E9EA8] uppercase tracking-widest">
                      {t.registration.confirmationStep.refLabel}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-[#FFD21F] font-mono tracking-wider">
                      {registrationResult.reference}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
                    <Link
                      href={`/paperwork/${registrationResult.registrationId}`}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E52421] hover:bg-[#FFD21F] hover:text-[#0A0A0D] text-white font-display font-black text-sm uppercase tracking-wider shadow-lg transition-all"
                    >
                      <Download className="w-4 h-4" />
                      {t.registration.confirmationStep.downloadDossierPdf}
                    </Link>
                    {registrationResult.isMinor && (
                      <Link
                        href="/parental-doc"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#16161D] hover:bg-[#E52421] text-white font-mono text-xs border border-[#E52421]/40 transition-all"
                      >
                        <Download className="w-4 h-4 text-[#FFD21F]" />
                        {t.registration.confirmationStep.downloadParentalPdf}
                      </Link>
                    )}
                  </div>

                  <div className="bg-[#0A0A0D] border border-[#E52421]/30 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3 font-body">
                    <h4 className="font-display font-bold text-sm uppercase text-white tracking-wider">
                      {t.registration.confirmationStep.nextStepsTitle}
                    </h4>
                    <div className="space-y-2 text-xs text-[#9E9EA8]">
                      <p>1. {t.registration.confirmationStep.step1}</p>
                      <p>2. {t.registration.confirmationStep.step2}</p>
                      <p>3. {t.registration.confirmationStep.step3}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFD21F] hover:bg-white text-[#0A0A0D] font-display font-black text-base uppercase tracking-wider transition-all shadow-xl"
                    >
                      <span>{t.registration.confirmationStep.goToDashboard}</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* STEP CONTROLS (Next / Back / Submit) */}
              {currentStep < 7 && (
                <div className="mt-10 pt-6 border-t border-[#E52421]/20 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={submitting}
                      className="px-5 py-3 rounded-xl bg-[#0A0A0D] hover:bg-[#16161D] text-[#9E9EA8] hover:text-white font-mono font-bold text-xs uppercase tracking-wider border border-[#E52421]/30 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className={`w-4 h-4 ${isRtl ? "rtl-flip" : ""}`} />
                      {t.common.back}
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3.5 rounded-xl bg-[#E52421] hover:bg-[#FFD21F] hover:text-[#0A0A0D] text-[#F5F5F2] font-display font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                      <span>{t.common.next}</span>
                      <ArrowRight className={`w-4 h-4 ${isRtl ? "rtl-flip" : ""}`} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubmit(false)}
                      disabled={submitting}
                      className="px-8 py-4 rounded-xl bg-[#FFD21F] hover:bg-white text-[#0A0A0D] font-display font-black text-base uppercase tracking-wider shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>{t.registration.reviewStep.submitting}</span>
                      ) : (
                        <>
                          <span>{t.registration.reviewStep.submitButton}</span>
                          <CheckCircle2 className="w-4 h-4 text-[#0A0A0D]" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
