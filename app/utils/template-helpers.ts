import brTranslations from "../translations/br";
import enTranslations from "../translations/en";
import esTranslations from "../translations/es";
import ptTranslations from "../translations/pt";
import { translateMonthForLang } from "./months";

// Translation maps for all supported languages
const translationMaps: Record<
	"pt" | "en" | "es" | "br",
	Record<string, string>
> = {
	pt: ptTranslations,
	en: enTranslations,
	es: esTranslations,
	br: brTranslations,
};

/**
 * Convert centimeters to points (used for PDF measurements)
 */
export function cmToPt(cm: number): number {
	return cm * 28.3465;
}

/**
 * Translate a label key to the target language
 */
export function translateLabel(key?: string, lang?: string): string {
	if (!key) return "";
	const target = (lang || "pt") as "pt" | "en" | "es" | "br";
	const map = translationMaps[target] || translationMaps.pt;
	return map[key] || "";
}

/**
 * Translate a month abbreviation to the target language
 */
export function translateMonth(month: string, lang: string): string {
	const target = (lang === "br" ? "pt" : lang || "pt") as "pt" | "en" | "es";
	return translateMonthForLang(month, target);
}

/**
 * Get the full month name in the target language
 */
export function getFullMonthName(month?: string, lang?: string): string {
	if (!month) return "";
	const target = (lang === "br" ? "pt" : lang || "pt") as "pt" | "en" | "es";

	const monthMap: Record<string, Record<"pt" | "en" | "es", string>> = {
		Jan: { pt: "Janeiro", en: "January", es: "Enero" },
		Feb: { pt: "Fevereiro", en: "February", es: "Febrero" },
		Mar: { pt: "Março", en: "March", es: "Marzo" },
		Apr: { pt: "Abril", en: "April", es: "Abril" },
		May: { pt: "Maio", en: "May", es: "Mayo" },
		Jun: { pt: "Junho", en: "June", es: "Junio" },
		Jul: { pt: "Julho", en: "July", es: "Julio" },
		Aug: { pt: "Agosto", en: "August", es: "Agosto" },
		Sep: { pt: "Setembro", en: "September", es: "Septiembre" },
		Oct: { pt: "Outubro", en: "October", es: "Octubre" },
		Nov: { pt: "Novembro", en: "November", es: "Noviembre" },
		Dec: { pt: "Dezembro", en: "December", es: "Diciembre" },
		Fev: { pt: "Fevereiro", en: "February", es: "Febrero" },
		Abr: { pt: "Abril", en: "April", es: "Abril" },
		Mai: { pt: "Maio", en: "May", es: "Mayo" },
		Ago: { pt: "Agosto", en: "August", es: "Agosto" },
		Set: { pt: "Setembro", en: "September", es: "Septiembre" },
		Out: { pt: "Outubro", en: "October", es: "Octubre" },
		Dez: { pt: "Dezembro", en: "December", es: "Diciembre" },
		Ene: { pt: "Janeiro", en: "January", es: "Enero" },
	};

	return monthMap[month]?.[target] || month;
}

/**
 * Translate the word "Current" (for current job/education positions)
 */
export function translateCurrent(lang: string): string {
	const target = (lang === "br" ? "pt" : lang || "pt") as "pt" | "en" | "es";
	if (target === "en") return "Current";
	if (target === "es") return "Actual";
	return "Atual";
}

/**
 * Translate a language proficiency level
 */
export function translateLanguageLevel(level?: string, lang?: string): string {
	if (!level) return "";
	const translated = translateLabel(level, lang);
	if (translated) return translated;
	return level;
}

/**
 * Format a month and year according to the specified date format
 */
export function formatMonthYear(
	month?: string,
	year?: string,
	lang?: string,
	dateFormat?: "short" | "medium" | "long",
): string {
	if (!month || !year) return "";
	const target = (lang === "br" ? "pt" : lang || "pt") as "pt" | "en" | "es";
	const abbr = translateMonthForLang(month, target) || "";

	if (dateFormat === "short") {
		const enMonth = translateMonthForLang(month, "en") || month;
		const monthNum =
			[
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			].indexOf(enMonth) + 1;
		return `${monthNum.toString().padStart(2, "0")}/${year}`;
	}
	if (dateFormat === "long") {
		const fullName = getFullMonthName(month, lang);
		return `${fullName} ${year}`;
	}
	const normalized = abbr.charAt(0).toUpperCase() + abbr.slice(1).toLowerCase();
	return `${normalized} ${year}`;
}

/**
 * Format a date range (start - end) with optional "Current" end date
 */
export function formatDateRange(
	startMonth?: string,
	startYear?: string,
	endMonth?: string,
	endYear?: string,
	current?: boolean,
	lang?: string,
	dateFormat?: "short" | "medium" | "long",
): string {
	const start = (() => {
		if (startMonth && startYear)
			return formatMonthYear(startMonth, startYear, lang, dateFormat);
		if (startYear || startMonth) {
			const month = startMonth ? translateMonth(startMonth, lang || "pt") : "";
			const divider = startMonth && startYear ? "/" : "";
			return `${month}${divider}${startYear || ""}`.trim();
		}
		return "";
	})();

	const end = (() => {
		if (current) return translateCurrent(lang || "pt");
		if (endMonth && endYear)
			return formatMonthYear(endMonth, endYear, lang, dateFormat);
		if (endYear || endMonth) {
			const month = endMonth ? translateMonth(endMonth, lang || "pt") : "";
			const divider = endMonth && endYear ? "/" : "";
			return `${month}${divider}${endYear || ""}`.trim();
		}
		return "";
	})();

	if (start && end) return `${start} - ${end}`;
	if (start) return start;
	if (end) return end;
	return "";
}

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name?: string): string {
	if (!name) return "YOU";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Split text into lines (handles different line break formats)
 */
export function splitLines(value?: string): string[] {
	if (!value) return [];
	return value.split(/\r\n|\r|\n/).filter(Boolean);
}

/**
 * Build a social/contact URL from a type and value
 */
export function getSocialUrl(type: string, value: string): string {
	if (!value) return "";
	const val = value.trim();
	const hasProtocol = /^https?:\/\//i.test(val);
	const lower = type.toLowerCase();
	if (lower === "email") return `mailto:${val}`;
	if (lower === "phone") return `tel:${val}`;
	if (!hasProtocol) {
		if (/linkedin\.com/i.test(val)) return `https://${val}`;
		if (/github\.com/i.test(val)) return `https://${val}`;
		return `https://${val}`;
	}
	return val;
}
