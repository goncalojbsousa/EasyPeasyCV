"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	EntryVariant,
	LanguagesVariant,
	SkillsVariant,
	StyledSectionKey,
} from "../../types/cv";
import { getCustomSectionVariant } from "../../utils/style-presets";
import { OptionGrid } from "./controls";
import type { DesignController } from "./use_design_settings";

/** Translation key for each styleable section's display name. */
export const SECTION_LABEL_KEYS: Record<StyledSectionKey, string> = {
	professional_experience: "section.professional.experience",
	academic_education: "section.academic.education",
	certifications: "section.certifications",
	projects: "section.projects",
	volunteer: "section.volunteer",
	custom: "design.sections.customDefault",
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

/**
 * The entry-presentation picker for one custom section.
 *
 * A custom section follows the custom-section default until the user picks a
 * variant for it; from then on it keeps its own choice, and can be pointed back
 * at the default so it tracks future changes to it again.
 */
export function CustomSectionVariantPicker({
	sectionId,
	title,
	design,
}: {
	sectionId: string;
	title: string;
	design: DesignController;
}) {
	const { t } = useLanguage();
	const choices = useEntryChoices();
	const ownVariant = design.style.customSectionEntries?.[sectionId];

	return (
		<div className="space-y-1">
			<OptionGrid
				label={title}
				group="entries"
				choices={choices}
				value={getCustomSectionVariant(design.style, sectionId)}
				onChange={(variant) =>
					design.setCustomSectionVariant(sectionId, variant)
				}
			/>
			<p className="flex flex-wrap items-center gap-x-2 text-[10px] text-gray-500 dark:text-gray-400">
				{ownVariant ? (
					<>
						<span>{t("design.custom.own")}</span>
						<button
							type="button"
							onClick={() => design.clearCustomSectionVariant(sectionId)}
							className="font-medium text-sky-700 dark:text-sky-300 hover:underline"
						>
							{t("design.custom.useDefault")}
						</button>
					</>
				) : (
					<span>{t("design.custom.followsDefault")}</span>
				)}
			</p>
		</div>
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
