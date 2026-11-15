"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";
import { Locale } from "@/lib/i18n";
import { Globe, ChevronDown, Check } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: { code: Locale; short: string; label: string }[] = [
    { code: "fr", short: "FR", label: "Français" },
    { code: "ar", short: "AR", label: "العربية" },
    { code: "en", short: "EN", label: "English" },
  ];

  const currentOption = options.find((o) => o.code === locale) || options[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger: displays only active language and opens on hover/click */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Changer de langue"
        className="h-7 px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#F5F5F2]"
      >
        <Globe className="w-3.5 h-3.5 text-[#FFD21F] shrink-0" />
        <span className="uppercase text-[11px] tracking-wider">{currentOption.short}</span>
        <ChevronDown
          className={`w-3 h-3 text-[#9E9EA8] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Language Dropdown Menu (revealed on hover over container) */}
      <div
        className={`absolute top-full pt-1.5 z-50 transition-all duration-200 ${
          isRtl ? "left-0" : "right-0"
        } ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-1"
        }`}
      >
        <div
          role="listbox"
          aria-label="Langues disponibles"
          className="w-36 py-1.5 rounded-2xl bg-[#141419]/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden"
        >
          {options.map((opt) => {
            const isActive = locale === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLocale(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-1.5 flex items-center justify-between text-xs font-mono transition-colors cursor-pointer text-left ${
                  isRtl ? "text-right" : "text-left"
                } ${
                  isActive
                    ? "bg-[#E52421]/20 text-[#E52421] font-bold"
                    : "text-[#9E9EA8] hover:text-[#F5F5F2] hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 uppercase font-bold text-[10px] text-[#FFD21F]">
                    {opt.short}
                  </span>
                  <span className="text-[11px]">{opt.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-[#E52421]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
