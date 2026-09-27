"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, getDictionary, isRTL, Locale, TranslationDictionary } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
  dir: "ltr" | "rtl";
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Check saved preference in localStorage or cookie
    // Safari private browsing throws on localStorage access
    try {
      const saved = localStorage.getItem("add_locale") as Locale;
      if (saved && (saved === "fr" || saved === "ar" || saved === "en")) {
        setLocaleState(saved);
        document.documentElement.dir = isRTL(saved) ? "rtl" : "ltr";
        document.documentElement.lang = saved;
        return;
      }
    } catch {
      // localStorage unavailable (Safari private browsing) — fall through
    }
    document.documentElement.dir = isRTL(initialLocale) ? "rtl" : "ltr";
    document.documentElement.lang = initialLocale;
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("add_locale", newLocale);
    } catch {
      // Safari private browsing — silently ignore
    }
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  };

  const t = getDictionary(locale);
  const dir = isRTL(locale) ? "rtl" : "ltr";
  const isRtl = isRTL(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
