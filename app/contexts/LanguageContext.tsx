"use client";

import { useLocale } from "next-intl";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { usePathname, useRouter } from "../../navigation";
import brTranslations from "../translations/br";
import enTranslations from "../translations/en";
import esTranslations from "../translations/es";
import ptTranslations from "../translations/pt";

// Types for available languages
export type Language = "pt" | "en" | "es" | "br";

// Available CV types
export type CVType =
	| "development"
	| "marketing"
	| "sales"
	| "hr"
	| "finance"
	| "design"
	| "health"
	| "education"
	| "admin"
	| "other";

// Context interface for language and CV type management
interface LanguageContextType {
	language: Language;

	setLanguage: (lang: Language) => void;
	cvType: CVType;
	setCVType: (type: CVType) => void;
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

	const [cvType, setCVTypeState] = useState<CVType>("development");

	// Effect: Load CV type from localStorage on initialization.
	useEffect(() => {
		try {
			// Only run in browser
			if (typeof window !== "undefined") {
				const savedCVType = localStorage.getItem("cv-builder-type") as CVType;
				if (
					savedCVType &&
					[
						"development",
						"marketing",
						"sales",
						"hr",
						"finance",
						"design",
						"health",
						"education",
						"admin",
						"other",
					].includes(savedCVType)
				) {
					setCVTypeState(savedCVType);
				}
			}
		} catch (error) {
			console.error("Error initializing settings:", error);
		}
	}, []);

	// Change language by redirecting to the new locale route
	const setLanguage = (lang: Language) => {
		localStorage.setItem("cv-builder-language", lang);
		router.replace(pathname, { locale: lang });
	};

	// Change CV type and persist to localStorage
	const setCVType = (type: CVType) => {
		setCVTypeState(type);
		localStorage.setItem("cv-builder-type", type);
	};

	/**
	 * Translation function
	 * Returns the translation for a given key based on the current language.
	 * If the key is CV type-specific, returns the appropriate translation.
	 */
	const t = (key: string): string => {
		let translations: Record<string, string>;
		if (currentLocale === "pt") {
			translations = ptTranslations;
		} else if (currentLocale === "br") {
			translations = brTranslations;
		} else if (currentLocale === "es") {
			translations = esTranslations;
		} else {
			translations = enTranslations;
		}

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
