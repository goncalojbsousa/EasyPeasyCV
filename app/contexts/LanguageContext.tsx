"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
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
	const [language, setLanguageState] = useState<Language>("pt");
	const [cvType, setCVTypeState] = useState<CVType>("development");

	// Effect: Load language and CV type from localStorage on initialization.
	// If not set, detect browser language. Handles errors gracefully.
	useEffect(() => {
		try {
			// Only run in browser
			if (typeof window !== "undefined") {
				const savedLanguage = localStorage.getItem(
					"cv-builder-language",
				) as Language;
				if (
					savedLanguage &&
					(savedLanguage === "pt" ||
						savedLanguage === "en" ||
						savedLanguage === "es" ||
						savedLanguage === "br")
				) {
					setLanguageState(savedLanguage);
				} else {
					// Detect browser language if not set
					const browserLanguage = (
						navigator.language ||
						navigator.languages?.[0] ||
						"en"
					).toLowerCase();
					let detectedLanguage: Language = "en";
					if (browserLanguage.startsWith("pt-br") || browserLanguage === "br") {
						detectedLanguage = "br";
					} else if (browserLanguage.startsWith("pt")) {
						detectedLanguage = "pt";
					} else if (browserLanguage.startsWith("es")) {
						detectedLanguage = "es";
					}
					setLanguageState(detectedLanguage);
					localStorage.setItem("cv-builder-language", detectedLanguage);
				}

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
			console.error("Error initializing language:", error);
		}
	}, []);

	// Change language and persist to localStorage
	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem("cv-builder-language", lang);
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
		if (language === "pt") {
			translations = ptTranslations;
		} else if (language === "br") {
			translations = brTranslations;
		} else if (language === "es") {
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
			value={{ language, setLanguage, cvType, setCVType, t }}
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
