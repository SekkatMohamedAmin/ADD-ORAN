"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Menu, X, ArrowUpRight, Shield, User } from "lucide-react";

export function Navbar() {
  const { t, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
      scrolled
        ? "bg-[#0A0A0D]/95 border-white/15 shadow-2xl"
        : "bg-[#0A0A0D]/85 border-white/10"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md">
              <Image
                src="/images/club/logo.svg"
                alt="ADD Parkour Oran"
                width={44}
                height={44}
                style={{ width: '100%', height: '100%' }}
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wider text-[#F5F5F2] uppercase group-hover:text-[#FFD21F] transition-colors leading-none">
                ADD ORAN
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#9E9EA8] uppercase mt-1">
                PARKOUR • ESCALADE • TRAIL
              </span>
            </div>
          </Link>

          {/* Minimal Athletic Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#disciplines"
              className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
            >
              {t.nav.disciplines}
            </Link>
            <Link
              href="/#last-season"
              className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
            >
              {t.home.lastSeasonTitle}
            </Link>
            <Link
              href="/#about"
              className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md group"
            >
              <span>{t.nav.registration}</span>
              <ArrowUpRight className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
            </Link>
          </nav>

          {/* Right utility actions: Language, Member Space, Admin */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-mono uppercase px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-[#9E9EA8] hover:text-[#F5F5F2] border border-white/10 transition-all"
              title={t.nav.participantSpace}
            >
              <User className="w-3.5 h-3.5 text-[#FFD21F]" />
              <span>{t.nav.participantSpace}</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-mono uppercase px-2.5 py-2 rounded bg-white/5 hover:bg-[#E52421]/20 text-[#9E9EA8] hover:text-[#FF3030] border border-white/10 transition-all"
              title={t.nav.admin}
            >
              <Shield className="w-3.5 h-3.5 text-[#E52421]" />
              <span>{t.nav.admin}</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onTouchEnd={(e) => { e.preventDefault(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="p-2 rounded bg-white/5 text-[#9E9EA8] hover:text-[#F5F5F2] border border-white/10"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0D] border-b border-white/10 px-5 pt-4 pb-6 space-y-4">
          <Link
            href="/#disciplines"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-lg font-bold uppercase tracking-wider text-[#F5F5F2] hover:text-[#FFD21F]"
          >
            {t.nav.disciplines}
          </Link>
          <Link
            href="/#last-season"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-lg font-bold uppercase tracking-wider text-[#F5F5F2] hover:text-[#FFD21F]"
          >
            {t.home.lastSeasonTitle}
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-lg font-bold uppercase tracking-wider text-[#F5F5F2] hover:text-[#FFD21F]"
          >
            {t.nav.about}
          </Link>
          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded font-display font-black text-lg text-[#F5F5F2] bg-[#E52421] hover:bg-[#FF3030] text-center uppercase tracking-wider transition-colors shadow-md"
          >
            {t.nav.registration}
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-mono text-[#F5F5F2] bg-white/5 border border-white/10"
            >
              <User className="w-4 h-4 text-[#FFD21F]" />
              {t.nav.participantSpace}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-mono text-[#9E9EA8] bg-white/5 border border-white/10"
            >
              <Shield className="w-4 h-4 text-[#E52421]" />
              {t.nav.admin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
