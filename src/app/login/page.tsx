"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { t, isRtl } = useLanguage();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex flex-col bg-[#00141f] text-[#f4f7f9]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-md w-full bg-[#072538] border-2 border-[#17425f] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#003D5B] border border-[#00798C] text-[#EDAE49] flex items-center justify-center mx-auto shadow-md">
              <User className="w-7 h-7" />
            </div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white">
              {t.common.login}
            </h1>
            <p className="font-editorial italic text-sm text-[#8faec5]">
              Accédez à votre espace adhérent ou console d&apos;administration.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#D1495B]/20 border border-[#D1495B] rounded-xl text-[#fbd2d7] text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#f17887] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#8faec5] mb-1.5">
                {t.registration.account.phoneLabel}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0555 12 34 56"
                  required
                  className="w-full px-4 py-3 bg-[#00141f] border border-[#17425f] rounded-xl text-white text-sm font-mono focus:border-[#EDAE49] focus:ring-1 focus:ring-[#EDAE49] outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#8faec5] mb-1.5">
                {t.registration.account.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#00141f] border border-[#17425f] rounded-xl text-white text-sm font-mono focus:border-[#EDAE49] focus:ring-1 focus:ring-[#EDAE49] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#EDAE49] hover:bg-[#ffc266] text-[#003D5B] font-display font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? t.common.loading : t.common.login}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rtl-flip" : ""}`} />
            </button>
          </form>

          <div className="pt-4 border-t border-[#17425f] text-center space-y-2">
            <p className="font-body text-xs text-[#8faec5]">
              Pas encore inscrit pour la saison 2026 ?
            </p>
            <Link
              href="/register"
              className="inline-block font-mono text-xs font-bold text-[#EDAE49] hover:text-[#ffc266] uppercase tracking-wide underline underline-offset-4"
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
