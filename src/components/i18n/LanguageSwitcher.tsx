"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";
import { Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  const options: { code: Locale; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "ar", label: "العربية" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className={`inline-flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 ${className}`}>
      <Globe className="w-3.5 h-3.5 text-[#FFD21F] ms-2 me-1 shrink-0" />
      {options.map((opt) => {
        const isActive = locale === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLocale(opt.code)}
            className={`min-h-[32px] px-2.5 sm:px-3 py-1 text-xs font-mono font-bold rounded-full transition-all duration-200 cursor-pointer select-none active:scale-95 inline-flex items-center justify-center ${
              isActive
                ? "bg-[#E52421] text-[#F5F5F2] shadow-sm"
                : "text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

