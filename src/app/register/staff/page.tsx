"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
  Calendar,
  Phone,
  Lock,
  ArrowLeft,
  Crown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CLUB_ROLES, CLUB_ROLES_LIST, ClubRoleKey } from "@/lib/clubRoles";
import { compressImage } from "@/lib/imageCompression";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function StaffRegisterPage() {
  // Form State
  const [clubRole, setClubRole] = useState<ClubRoleKey>("PRESIDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodType, setBloodType] = useState("O+");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<{
    reference: string;
    registrationId: string;
    roleLabel: string;
  } | null>(null);

  const selectedRoleDef = CLUB_ROLES[clubRole] || CLUB_ROLES.PRESIDENT;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
      });
      setPhotoFile(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
      setErrorMessage("");
    } catch {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Veuillez renseigner votre nom et prénom.");
      return;
    }
    if (!dateOfBirth) {
      setErrorMessage("Veuillez renseigner votre date de naissance.");
      return;
    }
    if (!bloodType) {
      setErrorMessage("Veuillez sélectionner votre groupe sanguin.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Veuillez renseigner votre numéro de téléphone.");
      return;
    }
    if (!photoFile) {
      setErrorMessage("La photo d'identité est obligatoire pour confectionner votre carte officielle.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("bloodType", bloodType);
      formData.append("clubRole", clubRole);
      formData.append("phone", phone.trim());
      if (password) {
        formData.append("password", password);
      }
      formData.append("photo", photoFile);

      const res = await fetch("/api/register/staff", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      setSuccessData({
        reference: data.reference,
        registrationId: data.registrationId,
        roleLabel: selectedRoleDef.labelFr,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de la soumission du dossier.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#E52421] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#E52421]/10 via-amber-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header Link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>

          {/* Success Screen */}
          {successData ? (
            <div className="bg-gradient-to-b from-[#14141A] to-[#0E0E12] border-2 border-amber-500/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                <Crown className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Accréditation Officielle Enregistrée
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-tight text-white">
                  Dossier Dirigeant Enregistré
                </h1>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Votre demande pour la fonction de{" "}
                  <strong className="text-amber-300">{successData.roleLabel}</strong> a été enregistrée avec succès.
                </p>
              </div>

              {/* Reference pill */}
              <div className="bg-[#181822] border border-white/10 rounded-2xl p-4 max-w-md mx-auto space-y-1">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                  Numéro de référence officiel
                </span>
                <span className="font-mono font-black text-xl sm:text-2xl text-white tracking-widest text-[#FFD21F]">
                  {successData.reference}
                </span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 max-w-md mx-auto text-left text-xs text-amber-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Validation prioritaire par l&apos;Administration
                </div>
                <p className="leading-relaxed">
                  L&apos;administrateur du club va valider votre dossier dans le système. Dès acceptation, votre carte officielle d&apos;accréditation avec logo rouge sera générée automatiquement et accessible dans votre espace.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#0E0E12] font-display font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Accéder à mon espace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono rounded-xl transition flex items-center justify-center"
                >
                  Retour au site
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="bg-gradient-to-b from-[#141419] to-[#0E0E12] border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl relative">
              {/* Executive badge header */}
              <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/50 text-amber-300 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-mono text-xs font-bold tracking-wider uppercase">
                    Espace Officiel • Bureau & Encadrement
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-tight text-white">
                  Inscription & Accréditation Club
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                  Formulaire réservé aux membres du Bureau Exécutif, Responsables de section et Coachs officiels de l&apos;Académie ADD Oran.
                </p>
              </div>

              {/* Error notice */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. ROLE SELECTION */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fonction / Rôle au sein du Club *</span>
                  </label>
                  <div className="relative">
                    <select
                      value={clubRole}
                      onChange={(e) => setClubRole(e.target.value as ClubRoleKey)}
                      className="w-full bg-[#181822] border-2 border-amber-400/40 focus:border-amber-400 text-white rounded-2xl px-4 py-3 text-sm font-semibold transition outline-none appearance-none cursor-pointer"
                    >
                      {CLUB_ROLES_LIST.map((role) => (
                        <option key={role.key} value={role.key} className="bg-[#141419] text-white">
                          {role.labelFr} — {role.labelAr} ({role.cardHeaderBadge})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-400">
                      ▼
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300/80 flex items-center gap-2 pt-0.5">
                    <span>Badge carte : <strong>★ {selectedRoleDef.cardBadgeTitle} ★</strong></span>
                    <span>•</span>
                    <span className="text-gray-400">{selectedRoleDef.cardHeaderBadge}</span>
                  </div>
                </div>

                {/* 2. PHOTO IDENTITY UPLOAD */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#E52421]" />
                    <span>Photo d&apos;identité officielle * (Carte PVC)</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#181822] border border-white/10 rounded-2xl">
                    {/* Photo preview */}
                    <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-[#0A0A0D] border-2 border-amber-400/50 shrink-0 flex items-center justify-center shadow-md">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Aperçu photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2 text-gray-500">
                          <User className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-[9px] font-mono block">Format portrait</span>
                        </div>
                      )}
                      {photoPreview && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <p className="text-xs text-gray-300">
                        Prenez ou importez une photo nette, sur fond clair, visage dégagé de face.
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        capture="user"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded-xl transition border border-white/15 cursor-pointer active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#FFD21F]" />
                        <span>{photoPreview ? "Changer la photo" : "Sélectionner / Prendre une photo"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. NAME & SURNAME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">
                      Nom de famille *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: BENALI"
                      className="w-full bg-[#181822] border border-white/10 focus:border-[#E52421] text-white rounded-xl px-3.5 py-2.5 text-sm uppercase font-mono tracking-wide outline-none transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Mohamed"
                      className="w-full bg-[#181822] border border-white/10 focus:border-[#E52421] text-white rounded-xl px-3.5 py-2.5 text-sm uppercase font-mono tracking-wide outline-none transition"
                    />
                  </div>
                </div>

                {/* 4. DOB & BLOOD TYPE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Date de naissance *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 focus:border-[#E52421] text-white rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      <span>Groupe Sanguin *</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {BLOOD_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setBloodType(type)}
                          className={`py-2 text-xs font-mono font-bold rounded-lg transition border cursor-pointer ${
                            bloodType === type
                              ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30"
                              : "bg-[#181822] text-gray-300 border-white/10 hover:border-white/30"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. PHONE & PASSWORD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>Numéro de Téléphone *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 06 61 00 00 00"
                      className="w-full bg-[#181822] border border-white/10 focus:border-[#E52421] text-white rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Mot de passe d&apos;accès</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Optionnel (défaut: téléphone)"
                      className="w-full bg-[#181822] border border-white/10 focus:border-[#E52421] text-white rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none transition"
                    />
                  </div>
                </div>

                {/* Notice */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 space-y-1">
                  <p className="flex items-center gap-1.5 text-gray-200 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Pas de frais d&apos;adhésion ni de certificat médical requis
                  </p>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    En tant que dirigeant ou cadre technique, votre inscription est directement transmise à l&apos;administration pour validation et établissement de votre carte d&apos;accréditation avec logo rouge au verso.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-[#0E0E12] font-display font-black text-sm uppercase tracking-wider rounded-2xl transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Valider & Enregistrer mon Dossier Dirigeant</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

