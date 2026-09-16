"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type {
	CvColor,
	CvRenderSettings,
	CvTemplate,
	StyledSectionKey,
} from "../../types/cv";
import { BottomSheet } from "../ui/bottom_sheet";
import {
	EntryVariantPicker,
	LanguagesVariantPicker,
	SECTION_LABEL_KEYS,
	SkillsVariantPicker,
} from "./section_style_options";
import { useDesignSettings } from "./use_design_settings";

/**
 * A section whose style can be tweaked from its own header. Skills and
 * languages are not entry lists, so they have their own pickers.
 */
export type StyleTarget = StyledSectionKey | "technical_skills" | "languages";

const TARGET_LABEL_KEYS: Record<StyleTarget, string> = {
	...SECTION_LABEL_KEYS,
	technical_skills: "section.technical.skills",
	languages: "section.languages",
};

interface SectionStyleSheetProps {
	/** The section to customise, or null when the sheet is closed */
	target: StyleTarget | null;
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

	return (
		<BottomSheet
			show={target !== null}
			title={target ? t(TARGET_LABEL_KEYS[target]) : ""}
			onClose={onClose}
			maxWidthClassName="max-w-sm"
		>
			{target && (
				<div className="px-4 py-3 space-y-2">
					{target === "technical_skills" && (
						<SkillsVariantPicker design={design} />
					)}
					{target === "languages" && <LanguagesVariantPicker design={design} />}
					{target !== "technical_skills" && target !== "languages" && (
						<EntryVariantPicker
							sectionKey={target}
							design={design}
							label={t("design.sections.entryStyle")}
						/>
					)}
					<p className="text-[10px] text-gray-500 dark:text-gray-400">
						{t("design.section.sheet.help")}
					</p>
				</div>
			)}
		</BottomSheet>
	);
}
