"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "./PortalContext";
import { compressImage } from "@/lib/imageCompression";
import {
  X,
  UserPlus,
  Check,
  AlertCircle,
  FileCheck,
  Upload,
  Sparkles,
} from "lucide-react";

export function AddChildModal() {
  const { t, isRtl } = useLanguage();
  const {
    isAddChildModalOpen,
    closeAddChildModal,
    refreshUserData,
    setSelectedParticipantId,
  } = usePortal();

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

  if (!isAddChildModalOpen) return null;

  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddChildError("");
    setAddChildSuccess("");

    if (!childFirstName.trim() || !childLastName.trim() || !childDob) {
      setAddChildError("Veuillez remplir le nom, prénom et date de naissance.");
      return;
    }

    if (childDisciplines.length === 0) {
      setAddChildError("Veuillez sélectionner au moins une discipline.");
      return;
    }

    if (!childPhoto || !childMedical) {
      setAddChildError(
        "La photo d'identité et le certificat médical sont obligatoires."
      );
      return;
    }

    setAddingChild(true);
    try {
      const formData = new FormData();
      formData.append("firstName", childFirstName.trim());
      formData.append("lastName", childLastName.trim());
      formData.append("dateOfBirth", childDob);
      formData.append("placeOfBirth", childPob.trim() || "Oran");
      formData.append("bloodType", childBloodType || "");
      formData.append("address", childAddress.trim() || "");
      formData.append("disciplines", JSON.stringify(childDisciplines));
      formData.append("guardianName", childGuardianName.trim() || "");
      formData.append("declarationAccepted", String(childParentalAccepted));
      formData.append("engagementAccepted", String(childEngagementAccepted));
      formData.append("reuseParentId", String(reuseParentId));

      const compressedPhoto = await compressImage(childPhoto);
      formData.append("photo", compressedPhoto);

      const compressedMed = await compressImage(childMedical);
      formData.append("medicalCertificate", compressedMed);

      if (childNationalId) {
        const compressedId = await compressImage(childNationalId);
        formData.append("nationalId", compressedId);
      }

      if (!reuseParentId && childParentalId) {
        const compressedParentId = await compressImage(childParentalId);
        formData.append("parentalId", compressedParentId);
      }

      const res = await fetch("/api/participant/add-child", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de l'enfant.");
      }

      setAddChildSuccess(
        `L'inscription de ${childFirstName} (${data.reference}) a été créée avec succès !`
      );

      await refreshUserData();
      if (data.participantId) {
        setSelectedParticipantId(data.participantId);
      }

      setTimeout(() => {
        closeAddChildModal();
        // Reset fields
        setChildFirstName("");
        setChildLastName("");
        setChildDob("");
        setChildPhoto(null);
        setChildMedical(null);
        setChildNationalId(null);
        setChildParentalId(null);
        setAddChildSuccess("");
      }, 1500);
    } catch (err: any) {
      setAddChildError(err.message || "Une erreur est survenue.");
    } finally {
      setAddingChild(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={closeAddChildModal}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E52421]/20 border border-[#E52421]/40 flex items-center justify-center text-[#E52421]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white">
              Inscrire un autre enfant
            </h3>
            <p className="text-xs text-white/60">
              Associez un nouvel adhérent mineur à votre compte familial sans
              ressaisir vos coordonnées de tuteur.
            </p>
          </div>
        </div>

        {addChildError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{addChildError}</span>
          </div>
        )}

        {addChildSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{addChildSuccess}</span>
          </div>
        )}

        <form onSubmit={handleAddChildSubmit} className="space-y-6">
          {/* Section: Identité de l'enfant */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#FFD21F] mb-3 flex items-center gap-2">
              <span>1. Identité de l&apos;enfant</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Prénom de l&apos;enfant *
                </label>
                <input
                  type="text"
                  required
                  value={childFirstName}
                  onChange={(e) => setChildFirstName(e.target.value)}
                  placeholder="Ex: Yacine"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#E52421] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  required
                  value={childLastName}
                  onChange={(e) => setChildLastName(e.target.value)}
                  placeholder="Ex: Benali"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#E52421] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  required
                  value={childDob}
                  onChange={(e) => setChildDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#E52421] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  value={childPob}
                  onChange={(e) => setChildPob(e.target.value)}
                  placeholder="Ex: Oran"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#E52421] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Groupe Sanguin
                </label>
                <select
                  value={childBloodType}
                  onChange={(e) => setChildBloodType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A22] border border-white/10 text-white text-sm focus:border-[#E52421] focus:outline-none"
                >
                  <option value="">Non renseigné</option>
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
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Nom complet du Tuteur
                </label>
                <input
                  type="text"
                  value={childGuardianName}
                  onChange={(e) => setChildGuardianName(e.target.value)}
                  placeholder="Ex: Mohamed Benali (Père)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#E52421] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Disciplines */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#FFD21F] mb-3">
              2. Discipline(s) souhaitée(s) *
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: "parkour", label: "Parkour & ADD" },
                { id: "escalade", label: "Escalade & Bloc" },
                { id: "trail", label: "Trail & Nature" },
              ].map((disc) => {
                const checked = childDisciplines.includes(disc.id);
                return (
                  <button
                    key={disc.id}
                    type="button"
                    onClick={() => {
                      if (checked) {
                        setChildDisciplines(
                          childDisciplines.filter((d) => d !== disc.id)
                        );
                      } else {
                        setChildDisciplines([...childDisciplines, disc.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      checked
                        ? "bg-[#E52421]/20 border-[#E52421] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <span>{disc.label}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        checked
                          ? "bg-[#E52421] border-[#E52421] text-white"
                          : "border-white/20"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Documents */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#FFD21F] mb-3">
              3. Pièces justificatives *
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Photo d&apos;identité de l&apos;enfant *
                </label>
                <input
                  type="file"
                  required
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setChildPhoto(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Certificat médical d&apos;aptitude *
                </label>
                <input
                  type="file"
                  required
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setChildMedical(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  Pièce d&apos;identité enfant (facultatif si livret)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) =>
                    setChildNationalId(e.target.files?.[0] || null)
                  }
                  className="w-full text-xs text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reuseParentId}
                    onChange={(e) => setReuseParentId(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-[#E52421] focus:ring-0"
                  />
                  <span className="text-xs text-white/80">
                    Réutiliser la pièce d&apos;identité tuteur déjà présente sur le
                    compte
                  </span>
                </label>
                {!reuseParentId && (
                  <div className="mt-2.5">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) =>
                        setChildParentalId(e.target.files?.[0] || null)
                      }
                      className="w-full text-xs text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Autorisations et Engagements */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={childParentalAccepted}
                onChange={(e) => setChildParentalAccepted(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-white/5 text-[#E52421] focus:ring-0"
              />
              <span className="text-xs text-white/80">
                J&apos;autorise mon enfant à pratiquer les activités de l&apos;association
                ADD Parkour Oran et confirme l&apos;exactitude des informations.
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={childEngagementAccepted}
                onChange={(e) => setChildEngagementAccepted(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-white/5 text-[#E52421] focus:ring-0"
              />
              <span className="text-xs text-white/80">
                Mon enfant et moi-même acceptons le règlement intérieur et la
                charte d&apos;engagement du club.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={closeAddChildModal}
              className="px-5 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white/80 hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={addingChild}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#c91d1a] text-white text-xs font-bold shadow-lg shadow-[#E52421]/20 transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {addingChild ? "Inscription en cours..." : "Valider l'inscription"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
