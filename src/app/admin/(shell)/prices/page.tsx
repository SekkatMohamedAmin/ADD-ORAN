"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  Shield,
  Activity,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calculator,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";
import { PricingConfig, DEFAULT_PRICING, FeeFrequency } from "@/lib/pricing-utils";

export default function AdminPricesPage() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live simulator state
  const [simChildren, setSimChildren] = useState<
    Array<{ id: number; name: string; disciplines: string[] }>
  >([
    { id: 1, name: "Enfant 1", disciplines: ["parkour"] },
    { id: 2, name: "Enfant 2", disciplines: ["escalade-montagne"] },
  ]);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/pricing", { cache: "no-store" });
      if (!res.ok) throw new Error("Impossible de charger la grille tarifaire.");
      const data = await res.json();
      if (data.pricing) setPricing(data.pricing);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement.");

      setPricing(data.pricing);
      setSuccessMsg("Grille tarifaire et calendrier enregistrés avec succès !");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const updateDiscipline = (
    slug: string,
    field: "priceDzd" | "frequency" | "enabled",
    val: any
  ) => {
    setPricing((prev) => ({
      ...prev,
      disciplines: {
        ...prev.disciplines,
        [slug]: {
          ...prev.disciplines[slug],
          [field]: val,
        },
      },
    }));
  };

  // Simulation calculation
  const simInsurance = pricing.insurance.enabled ? pricing.insurance.priceDzd : 0;
  const simInsuranceFreq = pricing.insurance.frequency;

  let simTotalAnnual = 0;
  let simTotalMonthly = 0;

  const simBreakdown = simChildren.map((child) => {
    const childInsurance = simInsurance;
    let childAnnual = simInsuranceFreq === "annual" ? childInsurance : 0;
    let childMonthly = simInsuranceFreq === "monthly" ? childInsurance : 0;

    const discDetails = child.disciplines.map((slug) => {
      const disc = pricing.disciplines[slug];
      const price = disc && disc.enabled ? disc.priceDzd : 0;
      const freq = disc ? disc.frequency : "monthly";
      if (freq === "annual") childAnnual += price;
      if (freq === "monthly") childMonthly += price;
      return {
        slug,
        name: disc ? disc.name : slug,
        price,
        freq,
      };
    });

    simTotalAnnual += childAnnual;
    simTotalMonthly += childMonthly;

    return {
      ...child,
      childAnnual,
      childMonthly,
      discDetails,
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-4">
        <div className="w-12 h-12 border-4 border-[#E52421] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Chargement de la grille tarifaire...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 bg-[#141419] shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD21F]/15 text-[#FFD21F] flex items-center justify-center border border-[#FFD21F]/30">
                <Coins className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tarifs & Grille de Cotisations
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-2 max-w-2xl">
              Configurez le montant et la périodicité de l&apos;assurance, des cotisations par discipline (annuel ou mensuel), ainsi que le calendrier des échéances affiché aux adhérents et familles.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#E52421]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 font-display"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer la grille</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-2.5 animate-fade-in font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 flex items-center gap-2.5 animate-fade-in font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Assurance & Frais d'Adhésion Club */}
        <div className="p-6 sm:p-8 bg-[#141419] border border-white/5 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-start justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>1. Assurance & Frais d&apos;Adhésion de Base</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Frais appliqués pour chaque enfant ou adhérent inscrit (couverture assurance sportive et affiliation au club).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pricing.insurance.enabled}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    insurance: { ...pricing.insurance, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Libellé affiché sur la facture / reçu
              </label>
              <input
                type="text"
                value={pricing.insurance.name}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    insurance: { ...pricing.insurance, name: e.target.value },
                  })
                }
                className="w-full bg-[#1C1C24] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Montant par adhérent (DZD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={pricing.insurance.priceDzd}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      insurance: {
                        ...pricing.insurance,
                        priceDzd: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl p-3 pr-12 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-mono font-bold text-gray-400">
                  DZD
                </span>
              </div>
            </div>

            <div className="sm:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Périodicité de l&apos;assurance
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setPricing({
                      ...pricing,
                      insurance: { ...pricing.insurance, frequency: "annual" },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    pricing.insurance.frequency === "annual"
                      ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-[#1C1C24] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <Calendar className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-bold block text-white">Annuel (Recommandé)</span>
                    <span className="text-xs text-gray-400">
                      Payé une seule fois à l&apos;inscription pour couvrir toute la saison.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPricing({
                      ...pricing,
                      insurance: { ...pricing.insurance, frequency: "monthly" },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    pricing.insurance.frequency === "monthly"
                      ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-[#1C1C24] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <Clock className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-bold block text-white">Mensuel</span>
                    <span className="text-xs text-gray-400">
                      Fractionné et facturé chaque mois avec les cours.
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Tarifs par Discipline / Sport */}
        <div className="p-6 sm:p-8 bg-[#141419] border border-white/5 rounded-3xl space-y-6 shadow-xl">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-[#E52421]" />
              <span>2. Cotisations par Discipline (Sports)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Définissez le tarif et si la cotisation est mensuelle ou annuelle pour chaque sport. Si un adhérent pratique 2 disciplines, les montants s&apos;additionnent avec le détail transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(pricing.disciplines).map((slug) => {
              const disc = pricing.disciplines[slug];
              const isMonthly = disc.frequency === "monthly";

              return (
                <div
                  key={slug}
                  className={`p-6 rounded-2xl border transition space-y-5 ${
                    disc.enabled
                      ? "bg-[#1C1C24] border-white/10 hover:border-white/20"
                      : "bg-[#141419] border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E52421]" />
                      {disc.name}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disc.enabled}
                        onChange={(e) => updateDiscipline(slug, "enabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E52421]"></div>
                    </label>
                  </div>

                  {/* Price input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold block">
                      Tarif de la cotisation
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={disc.priceDzd}
                        onChange={(e) =>
                          updateDiscipline(
                            slug,
                            "priceDzd",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 pr-12 text-sm font-mono font-bold text-[#FFD21F] focus:outline-none focus:border-[#FFD21F]"
                        required
                      />
                      <span className="absolute right-3 top-3 text-xs font-mono font-bold text-gray-400">
                        DZD
                      </span>
                    </div>
                  </div>

                  {/* Frequency toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold block">
                      Type de paiement
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateDiscipline(slug, "frequency", "monthly")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isMonthly
                            ? "bg-[#E52421]/20 border border-[#E52421] text-white shadow-sm"
                            : "bg-[#141419] border border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mensuel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateDiscipline(slug, "frequency", "annual")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          !isMonthly
                            ? "bg-[#FFD21F]/20 border border-[#FFD21F] text-[#FFD21F] shadow-sm"
                            : "bg-[#141419] border border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Annuel</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 text-center font-mono">
                    {isMonthly ? (
                      <span className="text-white">
                        {disc.priceDzd.toLocaleString()} DA / mois
                      </span>
                    ) : (
                      <span className="text-[#FFD21F]">
                        {disc.priceDzd.toLocaleString()} DA / saison (unique)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Calendrier & Règle d'Alerte de Retard */}
        <div className="p-6 sm:p-8 bg-[#141419] border border-white/5 rounded-3xl space-y-6 shadow-xl">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#FFD21F]" />
              <span>3. Calendrier & Échéances de Règlement</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Paramétrez le jour limite de paiement mensuel après lequel un message d&apos;alerte de retard s&apos;affiche sur le compte de l&apos;adhérent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Jour limite de paiement mensuel (1 - 28)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={pricing.paymentDeadlineDay}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      paymentDeadlineDay: parseInt(e.target.value, 10) || 5,
                    })
                  }
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl p-3 pr-20 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#FFD21F]"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-gray-400 font-mono">
                  de chaque mois
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Exemple : Si fixé au <strong>5</strong>, un adhérent qui n&apos;a pas réglé sa mensualité le 6 verra l&apos;alerte : <em>&quot;Paiement en retard pour le mois en cours&quot;</em>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                Mois inclus dans la saison sportive ({pricing.seasonMonths.length} mois)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#1C1C24] border border-white/5 max-h-36 overflow-y-auto">
                {pricing.seasonMonths.map((m) => (
                  <span
                    key={m.id}
                    className="px-2.5 py-1 bg-[#141419] border border-white/10 rounded-lg text-xs font-mono text-gray-200"
                  >
                    {m.labelFr}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Simulateur en Temps Réel (Multi-enfants) */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1C1C24] via-[#141419] to-[#141419] border border-[#FFD21F]/30 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD21F]/20 text-[#FFD21F] flex items-center justify-center border border-[#FFD21F]/40">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Simulateur en Direct : Formule Multi-enfants</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFD21F]/15 text-[#FFD21F] text-[10px] font-mono font-bold uppercase">
                    Aperçu Adhérent
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Vérifiez instantanément comment vos tarifs s&apos;appliquent pour une famille avec plusieurs enfants inscrits.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSimChildren([
                  ...simChildren,
                  {
                    id: Date.now(),
                    name: `Enfant ${simChildren.length + 1}`,
                    disciplines: ["parkour"],
                  },
                ])
              }
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un enfant au test</span>
            </button>
          </div>

          {/* Children Roster in Simulator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simBreakdown.map((child, index) => (
              <div
                key={child.id}
                className="p-5 bg-[#141419] border border-white/10 rounded-2xl space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FFD21F]" />
                    {child.name}
                  </span>
                  {simChildren.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSimChildren(simChildren.filter((c) => c.id !== child.id))
                      }
                      className="text-gray-500 hover:text-red-400 p-1"
                      title="Retirer cet enfant du test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Disciplines picker for this child */}
                <div>
                  <span className="text-[11px] text-gray-400 block mb-1">
                    Disciplines pratiquées :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(pricing.disciplines).map((slug) => {
                      const isSelected = child.disciplines.includes(slug);
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => {
                            const newDisciplines = isSelected
                              ? child.disciplines.filter((s) => s !== slug)
                              : [...child.disciplines, slug];
                            setSimChildren(
                              simChildren.map((c) =>
                                c.id === child.id
                                  ? { ...c, disciplines: newDisciplines }
                                  : c
                              )
                            );
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            isSelected
                              ? "bg-[#E52421]/20 border-[#E52421] text-white"
                              : "bg-[#1C1C24] border-white/5 text-gray-400 hover:text-white"
                          }`}
                        >
                          {pricing.disciplines[slug]?.name || slug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtotal for this child */}
                <div className="pt-2 border-t border-white/5 text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-gray-300">
                    <span>Assurance ({simInsuranceFreq}) :</span>
                    <span className="text-emerald-400">{simInsurance.toLocaleString()} DA</span>
                  </div>
                  {child.discDetails.map((d) => (
                    <div key={d.slug} className="flex justify-between text-gray-300">
                      <span>
                        {d.name} ({d.freq}) :
                      </span>
                      <span className="text-[#FFD21F]">{d.price.toLocaleString()} DA</span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-white/5 flex justify-between font-bold text-white text-xs">
                    <span>Sous-total enfant :</span>
                    <span>
                      {child.childAnnual > 0 && `${child.childAnnual.toLocaleString()} DA (Annuel)`}
                      {child.childAnnual > 0 && child.childMonthly > 0 && " + "}
                      {child.childMonthly > 0 && `${child.childMonthly.toLocaleString()} DA / mois`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Family Combined Result Box */}
          <div className="p-5 bg-black/60 border border-[#FFD21F]/40 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-gray-400 block">
                Total Familial Calculé ({simChildren.length} adhérents)
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                {simTotalAnnual > 0 && (
                  <span className="text-emerald-400">
                    {simTotalAnnual.toLocaleString()} DZD <span className="text-xs font-mono text-white/60">au total annuel</span>
                  </span>
                )}
                {simTotalAnnual > 0 && simTotalMonthly > 0 && (
                  <span className="text-white/40 text-xl mx-2">+</span>
                )}
                {simTotalMonthly > 0 && (
                  <span className="text-[#FFD21F]">
                    {simTotalMonthly.toLocaleString()} DZD <span className="text-xs font-mono text-white/60">/ mois</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs text-right text-gray-400 font-mono">
              <div>Assurances cumulées : {(simInsurance * simChildren.length).toLocaleString()} DZD</div>
              <div className="text-white/70">Formule dynamique prête pour le tableau de bord</div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#E52421] hover:bg-[#FF3030] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#E52421]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 font-display"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer la grille tarifaire</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
