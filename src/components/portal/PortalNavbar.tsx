"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { usePortal } from "./PortalContext";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  CreditCard,
  CreditCard as IdCard,
  Users,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  UserPlus,
  ChevronDown,
  Sparkles,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function PortalNavbar() {
  const { t, isRtl } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const {
    userPhone,
    participants,
    selectedParticipantId,
    setSelectedParticipantId,
    selectedParticipant,
    activeRegistration,
    isFamilyAccount,
    hasPendingCorrection,
    openAddChildModal,
  } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: t.dashboard.navOverview,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/dashboard/documents",
      label: t.dashboard.navDocuments,
      icon: FileText,
      badge: hasPendingCorrection ? (
        <span className="w-2 h-2 rounded-full bg-[#E52421] animate-ping" />
      ) : null,
    },
    {
      href: "/dashboard/events",
      label: t.dashboard.navEvents,
      icon: Calendar,
      badge: null,
    },
    {
      href: "/dashboard/payments",
      label: t.dashboard.navPayments,
      icon: CreditCard,
      badge: null,
    },
    {
      href: "/dashboard/card",
      label: t.dashboard.navCard,
      icon: IdCard,
      badge: activeRegistration?.status === "ACTIVE" ? (
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          PRO
        </span>
      ) : null,
    },
    {
      href: "/dashboard/family",
      label: isFamilyAccount ? t.dashboard.navFamily : "Mon Profil",
      icon: Users,
      badge: isFamilyAccount && participants.length > 1 ? (
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/80">
          {participants.length}
        </span>
      ) : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0D]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      {/* Top Tier: Logo, Child Quick Switcher, User Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg group-hover:border-[#E52421]/60 transition-colors">
                <Image
                  src="/images/club/logo.svg"
                  alt="ADD Oran Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black tracking-tight text-white text-base">
                    ADD ORAN
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#E52421]/15 text-[#E52421] border border-[#E52421]/30">
                    2026
                  </span>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                  {isFamilyAccount ? t.dashboard.parentSpace : t.dashboard.adherentSpace}
                </span>
              </div>
            </Link>

            {/* Public site link */}
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/15"
              title="Ouvrir le site public"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Site Public</span>
            </Link>
          </div>

          {/* Child Switcher Pill (Desktop) */}
          {participants.length > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setChildDropdownOpen(!childDropdownOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    hasPendingCorrection
                      ? "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/15"
                      : "bg-white/[0.04] border-white/10 text-white/90 hover:bg-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#E52421]/20 border border-[#E52421]/40 flex items-center justify-center font-bold text-[11px] text-[#E52421]">
                    {selectedParticipant?.firstName?.charAt(0) || "A"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-xs leading-none">
                      {selectedParticipant?.firstName} {selectedParticipant?.lastName}
                    </span>
                    <span className="text-[10px] text-white/50 leading-none mt-0.5">
                      {selectedParticipant?.isMinor
                        ? `Mineur • ${
                            new Date().getFullYear() -
                            new Date(selectedParticipant.dateOfBirth).getFullYear()
                          } ans`
                        : "Adhérent Majeur"}
                    </span>
                  </div>
                  {participants.length > 1 && (
                    <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                  )}
                  {hasPendingCorrection && (
                    <span className="w-2 h-2 rounded-full bg-[#E52421] animate-pulse" />
                  )}
                </button>

                {/* Dropdown for multiple children */}
                {childDropdownOpen && participants.length > 1 && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#111116] border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/40 border-b border-white/5 mb-1">
                      Sélectionner le profil à gérer
                    </div>
                    {participants.map((p) => {
                      const age =
                        new Date().getFullYear() -
                        new Date(p.dateOfBirth).getFullYear();
                      const isSelected = p.id === selectedParticipantId;
                      const pHasFix = p.registrations.some(
                        (r) =>
                          r.status === "NEEDS_CORRECTION" ||
                          r.status === "REJECTED"
                      );
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedParticipantId(p.id);
                            setChildDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                            isSelected
                              ? "bg-[#E52421]/15 text-white font-bold border border-[#E52421]/30"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-white/80">
                              {p.firstName.charAt(0)}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="leading-tight">
                                {p.firstName} {p.lastName}
                              </span>
                              <span className="text-[10px] text-white/40">
                                {p.isMinor ? `${age} ans` : "Majeur"}
                              </span>
                            </div>
                          </div>
                          {pHasFix && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-300 font-mono">
                              À corriger
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {isFamilyAccount && (
                      <button
                        type="button"
                        onClick={() => {
                          setChildDropdownOpen(false);
                          openAddChildModal();
                        }}
                        className="w-full mt-1.5 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#FFD21F] bg-[#FFD21F]/10 hover:bg-[#FFD21F]/20 border border-[#FFD21F]/20 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Inscrire un autre enfant</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Direct Add Child CTA if family */}
              {isFamilyAccount && (
                <button
                  type="button"
                  onClick={openAddChildModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FFD21F]/10 hover:bg-[#FFD21F]/20 text-[#FFD21F] border border-[#FFD21F]/20 transition-colors"
                  title="Ajouter un enfant à ce compte"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Inscrire un enfant</span>
                </button>
              )}
            </div>
          )}

          {/* Right Controls: User info, Language, Logout */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-mono text-white/80 font-bold">
                {userPhone}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Connecté
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-red-500/15 text-white/60 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-all focus:outline-none"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Tier: Navigation Tabs with Active Indicator */}
      <div className="hidden md:block border-t border-white/5 bg-[#0D0D12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 lg:space-x-2 py-2 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-[#E52421] text-white shadow-lg shadow-[#E52421]/20 font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-white/40"}`} />
                  <span>{link.label}</span>
                  {link.badge}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0A0D] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          {/* Mobile Child Switcher */}
          {participants.length > 0 && (
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 uppercase">
                <span>Profil actif</span>
                {isFamilyAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAddChildModal();
                    }}
                    className="text-[#FFD21F] font-bold flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>+ Enfant</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {participants.map((p) => {
                  const isSelected = p.id === selectedParticipantId;
                  const pHasFix = p.registrations.some(
                    (r) =>
                      r.status === "NEEDS_CORRECTION" ||
                      r.status === "REJECTED"
                  );
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedParticipantId(p.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                        isSelected
                          ? "bg-[#E52421]/20 border border-[#E52421]/40 text-white font-bold"
                          : "bg-white/5 text-white/70"
                      }`}
                    >
                      <span className="truncate">
                        {p.firstName} {p.lastName}
                      </span>
                      {pHasFix && (
                        <span className="text-[10px] text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                          À corriger
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                    isActive
                      ? "bg-[#E52421] text-white"
                      : "bg-white/[0.03] text-white/70 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
