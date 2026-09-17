import brTranslations from "./br";
import enTranslations from "./en";
import esTranslations from "./es";
import ptTranslations from "./pt";

/** Locales the application ships translations for. */
export type Locale = "pt" | "en" | "es" | "br";

/** Single source of truth mapping a locale to its translation dictionary. */
export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
	pt: ptTranslations,
	en: enTranslations,
	es: esTranslations,
	br: brTranslations,
};

export const DEFAULT_LOCALE: Locale = "pt";

/** Narrow an unknown value to a supported locale. */
export function isLocale(value: unknown): value is Locale {
	return typeof value === "string" && value in TRANSLATIONS;
}

/** Resolve a possibly-unknown locale string to a translation dictionary. */
export function getTranslations(locale?: string): Record<string, string> {
	return TRANSLATIONS[locale as Locale] ?? TRANSLATIONS[DEFAULT_LOCALE];
}
