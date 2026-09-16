import type {
	CvRenderSettings,
	CvStyleSettings,
	CvTemplate,
	EntryVariant,
	StyledSectionKey,
} from "../types/cv";
import { STYLED_SECTION_KEYS } from "../types/cv";

/** Shorthand for "every list section uses the same entry presentation". */
function allEntries(
	variant: EntryVariant,
): Record<StyledSectionKey, EntryVariant> {
	return Object.fromEntries(
		STYLED_SECTION_KEYS.map((key) => [key, variant]),
	) as Record<StyledSectionKey, EntryVariant>;
}

/**
 * Starting points for the modular style system.
 *
 * These are exactly the three themes the app used to ship as closed
 * "templates": picking one now just writes a set of modular options, which the
 * user is then free to change one by one.
 */
export const STYLE_PRESETS: Record<CvTemplate, CvStyleSettings> = {
	professional: {
		sectionTitle: { variant: "plain", align: "center", transform: "uppercase" },
		header: { align: "center", contact: "inline", divider: true },
		datePlacement: "right",
		bullets: "dot",
		entries: allEntries("plain"),
		languages: "inline",
		skills: "centered",
	},
	classic: {
		sectionTitle: { variant: "ruled", align: "left", transform: "uppercase" },
		header: { align: "left", contact: "inline", divider: false },
		datePlacement: "right",
		bullets: "dot",
		entries: allEntries("card"),
		languages: "rows",
		skills: "paragraph",
	},
	timeline: {
		sectionTitle: { variant: "inlineRule", align: "left", transform: "none" },
		header: { align: "left", contact: "separated", divider: false },
		datePlacement: "right",
		bullets: "dot",
		entries: {
			...allEntries("timeline"),
			// Certifications and projects have no date column to hang off a rail.
			certifications: "plain",
			projects: "plain",
		},
		languages: "leaders",
		skills: "paragraph",
	},
};

/** Order the presets are offered in. */
export const PRESET_KEYS: CvTemplate[] = [
	"professional",
	"classic",
	"timeline",
];

export const DEFAULT_CV_STYLE: CvStyleSettings = STYLE_PRESETS.professional;

/** Deep copy, so callers can mutate a preset without touching the original. */
export function cloneStyle(style: CvStyleSettings): CvStyleSettings {
	return {
		sectionTitle: { ...style.sectionTitle },
		header: { ...style.header },
		datePlacement: style.datePlacement,
		bullets: style.bullets,
		entries: { ...style.entries },
		languages: style.languages,
		skills: style.skills,
		...(style.customSectionEntries
			? { customSectionEntries: { ...style.customSectionEntries } }
			: {}),
	};
}

/**
 * The entry presentation of one custom section: its own choice when it has
 * one, otherwise the default for custom sections.
 */
export function getCustomSectionVariant(
	style: CvStyleSettings,
	sectionId: string,
): EntryVariant {
	return style.customSectionEntries?.[sectionId] ?? style.entries.custom;
}

/** Whether two per-section override maps hold the same choices. */
function overridesEqual(
	a: Record<string, EntryVariant> = {},
	b: Record<string, EntryVariant> = {},
): boolean {
	const aKeys = Object.keys(a);
	return (
		aKeys.length === Object.keys(b).length &&
		aKeys.every((key) => a[key] === b[key])
	);
}

/**
 * The style to render with.
 *
 * CVs saved before the modular system have no `settings.style`, only the
 * legacy `template` name — those are migrated to the matching preset so they
 * keep looking exactly the same.
 */
export function resolveStyle(
	settings?: CvRenderSettings,
	legacyTemplate?: CvTemplate,
): CvStyleSettings {
	if (settings?.style) return settings.style;
	return cloneStyle(
		STYLE_PRESETS[legacyTemplate ?? "professional"] ?? DEFAULT_CV_STYLE,
	);
}

/** Structural comparison, so key order never affects the result. */
function stylesEqual(a: CvStyleSettings, b: CvStyleSettings): boolean {
	return (
		a.sectionTitle.variant === b.sectionTitle.variant &&
		a.sectionTitle.align === b.sectionTitle.align &&
		a.sectionTitle.transform === b.sectionTitle.transform &&
		a.header.align === b.header.align &&
		a.header.contact === b.header.contact &&
		a.header.divider === b.header.divider &&
		a.datePlacement === b.datePlacement &&
		a.bullets === b.bullets &&
		a.languages === b.languages &&
		a.skills === b.skills &&
		STYLED_SECTION_KEYS.every((key) => a.entries[key] === b.entries[key]) &&
		overridesEqual(a.customSectionEntries, b.customSectionEntries)
	);
}

/** The preset a style matches exactly, or null when the user has customised it. */
export function matchPreset(style: CvStyleSettings): CvTemplate | null {
	return (
		PRESET_KEYS.find((key) => stylesEqual(STYLE_PRESETS[key], style)) ?? null
	);
}
