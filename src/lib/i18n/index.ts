import { ar } from "./ar";
import { en } from "./en";
import { fr } from "./fr";
import { Locale, TranslationDictionary } from "./types";

export * from "./types";

export const dictionaries: Record<Locale, TranslationDictionary> = {
  fr,
  ar,
  en,
};

export const DEFAULT_LOCALE: Locale = "fr";

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}
