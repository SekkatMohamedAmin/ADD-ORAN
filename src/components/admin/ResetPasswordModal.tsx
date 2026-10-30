"use client";

import React, { useState } from "react";
import {
  Key as FiKey,
  X as FiX,
  Copy as FiCopy,
  Check as FiCheck,
  Send as FiSend,
  Eye as FiEye,
  EyeOff as FiEyeOff,
  RefreshCw as FiRefreshCw,
  ShieldAlert as FiShieldAlert,
  Smartphone as FiSmartphone,
  Lock as FiLock,
} from "lucide-react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: string;
  participantName: string;
  phone: string;
  whatsapp?: string | null;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  participantId,
  participantName,
  phone,
  whatsapp,
}: ResetPasswordModalProps) {
  const [mode, setMode] = useState<"auto" | "custom">("auto");
  const [customPassword, setCustomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    temporaryPassword: string;
    userPhone: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload: { newPassword?: string } = {};
      if (mode === "custom") {
        if (!customPassword || customPassword.length < 6) {
          throw new Error("Le mot de passe personnalisé doit comporter au moins 6 caractères.");
        }
        payload.newPassword = customPassword;
      }

      const res = await fetch(`/api/admin/participants/${participantId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible de réinitialiser le mot de passe.");
      }

      setSuccessResult({
        temporaryPassword: data.temporaryPassword,
        userPhone: data.userPhone || phone,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!successResult) return;
    navigator.clipboard.writeText(successResult.temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const contactNumber = (whatsapp || phone || "").replace(/\D/g, "");
  // Ensure country code if starts with 0
  let waPhone = contactNumber;
  if (waPhone.startsWith("0")) {
    waPhone = "213" + waPhone.slice(1);
  }

  const shareText = successResult
    ? `Bonjour ${participantName},\n\nVotre mot de passe pour accéder à votre espace ADD Oran a été réinitialisé par l'administration :\n\n📱 Identifiant (Tél) : ${successResult.userPhone}\n🔑 Nouveau mot de passe : ${successResult.temporaryPassword}\n\nVous pouvez vous connecter à tout moment sur la plateforme.`
    : "";

  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(shareText)}`;

  const handleModalClose = () => {
    setSuccessResult(null);
    setCustomPassword("");
    setError(null);
    setMode("auto");
    setCopied(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#141419] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E52421] via-[#FFD21F] to-[#E52421]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1C1C24]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E52421]/15 text-[#E52421] flex items-center justify-center border border-[#E52421]/30">
              <FiKey className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Réinitialisation du mot de passe
              </h2>
              <p className="text-xs text-gray-400">
                Adhérent : <span className="text-white font-semibold">{participantName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
            title="Fermer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 flex items-start gap-2.5">
              <FiShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!successResult ? (
            <>
              {/* Security info banner */}
              <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl flex items-start gap-3">
                <FiLock className="w-4 h-4 text-[#FFD21F] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  Pour protéger la vie privée des adhérents, les mots de passe sont hachés de manière irréversible. L&apos;administration peut générer un nouveau mot de passe sécurisé et le lui transmettre.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider font-mono">
                  Méthode de réinitialisation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("auto")}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition flex flex-col gap-1 cursor-pointer ${
                      mode === "auto"
                        ? "bg-[#E52421]/15 border-[#E52421] text-white shadow-lg shadow-[#E52421]/10"
                        : "bg-[#1C1C24] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-white">
                      <FiRefreshCw className={`w-3.5 h-3.5 ${mode === "auto" ? "text-[#E52421]" : ""}`} />
                      Automatique
                    </span>
                    <span className="text-[11px] font-normal text-gray-400">
                      Code clair (ex: ADD-839201)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("custom")}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition flex flex-col gap-1 cursor-pointer ${
                      mode === "custom"
                        ? "bg-[#E52421]/15 border-[#E52421] text-white shadow-lg shadow-[#E52421]/10"
                        : "bg-[#1C1C24] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-white">
                      <FiKey className={`w-3.5 h-3.5 ${mode === "custom" ? "text-[#E52421]" : ""}`} />
                      Personnalisé
                    </span>
                    <span className="text-[11px] font-normal text-gray-400">
                      Saisir un mot de passe choisi
                    </span>
                  </button>
                </div>
              </div>

              {/* Custom Password Input */}
              {mode === "custom" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-semibold text-gray-400 block">
                    Nouveau mot de passe (min. 6 caractères)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Entrez le nouveau mot de passe"
                      className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#E52421] pr-11 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* User summary details */}
              <div className="p-3 bg-[#1C1C24]/60 rounded-xl border border-white/5 text-xs text-gray-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Numéro de téléphone :</span>
                  <span className="font-mono font-bold text-white">{phone}</span>
                </div>
                {whatsapp && (
                  <div className="flex items-center justify-between">
                    <span>WhatsApp :</span>
                    <span className="font-mono text-emerald-400">{whatsapp}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={loading}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#E52421]/20 font-display cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Réinitialisation...</span>
                    </>
                  ) : (
                    <>
                      <FiKey className="w-4 h-4" />
                      <span>Appliquer le mot de passe</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="space-y-6 animate-scale-in">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FiCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Mot de passe réinitialisé !</h4>
                  <p className="text-xs text-gray-400">
                    L&apos;ancien mot de passe et les sessions actives ont été révoqués avec succès.
                  </p>
                </div>
              </div>

              {/* Display New Password Box */}
              <div className="p-5 bg-[#1C1C24] border border-white/10 rounded-2xl space-y-2 text-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">
                  Nouveau mot de passe de l&apos;adhérent
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FFD21F] tracking-wider select-all">
                    {successResult.temporaryPassword}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
                    title="Copier le mot de passe"
                  >
                    {copied ? <FiCheck className="w-4 h-4 text-emerald-400" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-400 font-semibold animate-fade-in">
                    ✓ Mot de passe copié dans le presse-papiers !
                  </p>
                )}
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider font-mono">
                  Transmettre à l&apos;adhérent
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <FiSend className="w-4 h-4" />
                    <span>Envoyer sur WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-3 bg-[#1C1C24] hover:bg-[#252530] border border-white/10 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {copied ? <FiCheck className="w-4 h-4 text-emerald-400" /> : <FiCopy className="w-4 h-4" />}
                    <span>{copied ? "Copié !" : "Copier les identifiants"}</span>
                  </button>
                </div>
              </div>

              {/* Warning note */}
              <p className="text-[11px] text-gray-500 text-center">
                Ce mot de passe ne sera plus visible après la fermeture de cette fenêtre. Assurez-vous de le transmettre ou de le noter.
              </p>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer"
                >
                  Terminer et fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
