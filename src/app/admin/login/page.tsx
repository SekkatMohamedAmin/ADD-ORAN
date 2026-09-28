"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Shield, Lock, Phone, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
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
        throw new Error(data.error || t.admin.login.errorInvalid);
      }

      if (data.user?.role !== "ADMIN") {
        // Disconnect immediately if not admin
        await fetch("/api/auth/logout", { method: "POST" });
        throw new Error("Accès refusé. Ce compte ne dispose pas des privilèges d'administrateur.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2] relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/hero/hero-parkour.jpg"
          alt="ADD Oran Hero"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30 filter contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/80 to-[#0A0A0D]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0D_85%)]" />
        <div className="absolute inset-0 sports-grid-pattern opacity-30" />
      </div>

      {/* Top utility bar */}
      <header className="relative z-10 border-b border-white/10 px-6 py-4 flex items-center justify-between bg-[#0A0A0D]/60 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded overflow-hidden shadow-md">
            <Image
              src="/images/club/logo.svg"
              alt="ADD Parkour Oran"
              width={36}
              height={36}
              style={{ width: "100%", height: "100%" }}
              className="object-contain"
              unoptimized
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm tracking-wider text-[#F5F5F2] uppercase group-hover:text-[#FFD21F] transition-colors leading-none">
              ADD ORAN
            </span>
            <span className="font-mono text-[9px] tracking-widest text-[#E52421] uppercase mt-0.5">
              ADMINISTRATION
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/"
            className="text-xs font-mono text-[#9E9EA8] hover:text-[#F5F5F2] transition-colors flex items-center gap-1"
          >
            <span>{t.admin.viewPublicSite}</span>
            <span>↗</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="max-w-md w-full bg-[#141419] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#E52421]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#E52421]/15 border border-[#E52421]/30 text-[#E52421] flex items-center justify-center mx-auto shadow-lg">
              <Shield className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21F]/10 border border-[#FFD21F]/30 text-[#FFD21F] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span>{t.admin.login.badge}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F5F2]">
              {t.admin.login.title}
            </h1>
            <p className="font-body text-xs text-[#9E9EA8] leading-relaxed">
              {t.admin.login.subtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-[#E52421]/15 border border-[#E52421]/40 rounded-xl text-[#FF8585] text-xs font-mono flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-[#E52421] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#9E9EA8] mb-1.5">
                {t.admin.login.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9EA8]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0555000000"
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#F5F5F2] placeholder-[#9E9EA8]/40 focus:border-[#E52421] focus:outline-none focus:ring-1 focus:ring-[#E52421] transition-all font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#9E9EA8] mb-1.5">
                {t.admin.login.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9EA8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1C1C24] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-[#F5F5F2] placeholder-[#9E9EA8]/40 focus:border-[#E52421] focus:outline-none focus:ring-1 focus:ring-[#E52421] transition-all font-mono"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E9EA8] hover:text-[#F5F5F2] transition-colors"
                  aria-label={showPassword ? t.admin.login.hidePassword : t.admin.login.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-[#E52421]/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              <span>{loading ? t.admin.login.submitting : t.admin.login.submitButton}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="font-mono text-[10px] text-[#9E9EA8]/70 leading-relaxed">
              {t.admin.login.securityNotice}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center font-mono text-[11px] text-[#9E9EA8]">
        Club Art Du Déplacement Parkour Oran // Console d&apos;Administration v1.0
      </footer>
    </div>
  );
}
