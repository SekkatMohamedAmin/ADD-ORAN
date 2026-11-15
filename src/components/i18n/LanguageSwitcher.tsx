"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";
import { Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  const options: { code: Locale; label: string; title: string }[] = [
    { code: "fr", label: "FR", title: "Français" },
    { code: "ar", label: "عربي", title: "العربية" },
    { code: "en", label: "EN", title: "English" },
  ];

  return (
    <div
      className={`inline-flex items-center gap-0.5 bg-white/5 p-0.5 rounded-full border border-white/10 ${className}`}
      role="group"
      aria-label="Sélection de la langue"
    >
      <Globe className="w-3 h-3 text-[#FFD21F] ms-1.5 me-0.5 shrink-0 opacity-80" />
      {options.map((opt) => {
        const isActive = locale === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLocale(opt.code)}
            title={opt.title}
            aria-label={opt.title}
            className={`h-6 px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-mono font-bold rounded-full transition-all duration-150 cursor-pointer select-none active:scale-95 inline-flex items-center justify-center leading-none ${
              isActive
                ? "bg-[#E52421] text-white shadow-xs"
                : "text-[#9E9EA8] hover:text-white hover:bg-white/5"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
