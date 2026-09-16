"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type {
	CustomSectionKey,
	CvColor,
	CvRenderSettings,
	CvTemplate,
	StyledSectionKey,
} from "../../types/cv";
import { BottomSheet } from "../ui/bottom_sheet";
import {
	CustomSectionVariantPicker,
	EntryVariantPicker,
	LanguagesVariantPicker,
	SECTION_LABEL_KEYS,
	SkillsVariantPicker,
} from "./section_style_options";
import { useDesignSettings } from "./use_design_settings";

/**
 * A section whose style can be tweaked from its own header. Skills and
 * languages are not entry lists, so they have their own pickers; a custom
 * section is addressed by its own key so it can be styled individually.
 */
export type StyleTarget =
	| Exclude<StyledSectionKey, "custom">
	| "technical_skills"
	| "languages"
	| CustomSectionKey;

const TARGET_LABEL_KEYS: Record<string, string> = {
	...SECTION_LABEL_KEYS,
	technical_skills: "section.technical.skills",
	languages: "section.languages",
};

interface SectionStyleSheetProps {
	/** The section to customise, or null when the sheet is closed */
	target: StyleTarget | null;
	/** Display title of a custom section target, as the user typed it */
	customSectionTitle?: string;
	settings?: CvRenderSettings;
	onSettingsChange: (settings: CvRenderSettings) => void;
	color: CvColor;
	onColorChange: (color: CvColor) => void;
	legacyTemplate?: CvTemplate;
	onClose: () => void;
}

/**
 * The style options for a single section, opened from that section's own
 * header in the builder form.
 *
 * Putting the choice next to the content it affects is the shortest path to
 * discovering it; the full design panel still offers the same pickers for
 * users who prefer to do all their styling in one place.
 */
export function SectionStyleSheet({
	target,
	customSectionTitle,
	settings,
	onSettingsChange,
	color,
	onColorChange,
	legacyTemplate,
	onClose,
}: SectionStyleSheetProps) {
	const { t } = useLanguage();
	const design = useDesignSettings(
		settings,
		onSettingsChange,
		color,
		onColorChange,
		legacyTemplate,
	);

	const customSectionId = target?.startsWith("custom_")
		? target.slice("custom_".length)
		: null;
	const title = customSectionId
		? customSectionTitle || t("custom.section.default")
		: target
			? t(TARGET_LABEL_KEYS[target])
			: "";

	const renderPicker = () => {
		if (!target) return null;
		if (customSectionId) {
			return (
				<CustomSectionVariantPicker
					sectionId={customSectionId}
					title={t("design.sections.entryStyle")}
					design={design}
				/>
			);
		}
		if (target === "technical_skills") {
			return <SkillsVariantPicker design={design} />;
		}
		if (target === "languages") {
			return <LanguagesVariantPicker design={design} />;
		}
		return (
			<EntryVariantPicker
				sectionKey={target as StyledSectionKey}
				design={design}
				label={t("design.sections.entryStyle")}
			/>
		);
	};

	return (
		<BottomSheet
			show={target !== null}
			title={title}
			onClose={onClose}
			maxWidthClassName="max-w-sm"
		>
			{target && (
				<div className="px-4 py-3 space-y-2">
					{renderPicker()}
					<p className="text-[10px] text-gray-500 dark:text-gray-400">
						{t("design.section.sheet.help")}
					</p>
				</div>
			)}
		</BottomSheet>
	);
}
