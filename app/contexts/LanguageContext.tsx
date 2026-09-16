"use client";

import { useLocale } from "next-intl";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { usePathname, useRouter } from "../../navigation";
import { getTranslations } from "../translations";
import type { CVType } from "../types/cv";
import { DEFAULT_CV_TYPE, isCvType } from "../utils/cv-types";

const LEGACY_CV_TYPE_KEY = "cv-builder-type";

// Types for available languages
export type Language = "pt" | "en" | "es" | "br";

export type { CVType };

// Context interface for language and CV type management
interface LanguageContextType {
	language: Language;

	setLanguage: (lang: Language) => void;
	/** Professional area whose examples the form shows */
	cvType: CVType;
	/**
	 * Show the examples of `type`. The choice is stored per profile by the
	 * builder; `undefined` (a profile that never picked one) falls back to the
	 * area chosen back when it was a browser-wide preference.
	 */
	setCVType: (type: CVType | undefined) => void;
	t: (key: string) => string;
}

// Create the LanguageContext with the defined interface
const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

// Props for the LanguageProvider component
interface LanguageProviderProps {
	children: ReactNode;
}

/**
 * LanguageProvider component
 * Provides language, CV type, and translation context to the application.
 * Loads preferences from localStorage and detects browser language if not set.
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
	const currentLocale = useLocale() as Language;
	const router = useRouter();
	const pathname = usePathname();

	const [selectedCvType, setSelectedCvType] = useState<CVType | undefined>();
	const [legacyCvType, setLegacyCvType] = useState<CVType>(DEFAULT_CV_TYPE);
	const cvType = selectedCvType ?? legacyCvType;

	// The area used to be one browser-wide preference; it is only read now, as
	// the fallback for profiles saved before the choice moved into each profile.
	useEffect(() => {
		try {
			const saved = localStorage.getItem(LEGACY_CV_TYPE_KEY);
			if (isCvType(saved)) setLegacyCvType(saved);
		} catch {
			// Storage unavailable: keep the default area
		}
	}, []);

	// Change language by redirecting to the new locale route
	const setLanguage = (lang: Language) => {
		localStorage.setItem("cv-builder-language", lang);
		router.replace(pathname, { locale: lang });
	};

	const setCVType = useCallback(
		(type: CVType | undefined) => setSelectedCvType(type),
		[],
	);

	/**
	 * Translation function
	 * Returns the translation for a given key based on the current language.
	 * If the key is CV type-specific, returns the appropriate translation.
	 */
	const t = (key: string): string => {
		const translations = getTranslations(currentLocale);

		const baseTranslation = translations[key] || key;

		// If the key contains CV type, return the specific translation
		if (key.includes("cvType.")) {
			const cvTypeKey = key.replace("cvType.", `${cvType}.`);
			const cvTypeTranslation = translations[cvTypeKey];
			if (cvTypeTranslation) {
				return cvTypeTranslation;
			}
		}

		return baseTranslation;
	};

	return (
		<LanguageContext.Provider
			value={{ language: currentLocale, setLanguage, cvType, setCVType, t }}
		>
			{children}
		</LanguageContext.Provider>
	);
}

/**
 * Custom hook to use the LanguageContext.
 * Throws an error if used outside of LanguageProvider.
 */
export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}
