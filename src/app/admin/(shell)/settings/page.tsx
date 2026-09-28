"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  Settings as FiSettings,
  Save as FiSave,
  CheckCircle2 as FiCheckCircle,
  AlertTriangle as FiAlertTriangle,
  DollarSign as FiDollarSign,
  Home as FiHome,
  FileText as FiFileText,
  ToggleLeft as FiToggleLeft,
  ToggleRight as FiToggleRight,
} from "lucide-react";

interface SettingsData {
  clubName: string;
  clubAddress: string;
  clubPhone: string;
  clubEmail: string;
  annualContributionDzd: number;
  monthlyContributionDzd: number;
  registrationOpen: boolean;
  receiptPrefix: string;
}

export default function SettingsPage() {
  const { t, locale, isRtl } = useLanguage();

  const [settings, setSettings] = useState<SettingsData>({
    clubName: "",
    clubAddress: "",
    clubPhone: "",
    clubEmail: "",
    annualContributionDzd: 4000,
    monthlyContributionDzd: 2500,
    registrationOpen: true,
    receiptPrefix: "ADD-PAY",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Erreur de chargement des paramètres.");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible d'enregistrer les paramètres.");
      }

      setSettings(data.settings);
      setSuccessMsg("Paramètres enregistrés avec succès.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-4">
        <div className="w-12 h-12 border-4 border-[#E52421] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FiSettings className="w-6 h-6 text-[#E52421]" />
          Paramètres du Club & Administration
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configuration des informations légales, grille tarifaire interne et règles d'inscription.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm">
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#E52421]/10 border border-[#E52421]/30 rounded-2xl flex items-center gap-3 text-[#E52421] text-sm">
          <FiAlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informations Générales */}
        <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FiHome className="w-4 h-4 text-[#E52421]" />
            Identité & Coordonnées du Club
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Nom officiel de l'association / club
              </label>
              <input
                type="text"
                value={settings.clubName}
                onChange={(e) => setSettings({ ...settings, clubName: e.target.value })}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Adresse postale / Siège
              </label>
              <input
                type="text"
                value={settings.clubAddress}
                onChange={(e) => setSettings({ ...settings, clubAddress: e.target.value })}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Téléphone officiel
              </label>
              <input
                type="text"
                value={settings.clubPhone}
                onChange={(e) => setSettings({ ...settings, clubPhone: e.target.value })}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421] font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Email officiel
              </label>
              <input
                type="email"
                value={settings.clubEmail}
                onChange={(e) => setSettings({ ...settings, clubEmail: e.target.value })}
                className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E52421]"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cotisations & Finances */}
        <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FiDollarSign className="w-4 h-4 text-[#FFD21F]" />
            Grille Tarifaire (Gestion Interne)
          </h3>
          <p className="text-xs text-gray-400">
            Ces tarifs sont gérés administrativement pour l'encaissement et l'émission des reçus.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Cotisation annuelle standard (DZD) *
              </label>
              <span className="text-[11px] text-gray-400 block mb-1">
                Comprend l'assurance et le premier mois d'activité
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="100"
                  value={settings.annualContributionDzd}
                  onChange={(e) =>
                    setSettings({ ...settings, annualContributionDzd: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FFD21F]"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-gray-400">DZD</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Mensualité ultérieure (DZD) *
              </label>
              <span className="text-[11px] text-gray-400 block mb-1">
                Tarif mensuel pour les mois suivants
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="100"
                  value={settings.monthlyContributionDzd}
                  onChange={(e) =>
                    setSettings({ ...settings, monthlyContributionDzd: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FFD21F]"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-gray-400">DZD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Inscriptions & Reçus */}
        <div className="p-6 bg-[#141419] border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FiFileText className="w-4 h-4 text-emerald-400" />
            Campagne d'Inscription & Reçus
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-4 bg-[#1C1C24] rounded-xl border border-white/5">
              <div>
                <span className="font-bold text-white block">
                  Ouverture des Inscriptions Publiques
                </span>
                <span className="text-xs text-gray-400">
                  Active ou désactive la soumission de nouveaux dossiers sur le site public
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, registrationOpen: !settings.registrationOpen })
                }
                className={`p-2 rounded-xl text-lg transition ${
                  settings.registrationOpen
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-[#E52421]/20 text-[#E52421] border border-[#E52421]/30"
                }`}
              >
                {settings.registrationOpen ? (
                  <span className="text-xs font-bold px-2 py-1 flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4" /> OUVERTES
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-1 flex items-center gap-1.5">
                    <FiAlertTriangle className="w-4 h-4" /> FERMÉES
                  </span>
                )}
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">
                Préfixe officiel des Quittances de caisse
              </label>
              <input
                type="text"
                value={settings.receiptPrefix}
                onChange={(e) => setSettings({ ...settings, receiptPrefix: e.target.value })}
                className="w-full max-w-xs bg-[#0A0A0D] border border-white/10 rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#E52421]"
                required
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Exemple généré : <code className="text-gray-300">{settings.receiptPrefix}-2026-000001</code>
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#E52421]/20"
          >
            <FiSave className="w-4 h-4" />
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
