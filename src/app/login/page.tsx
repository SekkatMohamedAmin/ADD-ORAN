"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { t, isRtl } = useLanguage();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants invalides");
      }

      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2] relative overflow-hidden">
      <Navbar />

      {/* Atmospheric Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/hero/hero-parkour.jpg"
          alt="ADD Oran Athletic"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25 filter contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/85 to-[#0A0A0D]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0D_85%)]" />
        <div className="absolute inset-0 sports-grid-pattern opacity-30" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-md w-full bg-[#141419]/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl animate-slide-up">
          {/* Subtle accent glow */}
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#E52421]/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="text-center space-y-2 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#E52421]/15 border border-[#E52421]/30 text-[#E52421] flex items-center justify-center mx-auto shadow-lg shadow-[#E52421]/10">
              <User className="w-7 h-7" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-[#FFD21F] uppercase font-bold">
              PORTAIL ADHÉRENT // SAISON 2026
            </div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white">
              {t.common.login}
            </h1>
            <p className="font-editorial italic text-sm text-[#9E9EA8]">
              Accédez à votre dossier d&apos;adhésion et à vos documents officiels.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#E52421]/15 border border-[#E52421]/40 rounded-xl text-[#FF8585] text-xs font-mono flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-[#FF3030] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#9E9EA8] mb-1.5">
                {t.registration.account.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9EA8]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0555 12 34 56"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0A0A0D]/90 border border-white/10 rounded-xl text-white text-sm font-mono placeholder:text-white/20 focus:border-[#E52421] focus:ring-2 focus:ring-[#E52421]/20 outline-none transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#9E9EA8] mb-1.5">
                {t.registration.account.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9EA8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#0A0A0D]/90 border border-white/10 rounded-xl text-white text-sm font-mono placeholder:text-white/20 focus:border-[#E52421] focus:ring-2 focus:ring-[#E52421]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E9EA8] hover:text-white transition-colors"
                  aria-label="Afficher le mot de passe"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-[#E52421]/25 hover:shadow-[#E52421]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? t.common.loading : t.common.login}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rtl-flip" : ""}`} />
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center space-y-2 relative z-10">
            <p className="font-body text-xs text-[#9E9EA8]">
              Pas encore inscrit pour la saison 2026 ?
            </p>
            <Link
              href="/register"
              className="inline-block font-mono text-xs font-bold text-[#FFD21F] hover:text-white uppercase tracking-wider transition-colors underline underline-offset-4"
            >
              Créer mon adhésion en ligne →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
