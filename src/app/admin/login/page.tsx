"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AdminEnergyBackground } from "@/components/admin/AdminEnergyBackground";
import { Shield, Lock, Phone, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const { t, isRtl, locale } = useLanguage();
  const isArabic = locale === "ar";
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggedInParticipant, setLoggedInParticipant] = useState<{
    phone: string;
    name?: string;
  } | null>(null);
  const [error, setError] = useState("");

  React.useEffect(() => {
    const checkCurrentSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            if (data.user.role === "ADMIN") {
              router.push("/admin");
              return;
            } else {
              setLoggedInParticipant({
                phone: data.user.phone,
                name: data.user.participant
                  ? `${data.user.participant.firstName} ${data.user.participant.lastName}`
                  : undefined,
              });
            }
          }
        }
      } catch {
        // Ignore session check errors
      } finally {
        setCheckingSession(false);
      }
    };
    checkCurrentSession();
  }, [router]);

  const handleDisconnectParticipant = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setLoggedInParticipant(null);
      setError("");
    } catch {
      setError(
        isArabic
          ? "خطأ أثناء تسجيل الخروج."
          : "Erreur lors de la déconnexion."
      );
    } finally {
      setLoading(false);
    }
  };

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
        await fetch("/api/auth/logout", { method: "POST" });
        throw new Error(
          isArabic
            ? "تم رفض الدخول. هذا الحساب لا يملك صلاحيات المسؤول."
            : "Accès refusé. Ce compte ne dispose pas des privilèges d'administrateur."
        );
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
    <div
      className={`min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#E52421] selection:text-white relative overflow-hidden ${
        isArabic ? "font-admin-arabic" : "font-admin"
      }`}
    >
      {/* Nature HCD Background */}
      <AdminEnergyBackground />

      {/* Top utility bar */}
      <header className="relative z-10 border-b border-white/[0.08] px-6 py-4 flex items-center justify-between bg-[#040407]/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shadow-md">
            <Image
              src="/images/club/logo.svg"
              alt="ADD Parkour Oran"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              unoptimized
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm tracking-wider text-white uppercase group-hover:text-[#E52421] transition-colors leading-none">
              ADD <span className="text-[#E52421]">ORAN</span>
            </span>
            <span
              className={`text-[9px] tracking-widest text-white/50 uppercase mt-0.5 font-semibold ${
                isArabic ? "font-arabic" : "font-mono"
              }`}
            >
              {isArabic ? "منصة الإدارة والتحكم" : "ADMINISTRATION"}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/"
            className="text-xs font-mono text-white/60 hover:text-white transition-colors flex items-center gap-1 border border-white/5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <span>{t.admin.viewPublicSite}</span>
            <span className={isRtl ? "rotate-[-90deg]" : ""}>↗</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="max-w-md w-full bg-[#06060A] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-48 before:h-[2px] before:bg-gradient-to-r before:from-[#E52421] before:to-transparent before:shadow-[0_0_12px_#E52421]">
          {/* Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#E52421]/15 border border-[#E52421]/30 text-[#E52421] flex items-center justify-center mx-auto shadow-lg shadow-[#E52421]/20">
              <Shield className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21F]/10 border border-[#FFD21F]/30 text-[#FFD21F] text-[10px] font-mono font-medium uppercase tracking-wider">
              <span>{t.admin.login.badge}</span>
            </div>

            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
              {t.admin.login.title}
            </h1>
            <p className="text-xs text-white/60 leading-relaxed font-body">
              {t.admin.login.subtitle}
            </p>
          </div>

          {/* Participant Active Session Alert */}
          {loggedInParticipant && (
            <div className="p-4 bg-[#FFD21F]/10 border border-[#FFD21F]/30 rounded-2xl space-y-3 animate-in fade-in text-xs font-mono">
              <div className="flex items-start gap-2.5 text-[#FFD21F]">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-sm">
                    {isArabic ? "جلسة منخرط نشطة" : "Session Adhérent Active"}
                  </strong>
                  <p className="text-gray-300 mt-1 font-body">
                    {isArabic
                      ? "أنت متصل حالياً كمنخرط: "
                      : "Vous êtes actuellement connecté en tant qu'adhérent : "}
                    <span className="font-bold text-white font-mono">
                      {loggedInParticipant.name || loggedInParticipant.phone}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#FFD21F]/20">
                <button
                  type="button"
                  onClick={handleDisconnectParticipant}
                  disabled={loading}
                  className="flex-1 py-2 px-3 bg-[#E52421] hover:bg-[#FF3030] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer"
                >
                  {loading
                    ? isArabic ? "جارٍ الخروج..." : "Déconnexion..."
                    : isArabic ? "تسجيل الخروج والدخول كمسؤول" : "Déconnecter et entrer en admin"}
                </button>
                <Link
                  href="/dashboard"
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition text-center border border-white/10"
                >
                  {isArabic ? "فضاء المنخرط ↗" : "Espace adhérent ↗"}
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-[#E52421]/15 border border-[#E52421]/40 rounded-xl text-[#FF8585] text-xs font-mono flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#E52421] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label
                className={`block text-xs font-bold uppercase text-white/60 mb-1.5 ${
                  isArabic ? "font-arabic" : "font-mono"
                }`}
              >
                {t.admin.login.phoneLabel}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    isRtl ? "right-0 pr-3.5" : "left-0 pl-3.5"
                  } flex items-center pointer-events-none text-white/40`}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0555000000"
                  className={`w-full bg-[#0B0B12] border border-white/10 rounded-xl ${
                    isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 text-sm text-white placeholder-white/30 focus:border-[#E52421] focus:outline-none focus:ring-1 focus:ring-[#E52421] transition-all font-mono`}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase text-white/60 mb-1.5 ${
                  isArabic ? "font-arabic" : "font-mono"
                }`}
              >
                {t.admin.login.passwordLabel}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    isRtl ? "right-0 pr-3.5" : "left-0 pl-3.5"
                  } flex items-center pointer-events-none text-white/40`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full bg-[#0B0B12] border border-white/10 rounded-xl ${
                    isRtl ? "pr-10 pl-11" : "pl-10 pr-11"
                  } py-3 text-sm text-white placeholder-white/30 focus:border-[#E52421] focus:outline-none focus:ring-1 focus:ring-[#E52421] transition-all font-mono`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${
                    isRtl ? "left-0 pl-3.5" : "right-0 pr-3.5"
                  } flex items-center text-white/40 hover:text-white transition-colors cursor-pointer`}
                  aria-label={
                    showPassword
                      ? t.admin.login.hidePassword
                      : t.admin.login.showPassword
                  }
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#E52421] hover:bg-[#FF3030] text-white font-medium text-xs tracking-wider transition-all shadow-lg shadow-[#E52421]/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{loading ? t.admin.login.submitting : t.admin.login.submitButton}</span>
              <ArrowRight
                className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
                  isRtl ? "rotate-180" : ""
                }`}
              />
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-white/[0.08] text-center">
            <p className="text-[10px] text-white/40 leading-relaxed font-body">
              {t.admin.login.securityNotice}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-4 text-center font-mono text-[11px] text-white/40 bg-[#040407]">
        Club Art Du Déplacement Parkour Oran // Console d&apos;Administration
      </footer>
    </div>
  );
}
