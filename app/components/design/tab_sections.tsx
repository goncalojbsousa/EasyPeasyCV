"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	BlockAlign,
	BulletVariant,
	CaseTransform,
	DateFormat,
	DatePlacement,
	SectionTitleVariant,
	StyledSectionKey,
} from "../../types/cv";
import { STYLED_SECTION_KEYS } from "../../types/cv";
import { SelectMenu, type SelectOption } from "../ui/select_menu";
import {
	ColorField,
	Field,
	Group,
	OptionGrid,
	Segmented,
	Slider,
} from "./controls";
import type { CustomSectionSummary } from "./design_panel";
import {
	CustomSectionVariantPicker,
	EntryVariantPicker,
	LanguagesVariantPicker,
	SkillsVariantPicker,
} from "./section_style_options";
import type { DesignController } from "./use_design_settings";

/** Predefined list sections; custom sections get their own group below. */
const ENTRY_SECTIONS: StyledSectionKey[] = STYLED_SECTION_KEYS.filter(
	(key) => key !== "custom",
);

/**
 * Section headings (global), dates and bullets (global), and the per-section
 * presentation pickers.
 *
 * The global/per-section split is made explicit by the group headings, so the
 * user can tell at a glance which choices affect the whole CV.
 */
export function SectionsTab({
	design,
	customSections = [],
}: {
	design: DesignController;
	customSections?: CustomSectionSummary[];
}) {
	const { t } = useLanguage();
	const { sections } = design.settings;
	const style = design.style;

	const titleChoices: { value: SectionTitleVariant; label: string }[] = useMemo(
		() => [
			{ value: "plain", label: t("design.title.plain") },
			{ value: "ruled", label: t("design.title.ruled") },
			{ value: "inlineRule", label: t("design.title.inlineRule") },
			{ value: "block", label: t("design.title.block") },
		],
		[t],
	);

	const alignChoices: { value: BlockAlign; label: string }[] = useMemo(
		() => [
			{ value: "left", label: t("design.align.left") },
			{ value: "center", label: t("design.align.center") },
		],
		[t],
	);

	const transformChoices: { value: CaseTransform; label: string }[] = useMemo(
		() => [
			{ value: "none", label: t("design.transform.none") },
			{ value: "uppercase", label: t("design.transform.uppercase") },
		],
		[t],
	);

	const dateFormatOptions: SelectOption<DateFormat>[] = useMemo(
		() => [
			{ value: "short", label: t("layout.controls.dateFormat.short") },
			{ value: "medium", label: t("layout.controls.dateFormat.medium") },
			{ value: "long", label: t("layout.controls.dateFormat.long") },
		],
		[t],
	);

	const placementChoices: { value: DatePlacement; label: string }[] = useMemo(
		() => [
			{ value: "right", label: t("design.dates.right") },
			{ value: "below", label: t("design.dates.below") },
		],
		[t],
	);

	const bulletChoices: { value: BulletVariant; label: string }[] = useMemo(
		() => [
			{ value: "dot", label: t("design.bullets.dot") },
			{ value: "dash", label: t("design.bullets.dash") },
			{ value: "none", label: t("design.bullets.none") },
		],
		[t],
	);

	return (
		<div className="space-y-4">
			<Group title={t("design.titles.title")} help={t("design.titles.help")}>
				<OptionGrid
					label={t("design.titles.variant")}
					group="sectionTitle"
					choices={titleChoices}
					value={style.sectionTitle.variant}
					onChange={(variant) => design.patchSectionTitle({ variant })}
				/>
				<Segmented
					label={t("design.titles.align")}
					choices={alignChoices}
					value={style.sectionTitle.align}
					onChange={(align) => design.patchSectionTitle({ align })}
				/>
				<Segmented
					label={t("design.titles.transform")}
					hint={t("design.titles.transform.help")}
					choices={transformChoices}
					value={style.sectionTitle.transform}
					onChange={(transform) => design.patchSectionTitle({ transform })}
				/>
				<div className="grid grid-cols-2 gap-3">
					<ColorField
						label={t("layout.controls.sections.titleColor")}
						value={sections.titleColor || "#000000"}
						onChange={(titleColor) => design.patchSections({ titleColor })}
					/>
					<Slider
						label={t("layout.controls.sections.titleSize")}
						value={sections.titleFontSize || 12}
						min={10}
						max={16}
						onChange={(titleFontSize) =>
							design.patchSections({ titleFontSize })
						}
					/>
				</div>
			</Group>

			<Group title={t("design.dates.title")} help={t("design.dates.help")}>
				<Field label={t("layout.controls.sections.dateFormat.label")}>
					<SelectMenu
						className="w-full"
						options={dateFormatOptions}
						value={sections.dateFormat || "medium"}
						placeholder={t("layout.controls.sections.dateFormat.label")}
						onSelect={(dateFormat) => design.patchSections({ dateFormat })}
					/>
				</Field>
				<OptionGrid
					label={t("design.dates.placement")}
					group="datePlacement"
					columns={2}
					choices={placementChoices}
					value={style.datePlacement}
					onChange={(datePlacement) => design.patchStyle({ datePlacement })}
				/>
			</Group>

			<Group title={t("design.bullets.title")} help={t("design.bullets.help")}>
				<OptionGrid
					label={t("design.bullets.marker")}
					group="bullets"
					choices={bulletChoices}
					value={style.bullets}
					onChange={(bullets) => design.patchStyle({ bullets })}
				/>
			</Group>

			<Group
				title={t("design.sections.title")}
				help={t("design.sections.help")}
			>
				<div className="space-y-3">
					{ENTRY_SECTIONS.map((sectionKey) => (
						<EntryVariantPicker
							key={sectionKey}
							sectionKey={sectionKey}
							design={design}
						/>
					))}
					<SkillsVariantPicker design={design} />
					<LanguagesVariantPicker design={design} />
				</div>
			</Group>

			<Group title={t("design.custom.title")} help={t("design.custom.help")}>
				<div className="space-y-3">
					<EntryVariantPicker sectionKey="custom" design={design} />
					{customSections.map((section) => (
						<CustomSectionVariantPicker
							key={section.id}
							sectionId={section.id}
							title={section.title || t("custom.section.default")}
							design={design}
						/>
					))}
				</div>
			</Group>
		</div>
	);
}
