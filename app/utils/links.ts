/**
 * Social/portfolio link types offered in the personal information form.
 * Each entry carries everything the form needs — URL prefix, label key and
 * placeholder key — so the form no longer needs a switch per concern.
 */
export interface LinkTypeConfig {
	/** Stored `Link.type` value */
	label: string;
	/** URL prefix prepended to what the user types */
	prefix: string;
	/** Translation key for the display label */
	labelKey: string;
	/** Translation key for the input placeholder */
	placeholderKey: string;
}

export const LINK_TYPES: readonly LinkTypeConfig[] = [
	{
		label: "LinkedIn",
		prefix: "linkedin.com/in/",
		labelKey: "link.type.linkedin",
		placeholderKey: "link.placeholder.linkedin",
	},
	{
		label: "GitHub",
		prefix: "github.com/",
		labelKey: "link.type.github",
		placeholderKey: "link.placeholder.github",
	},
	{
		label: "GitLab",
		prefix: "gitlab.com/",
		labelKey: "link.type.gitlab",
		placeholderKey: "link.placeholder.gitlab",
	},
	{
		label: "Portfolio",
		prefix: "",
		labelKey: "link.type.portfolio",
		placeholderKey: "link.placeholder.portfolio",
	},
	{
		label: "Other",
		prefix: "",
		labelKey: "link.type.other",
		placeholderKey: "link.placeholder.other",
	},
];

/** Config for a link type, falling back to the first entry for unknown types. */
export function getLinkType(type: string): LinkTypeConfig {
	return LINK_TYPES.find((lt) => lt.label === type) || LINK_TYPES[0];
}

/**
 * The part of a stored link value the user actually typed, i.e. the value with
 * its type prefix (and any protocol) removed.
 */
export function stripLinkPrefix(type: string, value: string): string {
	const { prefix } = getLinkType(type);
	if (!prefix) return value;
	for (const candidate of [
		`https://www.${prefix}`,
		`https://${prefix}`,
		prefix,
	]) {
		if (value.startsWith(candidate)) return value.slice(candidate.length);
	}
	return value;
}
