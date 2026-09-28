"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AdminEnergyBackground } from "@/components/admin/AdminEnergyBackground";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Copy,
  History,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Shield,
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
  const { t, isRtl } = useLanguage();
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

  const navSections = [
    {
      title: t.admin.nav.principal,
      items: [
        {
          label: t.admin.nav.dashboard,
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: t.admin.nav.registrations,
          href: "/admin/registrations",
          icon: ClipboardList,
        },
        {
          label: t.admin.nav.participants,
          href: "/admin/participants",
          icon: Users,
        },
      ],
    },
    {
      title: t.admin.nav.membership,
      items: [
        {
          label: t.admin.nav.seasons,
          href: "/admin/seasons",
          icon: Calendar,
        },
        {
          label: t.admin.nav.payments,
          href: "/admin/payments",
          icon: CreditCard,
        },
        {
          label: t.admin.nav.documents,
          href: "/admin/documents",
          icon: FileText,
        },
        {
          label: t.admin.nav.duplicates,
          href: "/admin/duplicates",
          icon: Copy,
        },
      ],
    },
    {
      title: t.admin.nav.management,
      items: [
        {
          label: t.admin.nav.audit,
          href: "/admin/audit",
          icon: History,
        },
        {
          label: t.admin.nav.settings,
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
    {
      title: t.admin.nav.account,
      items: [
        {
          label: t.admin.nav.profile,
          href: "/admin/profile",
          icon: User,
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

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-[#F5F5F2] flex flex-col md:flex-row selection:bg-[#E52421] selection:text-[#F5F5F2] relative overflow-x-hidden">
      {/* ========================================================
          ATHLETIC ENERGY BACKGROUND LAYER (RED/YELLOW SHAPES & TILES)
         ======================================================== */}
      <AdminEnergyBackground />

      {/* ========================================================
          SIDEBAR: PERSISTENT ON DESKTOP, DRAWER ON MOBILE
         ======================================================== */}
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-72 bg-[#0D0D12] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 shadow-2xl"
            : isRtl
            ? "translate-x-full md:translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="relative p-5 border-b border-white/10 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
            <Image
              src="/images/hero/hero-climbing.jpg"
              alt="Brand background"
              fill
              sizes="300px"
              className="object-cover object-top filter grayscale contrast-150"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-[#0D0D12]/90 to-[#E52421]/30" />
          </div>

          <Link href="/admin" className="flex items-center gap-3 group relative z-10">
            <div className="relative w-10 h-10 rounded overflow-hidden shadow-md">
              <Image
                src="/images/club/logo.svg"
                alt="ADD Parkour Oran"
                width={40}
                height={40}
                style={{ width: "100%", height: "100%" }}
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base tracking-wider text-[#F5F5F2] uppercase group-hover:text-[#FFD21F] transition-colors leading-none">
                ADD ORAN
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[#E52421] font-bold uppercase mt-1">
                ADMINISTRATION
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5 md:hidden"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-mono font-bold tracking-widest uppercase text-[#9E9EA8]/70">
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 group ${
                        active
                          ? "bg-[#E52421]/15 text-[#E52421] border-l-2 border-[#E52421]"
                          : "text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active ? "text-[#E52421]" : "text-[#9E9EA8] group-hover:text-[#F5F5F2]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User & Logout Area */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#0A0A0D]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#FFD21F]/15 border border-[#FFD21F]/30 text-[#FFD21F] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                AD
              </div>
              <div className="flex flex-col truncate">
                <span className="font-mono text-xs font-bold text-[#F5F5F2] truncate">
                  {adminUser.phone}
                </span>
                <span className="font-mono text-[9px] text-[#9E9EA8] uppercase">
                  {adminUser.role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg text-[#9E9EA8] hover:text-[#E52421] hover:bg-[#E52421]/10 transition-colors"
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
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0D0D12]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5 md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Page Title */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#9E9EA8] hidden sm:inline">Admin</span>
              <span className="text-[#9E9EA8]/40 hidden sm:inline">/</span>
              <span className="text-[#F5F5F2] font-bold uppercase tracking-wider">
                {navSections
                  .flatMap((s) => s.items)
                  .find((item) => isLinkActive(item.href, item.exact))?.label || "Console"}
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Public Website */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9E9EA8] hover:text-[#F5F5F2] text-xs font-mono transition-colors"
            >
              <span>{t.admin.viewPublicSite}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Admin Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-[#F5F5F2] text-xs font-mono transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="hidden sm:inline font-bold">Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9E9EA8]" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#141419] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in font-mono text-xs">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-[#F5F5F2] font-bold truncate">{adminUser.phone}</p>
                    <p className="text-[10px] text-[#9E9EA8]">Role: {adminUser.role}</p>
                  </div>
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{t.admin.nav.profile}</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t.admin.nav.settings}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#E52421] hover:bg-[#E52421]/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.admin.nav.logout}</span>
                  </button>
                </div>
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
