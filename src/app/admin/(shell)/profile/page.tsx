"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import {
  User as FiUser,
  Shield as FiShield,
  Lock as FiLock,
  Eye as FiEye,
  EyeOff as FiEyeOff,
  LogOut as FiLogOut,
  CheckCircle2 as FiCheckCircle,
  AlertTriangle as FiAlertTriangle,
  Key as FiKey,
} from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const { t, locale, isRtl } = useLanguage();

  const [adminUser, setAdminUser] = useState<{ id: string; phone: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Non authentifié");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("Le nouveau mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    try {
      setUpdating(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible de changer le mot de passe.");
      }

      setSuccessMsg("Mot de passe mis à jour avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de mise à jour.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-4">
        <div className="w-12 h-12 border-4 border-[#E52421] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FiUser className="w-6 h-6 text-[#E52421]" />
          Mon Compte Administrateur
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Identifiants de session et gestion de vos accès sécurisés.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <FiShield className="w-4 h-4 text-emerald-400" />
          Informations de Connexion
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Identifiant / Téléphone</span>
            <span className="font-mono font-bold text-white text-base">{adminUser?.phone}</span>
          </div>

          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Rôle & Privilèges</span>
            <span className="px-2.5 py-1 bg-[#E52421]/15 text-[#E52421] border border-[#E52421]/30 text-xs font-mono font-bold rounded-lg inline-block">
              {adminUser?.role} (Super Admin)
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Statut Session</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Session chiffrée active
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Identifiant Unique</span>
            <span className="font-mono text-xs text-gray-400">{adminUser?.id}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-950/70 text-[#E52421] border border-[#E52421]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
          >
            <FiLogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <FiLock className="w-4 h-4 text-[#FFD21F]" />
          Modifier le mot de passe
        </h3>

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs font-semibold">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-[#E52421]/10 border border-[#E52421]/30 rounded-xl flex items-center gap-2.5 text-[#E52421] text-xs font-semibold">
            <FiAlertTriangle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-sm">
          <div>
            <label className="text-xs text-gray-300 font-semibold block mb-1">
              Mot de passe actuel *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Votre mot de passe actuel"
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 pr-10 text-xs text-white focus:outline-none focus:border-[#E52421]"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showCurrent ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 pr-10 text-xs text-white focus:outline-none focus:border-[#E52421]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showNew ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Confirmer le nouveau mot de passe *
              </label>
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#E52421]/20 disabled:opacity-50"
            >
              <FiKey className="w-4 h-4" />
              {updating ? "Mise à jour..." : "Changer mon mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
