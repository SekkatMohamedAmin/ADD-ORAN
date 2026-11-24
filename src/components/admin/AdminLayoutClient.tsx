"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AdminEnergyBackground } from "@/components/admin/AdminEnergyBackground";
import {
  FlaticonAdminDashboard,
  FlaticonAdminRegistrations,
  FlaticonAdminParticipants,
  FlaticonAdminCards,
  FlaticonAdminSeasons,
  FlaticonAdminPrices,
  FlaticonAdminPayments,
  FlaticonAdminDocuments,
  FlaticonAdminDuplicates,
  FlaticonAdminAudit,
  FlaticonAdminSettings,
  FlaticonAdminTrash,
  FlaticonAdminProfile,
} from "@/components/admin/AdminFlaticons";
import {
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminUser: {
    id: string;
    phone: string;
    role: string;
  };
}

export function AdminLayoutClient({ children, adminUser }: AdminLayoutClientProps) {
  const { t, isRtl, locale } = useLanguage();
  const isArabic = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  interface NavItem {
    label: string;
    href: string;
    icon: any;
    exact?: boolean;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: t.admin.nav.principal,
      items: [
        {
          label: t.admin.nav.dashboard,
          href: "/admin",
          icon: FlaticonAdminDashboard,
          exact: true,
        },
        {
          label: t.admin.nav.registrations,
          href: "/admin/registrations",
          icon: FlaticonAdminRegistrations,
        },
        {
          label: t.admin.nav.participants,
          href: "/admin/participants",
          icon: FlaticonAdminParticipants,
        },
        {
          label: t.admin.nav.cards,
          href: "/admin/cards/batch",
          icon: FlaticonAdminCards,
        },
      ],
    },
    {
      title: t.admin.nav.membership,
      items: [
        {
          label: t.admin.nav.seasons,
          href: "/admin/seasons",
          icon: FlaticonAdminSeasons,
        },
        {
          label: t.admin.nav.prices,
          href: "/admin/prices",
          icon: FlaticonAdminPrices,
        },
        {
          label: t.admin.nav.payments,
          href: "/admin/payments",
          icon: FlaticonAdminPayments,
        },
        {
          label: t.admin.nav.documents,
          href: "/admin/documents",
          icon: FlaticonAdminDocuments,
        },
        {
          label: t.admin.nav.duplicates,
          href: "/admin/duplicates",
          icon: FlaticonAdminDuplicates,
        },
      ],
    },
    {
      title: t.admin.nav.management,
      items: [
        {
          label: t.admin.nav.audit,
          href: "/admin/audit",
          icon: FlaticonAdminAudit,
        },
        {
          label: t.admin.nav.settings,
          href: "/admin/settings",
          icon: FlaticonAdminSettings,
        },
        {
          label: t.admin.nav.trash,
          href: "/admin/trash",
          icon: FlaticonAdminTrash,
        },
      ],
    },
    {
      title: t.admin.nav.account,
      items: [
        {
          label: t.admin.nav.profile,
          href: "/admin/profile",
          icon: FlaticonAdminProfile,
        },
      ],
    },
  ];

  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const activeLabel =
    navSections
      .flatMap((s) => s.items)
      .find((item) => isLinkActive(item.href, item.exact))?.label ||
    (isArabic ? "لوحة التحكم" : "Tableau de bord");

  return (
    <div
      className={`min-h-screen bg-[#000000] text-[#F5F5F2] flex flex-col md:flex-row selection:bg-[#E52421] selection:text-[#FFFFFF] relative overflow-x-hidden ${
        isArabic ? "font-admin-arabic" : "font-admin"
      }`}
    >
      {/* ========================================================
          SOLID UNIFIED BLACK BACKGROUND
         ======================================================== */}
      <AdminEnergyBackground />

      {/* ========================================================
          SIDEBAR: FIXED DESKTOP, RESPONSIVE DRAWER ON MOBILE
         ======================================================== */}
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200 cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-50 h-screen w-72 bg-[#050508] flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          isRtl
            ? "right-0 border-l border-white/[0.08]"
            : "left-0 border-r border-white/[0.08]"
        } ${
          sidebarOpen
            ? "translate-x-0 visible opacity-100 pointer-events-auto shadow-2xl"
            : isRtl
            ? "translate-x-full md:translate-x-0 invisible md:visible pointer-events-none md:pointer-events-auto"
            : "-translate-x-full md:translate-x-0 invisible md:visible pointer-events-none md:pointer-events-auto"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#030306]">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center shadow-lg group-hover:border-[#E52421]/50 transition-colors">
              <Image
                src="/images/club/logo.svg"
                alt="ADD Parkour Oran"
                width={36}
                height={36}
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
                className={`text-[9px] tracking-widest text-white/50 uppercase mt-1 font-semibold ${
                  isArabic ? "font-arabic" : "font-mono"
                }`}
              >
                {isArabic ? "منصة الإدارة والتحكم" : "ADMINISTRATION"}
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 md:hidden cursor-pointer active:scale-95 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className={`px-3 text-[10px] tracking-widest uppercase text-white/35 font-medium ${
                  isArabic ? "font-arabic" : "font-mono"
                }`}
              >
                {section.title}
              </div>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item, itemIdx) => {
                  const active = isLinkActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200 group cursor-pointer ${
                        active
                          ? isRtl
                            ? "bg-[#E52421]/15 text-white font-semibold border-r-2 border-[#E52421] shadow-[inset_-4px_0_12px_rgba(229,36,33,0.15)]"
                            : "bg-[#E52421]/15 text-white font-semibold border-l-2 border-[#E52421] shadow-[inset_4px_0_12px_rgba(229,36,33,0.15)]"
                          : "text-white/60 hover:text-white hover:bg-white/[0.04] font-normal"
                      }`}
                    >
                      <Icon
                        size={18}
                        active={active}
                        className={`shrink-0 transition-colors ${
                          active ? "text-[#E52421]" : "text-white/40 group-hover:text-white"
                        }`}
                      />
                      <span className={active ? "text-white" : ""}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User & Logout Area */}
        <div className="p-4 border-t border-white/[0.08] space-y-3 bg-[#030306]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#E52421]/15 border border-[#E52421]/30 text-[#E52421] flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                AD
              </div>
              <div className="flex flex-col truncate">
                <span className="font-mono text-xs font-medium text-white truncate">
                  {adminUser.phone}
                </span>
                <span className="font-mono text-[9px] text-white/50 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>{adminUser.role}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg text-white/50 hover:text-[#E52421] hover:bg-[#E52421]/10 transition-colors cursor-pointer active:scale-95"
              title={t.admin.nav.logout}
              aria-label={t.admin.nav.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MAIN APPLICATION AREA: HEADER + CONTENT
         ======================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative z-10 min-h-screen ${
          isRtl ? "md:mr-72" : "md:ml-72"
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#050508]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/5 md:hidden cursor-pointer active:scale-95 select-none"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Page Title */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-white/40 hidden sm:inline">
                {isArabic ? "الإدارة" : "Admin"}
              </span>
              <span className="text-white/20 hidden sm:inline">/</span>
              <span className="text-white font-bold">{activeLabel}</span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Public Website */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors border border-white/5 hover:border-white/15"
            >
              <span>{t.admin.viewPublicSite}</span>
              <ExternalLink className={`w-3.5 h-3.5 ${isRtl ? "rotate-[-90deg]" : ""}`} />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Admin Badge & Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0B12] border border-white/10 hover:border-white/20 text-white text-xs font-mono transition-all cursor-pointer active:scale-95"
              >
                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                <span className="hidden sm:inline font-bold">
                  {isArabic ? "المسؤول" : "Admin"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div
                    onClick={() => setProfileDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                    aria-hidden="true"
                  />
                  <div
                    className={`absolute ${
                      isRtl ? "left-0" : "right-0"
                    } mt-2 w-52 bg-[#09090F] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-200 font-mono text-xs`}
                  >
                    <div className="px-3 py-2 border-b border-white/[0.08]">
                      <p className="text-white font-bold truncate">{adminUser.phone}</p>
                      <p className="text-[10px] text-white/50">
                        {isArabic ? "الصلاحية:" : "Rôle:"} {adminUser.role}
                      </p>
                    </div>
                    <Link
                      href="/admin/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-white/50" />
                      <span>{t.admin.nav.profile}</span>
                    </Link>
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-white/50" />
                      <span>{t.admin.nav.settings}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#E52421] hover:bg-[#E52421]/10 transition-colors text-left cursor-pointer active:scale-95"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.admin.nav.logout}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
