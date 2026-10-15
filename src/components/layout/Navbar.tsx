"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import {
  Menu,
  X,
  ArrowUpRight,
  Shield,
  User,
  CreditCard,
  Calendar,
  LogOut,
  Activity,
} from "lucide-react";

interface AuthUserSession {
  id: string;
  phone: string;
  role: "ADMIN" | "PARTICIPANT";
  participant?: {
    id: string;
    firstName: string;
    lastName: string;
    membershipCardNumber?: string | null;
  } | null;
}

export function Navbar() {
  const { t, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUserSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch session user once on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error("Navbar auth check error:", err);
      } finally {
        if (isMounted) setAuthChecked(true);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setCurrentUser(null);
      window.location.href = "/login";
    }
  };

  const isParticipant = currentUser?.role === "PARTICIPANT";
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
        scrolled
          ? "bg-[#0A0A0D]/95 border-white/15 shadow-2xl"
          : "bg-[#0A0A0D]/85 border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md">
              <Image
                src="/images/club/logo.svg"
                alt="ADD Parkour Oran"
                width={44}
                height={44}
                style={{ width: "100%", height: "100%" }}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {isParticipant ? (
              /* Custom User Space Navigation Items */
              <>
                <Link
                  href="/dashboard#card"
                  className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-[#FFD21F] hover:text-white transition-colors group"
                >
                  <CreditCard className="w-4 h-4 text-[#FFD21F] group-hover:scale-110 transition-transform" />
                  <span>{t.nav.myCard}</span>
                </Link>

                <Link
                  href="/dashboard#subscriptions"
                  className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors group"
                >
                  <Activity className="w-4 h-4 text-[#E52421] group-hover:scale-110 transition-transform" />
                  <span>{t.nav.mySubscriptions}</span>
                </Link>

                <Link
                  href="/dashboard#events"
                  className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors group"
                >
                  <Calendar className="w-4 h-4 text-[#00D4FF] group-hover:scale-110 transition-transform" />
                  <span>{t.nav.upcomingEvents}</span>
                </Link>

                <Link
                  href="/#disciplines"
                  className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
                >
                  {t.nav.disciplines}
                </Link>
              </>
            ) : isAdmin ? (
              /* Admin Navigation Items */
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-[#E52421] hover:text-[#FF3030] transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Tableau de Bord</span>
                </Link>
                <Link
                  href="/admin/participants"
                  className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
                >
                  Adhérents
                </Link>
                <Link
                  href="/admin/registrations"
                  className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
                >
                  Inscriptions
                </Link>
                <Link
                  href="/#disciplines"
                  className="font-display text-sm font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] transition-colors"
                >
                  {t.nav.disciplines}
                </Link>
              </>
            ) : (
              /* Public / Guest Navigation Items */
              <>
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
                  <ArrowUpRight
                    className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                      isRtl ? "rtl-flip" : ""
                    }`}
                  />
                </Link>
              </>
            )}
          </nav>

          {/* Right utility actions: User space badge, Admin, Language */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            {isParticipant ? (
              /* Personalized Member Chip & Logout */
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#FFD21F]/30 hover:border-[#FFD21F]/60 transition-all group"
                  title="Accéder à mon espace adhérent"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FFD21F]/20 border border-[#FFD21F]/40 text-[#FFD21F] flex items-center justify-center font-display font-black text-xs">
                    {currentUser?.participant?.firstName?.[0] || "A"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-display font-black text-xs text-white uppercase leading-none group-hover:text-[#FFD21F] transition-colors">
                      {currentUser?.participant?.firstName || "Adhérent"}
                    </span>
                    <span className="font-mono text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connecté
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#E52421]/20 text-[#9E9EA8] hover:text-[#FF3030] border border-white/10 hover:border-[#E52421]/40 transition-all cursor-pointer"
                  title={t.common.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdmin ? (
              /* Admin Profile Chip & Logout */
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E52421]/15 hover:bg-[#E52421]/25 border border-[#E52421]/30 text-white font-mono text-xs uppercase"
                >
                  <Shield className="w-3.5 h-3.5 text-[#E52421]" />
                  <span>Admin ({currentUser?.phone.slice(-4)})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#E52421]/20 text-[#9E9EA8] hover:text-[#FF3030] border border-white/10 hover:border-[#E52421]/40 transition-all cursor-pointer"
                  title={t.common.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Guest Actions */
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/5 text-[#9E9EA8] hover:text-[#F5F5F2] border border-white/10 active:scale-95 cursor-pointer select-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0D] border-b border-white/10 px-5 pt-4 pb-6 space-y-4 animate-slide-up">
          {isParticipant ? (
            /* Member Personal Drawer */
            <div className="space-y-3">
              {/* Member Greeting Banner */}
              <div className="p-3 bg-white/5 border border-[#FFD21F]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFD21F]/20 border border-[#FFD21F]/40 text-[#FFD21F] flex items-center justify-center font-display font-black text-sm">
                    {currentUser?.participant?.firstName?.[0] || "A"}
                  </div>
                  <div>
                    <div className="font-display font-black text-sm text-white uppercase">
                      {currentUser?.participant?.firstName} {currentUser?.participant?.lastName}
                    </div>
                    <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Adhérent Officiel • Connecté
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Member Links */}
              <Link
                href="/dashboard#card"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FFD21F]/10 border border-[#FFD21F]/30 text-[#FFD21F] font-display font-black text-base uppercase tracking-wider"
              >
                <CreditCard className="w-5 h-5 text-[#FFD21F]" />
                <span>{t.nav.myCard}</span>
              </Link>

              <Link
                href="/dashboard#subscriptions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-base uppercase tracking-wider"
              >
                <Activity className="w-5 h-5 text-[#E52421]" />
                <span>{t.nav.mySubscriptions}</span>
              </Link>

              <Link
                href="/dashboard#events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-base uppercase tracking-wider"
              >
                <Calendar className="w-5 h-5 text-[#00D4FF]" />
                <span>{t.nav.upcomingEvents}</span>
              </Link>

              <Link
                href="/#disciplines"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-display text-base font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] px-3 py-1"
              >
                {t.nav.disciplines}
              </Link>

              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-display text-base font-bold uppercase tracking-wider text-[#9E9EA8] hover:text-[#FFD21F] px-3 py-1"
              >
                {t.nav.about}
              </Link>

              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52421]/15 text-[#FF3030] font-mono text-xs font-bold border border-[#E52421]/30 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.common.logout}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Guest Drawer */
            <>
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
            </>
          )}
        </div>
      )}
    </header>
  );
}

