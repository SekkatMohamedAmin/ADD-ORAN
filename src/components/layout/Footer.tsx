"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowUpRight, Compass, ShieldAlert } from "lucide-react";

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-[#0A0A0D] border-t border-white/10 text-[#9E9EA8] pt-20 pb-12 mt-auto relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Dominant Visual Statement & CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E52421]" />
              <span>ORAN, ALGERIA</span>
            </div>
            {/* English Campaign Slogan */}
            <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.88]">
              MOVE <br />
              <span className="text-[#E52421]">DIFFERENT.</span>
            </h2>
          </div>

          <div className="flex items-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-[#E52421] hover:bg-[#FF3030] text-[#F5F5F2] font-display font-black text-xl uppercase tracking-wider transition-all duration-300 shadow-xl group"
            >
              <span>{t.home.heroCta}</span>
              <ArrowUpRight className={`w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isRtl ? "rtl-flip" : ""}`} />
            </Link>
          </div>
        </div>

        {/* Minimal Information & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 text-xs font-mono">
          {/* Disciplines */}
          <div>
            <span className="text-[#F5F5F2] font-bold uppercase tracking-wider block mb-3">
              {t.nav.disciplines}
            </span>
            <div className="flex flex-col gap-2 text-[#9E9EA8]">
              <Link href="/#disciplines" className="hover:text-[#FFD21F] transition-colors">
                {t.disciplines.parkour.name}
              </Link>
              <Link href="/#disciplines" className="hover:text-[#FFD21F] transition-colors">
                {t.disciplines.escalade.name}
              </Link>
              <Link href="/#disciplines" className="hover:text-[#FFD21F] transition-colors">
                {t.disciplines.trail.name}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <span className="text-[#F5F5F2] font-bold uppercase tracking-wider block mb-3">
              {t.nav.contact}
            </span>
            <p className="text-[#9E9EA8] leading-relaxed">
              Club Art Du Déplacement Parkour Oran<br />
              Oran, Algérie // contact@addoran-parkour.dz
            </p>
          </div>

          {/* Legal and Regulations */}
          <div>
            <span className="text-[#F5F5F2] font-bold uppercase tracking-wider block mb-3">
              CHARTE & CADRE
            </span>
            <div className="flex flex-col gap-2 text-[#9E9EA8]">
              <Link href="/privacy" className="hover:text-[#FFD21F] transition-colors flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E52421]" />
                <span>Protection des données (Loi 18-07)</span>
              </Link>
              <Link href="/regulations" className="hover:text-[#FFD21F] transition-colors">
                Règlement intérieur du club
              </Link>
              <Link href="/parental-doc" className="hover:text-[#FFD21F] transition-colors" target="_blank">
                Autorisation parentale mineurs (PDF)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9E9EA8]/70">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#E52421]" />
            <span>© {new Date().getFullYear()} CLUB ART DU DÉPLACEMENT PARKOUR ORAN</span>
          </div>
          <div className="tracking-widest uppercase text-[#FFD21F]">
            DEFY GRAVITY • FIND YOUR LINE
          </div>
        </div>
      </div>
    </footer>
  );
}
