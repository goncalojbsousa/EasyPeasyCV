"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	EntryVariant,
	LanguagesVariant,
	SkillsVariant,
	StyledSectionKey,
} from "../../types/cv";
import { OptionGrid } from "./controls";
import type { DesignController } from "./use_design_settings";

/** Translation key for each styleable section's display name. */
export const SECTION_LABEL_KEYS: Record<StyledSectionKey, string> = {
	professional_experience: "section.professional.experience",
	academic_education: "section.academic.education",
	certifications: "section.certifications",
	projects: "section.projects",
	volunteer: "section.volunteer",
	custom: "design.sections.custom",
};

/**
 * Which form section maps onto which style key, so the per-section shortcut in
 * the builder form knows what to offer. Summary has no variants of its own.
 */
export const FORM_SECTION_STYLE_KEYS: Record<string, StyledSectionKey> = {
	professional_experience: "professional_experience",
	academic_education: "academic_education",
	certifications: "certifications",
	projects: "projects",
	volunteer: "volunteer",
};

function useEntryChoices() {
	const { t } = useLanguage();
	return useMemo<{ value: EntryVariant; label: string }[]>(
		() => [
			{ value: "plain", label: t("design.entries.plain") },
			{ value: "card", label: t("design.entries.card") },
			{ value: "timeline", label: t("design.entries.timeline") },
		],
		[t],
	);
}

/**
 * The entry-presentation picker for one section.
 *
 * Rendered both in the design panel's Sections tab and, as a shortcut, from
 * the section's own header in the builder form — the same control either way,
 * so the two can never drift apart.
 */
export function EntryVariantPicker({
	sectionKey,
	design,
	label,
}: {
	sectionKey: StyledSectionKey;
	design: DesignController;
	label?: string;
}) {
	const { t } = useLanguage();
	const choices = useEntryChoices();

	return (
		<OptionGrid
			label={label ?? t(SECTION_LABEL_KEYS[sectionKey])}
			group="entries"
			choices={choices}
			value={design.style.entries[sectionKey]}
			onChange={(variant) => design.setEntryVariant(sectionKey, variant)}
		/>
	);
}

/** The presentation picker for the languages section. */
export function LanguagesVariantPicker({
	design,
}: {
	design: DesignController;
}) {
	const { t } = useLanguage();
	const choices = useMemo<{ value: LanguagesVariant; label: string }[]>(
		() => [
			{ value: "inline", label: t("design.languages.inline") },
			{ value: "rows", label: t("design.languages.rows") },
			{ value: "leaders", label: t("design.languages.leaders") },
		],
		[t],
	);

	return (
		<OptionGrid
			label={t("section.languages")}
			group="languages"
			choices={choices}
			value={design.style.languages}
			onChange={(languages) => design.patchStyle({ languages })}
		/>
	);
}

/** The presentation picker for the skills section. */
export function SkillsVariantPicker({ design }: { design: DesignController }) {
	const { t } = useLanguage();
	const choices = useMemo<{ value: SkillsVariant; label: string }[]>(
		() => [
			{ value: "paragraph", label: t("design.skills.paragraph") },
			{ value: "centered", label: t("design.skills.centered") },
			{ value: "bulleted", label: t("design.skills.bulleted") },
		],
		[t],
	);

	return (
		<OptionGrid
			label={t("section.technical.skills")}
			group="skills"
			choices={choices}
			value={design.style.skills}
			onChange={(skills) => design.patchStyle({ skills })}
		/>
	);
}
