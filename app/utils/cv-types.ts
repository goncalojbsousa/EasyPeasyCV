import type { CVType } from "../types/cv";

/**
 * Single source of truth for the available CV types.
 * Drives every CV-type menu as well as the persistence validation in
 * LanguageContext, so a new type only has to be added here.
 */
export const CV_TYPES: CVType[] = [
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
];

export const DEFAULT_CV_TYPE: CVType = "development";

export function isCvType(value: unknown): value is CVType {
	return typeof value === "string" && (CV_TYPES as string[]).includes(value);
}
