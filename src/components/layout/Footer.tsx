"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, Wrench, MapPin, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const FOOTER_STRINGS = {
  fr: {
    subtitle: "COLLECTIF DES SPORTS D'ACTION & DE NATURE • DEPUIS 2018",
    colDisciplines: "Disciplines",
    colClub: "Le Collectif",
    colContact: "Contacts Officiels",
    colSafety: "Charte & Sécurité",
    aboutLink: "Qui sommes-nous ?",
    archivesLink: "Archives & Galerie Saison",
    registerLink: "Formulaire d'inscription",
    memberLink: "Espace Membre Adhérent",
    contactInfo: "Renseignements & Inscriptions",
    supportInfo: "Support Technique & Bug Site",
    location: "Oran, Algérie",
    privacyLink: "Protection des Données (Loi 18-07)",
    regulationsLink: "Règlement intérieur du club",
    parentalLink: "Autorisation parentale (PDF)",
    copyright: "CLUB ART DU DÉPLACEMENT PARKOUR ORAN • TOUS DROITS RÉSERVÉS",
    motto: "ÊTRE FORT POUR ÊTRE UTILE",
  },
  en: {
    subtitle: "ACTION & OUTDOOR SPORTS COLLECTIVE • SINCE 2018",
    colDisciplines: "Disciplines",
    colClub: "The Collective",
    colContact: "Official Contacts",
    colSafety: "Charter & Safety",
    aboutLink: "Who We Are",
    archivesLink: "Season Archives & Gallery",
    registerLink: "Registration Form",
    memberLink: "Member Portal",
    contactInfo: "Inquiries & Registration",
    supportInfo: "Technical & Web Support",
    location: "Oran, Algeria",
    privacyLink: "Data Protection (Law 18-07)",
    regulationsLink: "Club Internal Regulations",
    parentalLink: "Parental Consent (PDF)",
    copyright: "ART DU DÉPLACEMENT PARKOUR ORAN CLUB • ALL RIGHTS RESERVED",
    motto: "BE STRONG TO BE USEFUL",
  },
  ar: {
    subtitle: "تجمع الرياضات الحركية والطبيعية • تأسس سنة 2018",
    colDisciplines: "التخصصات الرياضية",
    colClub: "النادي والجمعية",
    colContact: "التواصل الرسمي",
    colSafety: "الميثاق والسلامة",
    aboutLink: "من نحن؟",
    archivesLink: "أرشيف ومعرض الموسم",
    registerLink: "استمارة التسجيل الإلكتروني",
    memberLink: "فضاء المنخرطين والأعضاء",
    contactInfo: "الاستعلامات والتسجيلات العامة",
    supportInfo: "الدعم التقني ومشاكل الموقع",
    location: "وهران، الجزائر",
    privacyLink: "حماية البيانات الشخصية (قانون 18-07)",
    regulationsLink: "النظام الداخلي للنادي",
    parentalLink: "الترخيص الأبوي (PDF)",
    copyright: "نادي فن الانتقال باركور وهران • جميع الحقوق محفوظة",
    motto: "أن تكون قوياً لتكون مفيداً",
  },
};

export function Footer() {
  const { locale, isRtl } = useLanguage();
  const strings = FOOTER_STRINGS[locale] || FOOTER_STRINGS.fr;
  const isArabic = locale === "ar";

  return (
    <footer className="relative bg-[#000000] border-t border-white/10 text-[#A0A0AB] pt-16 sm:pt-20 pb-12 overflow-hidden select-none">
      {/* Ambient Red Glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#E52421]/[0.06] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* ========================================================
            1. TOP BRAND STATEMENT & SOCIAL MEDIA ICONS
           ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg border border-white/90">
              <Image
                src="/images/club/logo.svg"
                alt="ADD Oran Logo"
                fill
                sizes="56px"
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight leading-none">
                ADD <span className="text-[#E52421]">ORAN</span>
              </h3>
              <p
                className={`text-xs text-[#A0A0AB] uppercase tracking-widest mt-1 ${
                  isArabic ? "font-arabic font-bold" : "font-mono"
                }`}
              >
                {strings.subtitle}
              </p>
            </div>
          </div>

          {/* Official Social Media Links */}
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a
              href="https://web.facebook.com/Parkouroranclub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook ADD Oran"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/50 text-white hover:text-[#1877F2] transition-all duration-300 font-mono text-xs uppercase tracking-wider group"
            >
              <svg
                className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/add_club_oran"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram ADD Oran"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#E4405F]/20 border border-white/10 hover:border-[#E4405F]/50 text-white hover:text-[#E4405F] transition-all duration-300 font-mono text-xs uppercase tracking-wider group"
            >
              <svg
                className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            2. FOUR-COLUMN DETAILED FOOTER CONTENT
           ======================================================== */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs ${
            isArabic ? "font-arabic" : "font-mono"
          }`}
        >
          {/* Column A: Disciplines */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase tracking-wider block">
              {strings.colDisciplines}
            </span>
            <div className="flex flex-col gap-2">
              <Link href="/#discipline-branch-01" className="hover:text-white transition-colors">
                {locale === "ar" ? "باركور وفن الانتقال" : "Parkour & Art du Déplacement"}
              </Link>
              <Link href="/#discipline-branch-02" className="hover:text-white transition-colors">
                {locale === "ar" ? "التسلق وتسلق الكتل" : "Escalade & Bloc"}
              </Link>
              <Link href="/#discipline-branch-03" className="hover:text-white transition-colors">
                {locale === "ar" ? "سلاكلاين والهاي لاين" : "Slackline & Highline"}
              </Link>
              <Link href="/#discipline-branch-04" className="hover:text-white transition-colors">
                {locale === "ar" ? "التجوال والاستكشاف" : "Trekking & Expédition"}
              </Link>
              <Link href="/#discipline-branch-05" className="hover:text-white transition-colors">
                {locale === "ar" ? "ركض المسارات الجبلية" : "Trail Running & Course Nature"}
              </Link>
            </div>
          </div>

          {/* Column B: Navigation & Club */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase tracking-wider block">
              {strings.colClub}
            </span>
            <div className="flex flex-col gap-2">
              <Link href="/#about" className="hover:text-white transition-colors">
                {strings.aboutLink}
              </Link>
              <Link href="/#last-season" className="hover:text-white transition-colors">
                {strings.archivesLink}
              </Link>
              <Link href="/register" className="hover:text-[#E52421] transition-colors font-semibold">
                {strings.registerLink}
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                {strings.memberLink}
              </Link>
            </div>
          </div>

          {/* Column C: Official Contact Emails */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase tracking-wider block">
              {strings.colContact}
            </span>
            <div className="space-y-3">
              <div>
                <span className="text-white/50 block text-[10px] uppercase">
                  {strings.contactInfo}
                </span>
                <a
                  href="mailto:contact@addpkoran.com"
                  className="inline-flex items-center gap-1.5 text-white hover:text-[#E52421] transition-colors mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E52421]" />
                  <span>contact@addpkoran.com</span>
                </a>
              </div>

              <div>
                <span className="text-white/50 block text-[10px] uppercase">
                  {strings.supportInfo}
                </span>
                <a
                  href="mailto:webmaster@addpkoran.com"
                  className="inline-flex items-center gap-1.5 text-white hover:text-[#E52421] transition-colors mt-0.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-[#E52421]" />
                  <span>webmaster@addpkoran.com</span>
                </a>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-white/50">
                <MapPin className="w-3.5 h-3.5 text-[#E52421]" />
                <span>{strings.location}</span>
              </div>
            </div>
          </div>

          {/* Column D: Charte & Réglementation */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase tracking-wider block">
              {strings.colSafety}
            </span>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E52421]" />
                <span>{strings.privacyLink}</span>
              </Link>
              <Link href="/regulations" className="hover:text-white transition-colors">
                {strings.regulationsLink}
              </Link>
              <Link href="/parental-doc" className="hover:text-white transition-colors" target="_blank">
                {strings.parentalLink}
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. BOTTOM COPYRIGHT & MOTTO
           ======================================================== */}
        <div
          className={`pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 ${
            isArabic ? "font-arabic" : "font-mono"
          }`}
        >
          <span>
            &copy; {new Date().getFullYear()} {strings.copyright}
          </span>
          <span className="uppercase text-[#E52421] tracking-widest font-semibold">
            {strings.motto}
          </span>
        </div>
      </div>
    </footer>
  );
}
