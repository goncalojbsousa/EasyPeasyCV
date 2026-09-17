"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	FontFamilyOption,
	LayoutDensity,
	TextAlignment,
} from "../../types/cv";
import { SelectMenu, type SelectOption } from "../ui/select_menu";
import { Field, Group, Segmented, Slider, Toggle } from "./controls";
import type { DesignController } from "./use_design_settings";

/** Page-level typography and spacing — the options that affect the whole document. */
export function PageTab({ design }: { design: DesignController }) {
	const { t } = useLanguage();
	const { layout } = design.settings;

	const fontOptions: SelectOption<FontFamilyOption>[] = useMemo(
		() => [
			{ value: "Helvetica", label: "Helvetica" },
			{ value: "Times-Roman", label: "Times New Roman" },
			{ value: "Arial", label: "Arial" },
		],
		[],
	);

	const densityChoices: { value: LayoutDensity; label: string }[] = useMemo(
		() => [
			{ value: "compact", label: t("layout.controls.density.compact") },
			{ value: "normal", label: t("layout.controls.density.normal") },
			{ value: "spacious", label: t("layout.controls.density.spacious") },
		],
		[t],
	);

	const alignChoices: { value: TextAlignment; label: string }[] = useMemo(
		() => [
			{ value: "left", label: t("layout.controls.textAlignment.left") },
			{ value: "justify", label: t("layout.controls.textAlignment.justify") },
		],
		[t],
	);

	return (
		<div className="space-y-4">
			<Group title={t("design.page.spacing")}>
				<Segmented
					label={t("layout.controls.density.label")}
					hint={t("layout.controls.density.help")}
					choices={densityChoices}
					value={layout.density || "normal"}
					onChange={(density) => design.patchLayout({ density })}
				/>
				<Toggle
					label={t("layout.controls.singlePageMode.label")}
					hint={t("layout.controls.singlePageMode.help")}
					checked={!!layout.singlePageMode}
					onChange={(singlePageMode) => design.patchLayout({ singlePageMode })}
				/>
				<Slider
					label={t("layout.controls.sectionSpacing.label")}
					value={layout.sectionSpacingPx}
					min={4}
					max={32}
					suffix="px"
					onChange={(sectionSpacingPx) =>
						design.patchLayout({ sectionSpacingPx })
					}
				/>
				<Slider
					label={t("layout.controls.lineSpacing.label")}
					value={layout.lineSpacing}
					min={1}
					max={2}
					step={0.1}
					onChange={(lineSpacing) => design.patchLayout({ lineSpacing })}
				/>
			</Group>

			<Group title={t("design.page.typography")}>
				<Field label={t("layout.controls.font.label")}>
					<SelectMenu
						className="w-full"
						options={fontOptions}
						value={layout.fontFamily}
						placeholder={t("layout.controls.font.label")}
						onSelect={(fontFamily) => design.patchLayout({ fontFamily })}
					/>
				</Field>
				<Slider
					label={t("layout.controls.textScale.label")}
					value={Math.round(layout.textScale * 100)}
					min={80}
					max={130}
					step={5}
					suffix="%"
					onChange={(pct) => design.patchLayout({ textScale: pct / 100 })}
				/>
				<Segmented
					label={t("layout.controls.textAlignment.label")}
					choices={alignChoices}
					value={layout.textAlignment || "justify"}
					onChange={(textAlignment) => design.patchLayout({ textAlignment })}
				/>
			</Group>

			<Group title={`${t("layout.controls.margins.title")} (cm)`}>
				<div className="grid grid-cols-2 gap-x-3 gap-y-2">
					<Slider
						label={t("layout.controls.margins.top")}
						value={layout.marginsCm.top}
						min={0.5}
						max={3}
						step={0.1}
						onChange={(top) =>
							design.patchLayout({
								marginsCm: { ...layout.marginsCm, top },
							})
						}
					/>
					<Slider
						label={t("layout.controls.margins.bottom")}
						value={layout.marginsCm.bottom}
						min={0.5}
						max={3}
						step={0.1}
						onChange={(bottom) =>
							design.patchLayout({
								marginsCm: { ...layout.marginsCm, bottom },
							})
						}
					/>
					<Slider
						label={t("layout.controls.margins.left")}
						value={layout.marginsCm.left}
						min={0.5}
						max={3}
						step={0.1}
						onChange={(left) =>
							design.patchLayout({
								marginsCm: { ...layout.marginsCm, left },
							})
						}
					/>
					<Slider
						label={t("layout.controls.margins.right")}
						value={layout.marginsCm.right}
						min={0.5}
						max={3}
						step={0.1}
						onChange={(right) =>
							design.patchLayout({
								marginsCm: { ...layout.marginsCm, right },
							})
						}
					/>
				</div>
			</Group>
		</div>
	);
}
