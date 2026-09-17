"use client";

import { Upload } from "lucide-react";
import { useId, useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	BlockAlign,
	ContactVariant,
	HeaderOptions,
	PhotoOptions,
} from "../../types/cv";
import { SelectMenu, type SelectOption } from "../ui/select_menu";
import {
	ColorField,
	Field,
	Group,
	OptionGrid,
	Segmented,
	Slider,
	Toggle,
} from "./controls";
import type { DesignController } from "./use_design_settings";

/**
 * The Personal Information block: its layout variants, the name styling and
 * the photo.
 */
export function HeaderTab({ design }: { design: DesignController }) {
	const { t } = useLanguage();
	const photoInputId = useId();
	const { header, photo } = design.settings;
	const style = design.style;

	const alignChoices: { value: BlockAlign; label: string }[] = useMemo(
		() => [
			{ value: "left", label: t("design.align.left") },
			{ value: "center", label: t("design.align.center") },
		],
		[t],
	);

	const contactChoices: { value: ContactVariant; label: string }[] = useMemo(
		() => [
			{ value: "inline", label: t("design.contact.inline") },
			{ value: "separated", label: t("design.contact.separated") },
			{ value: "stacked", label: t("design.contact.stacked") },
		],
		[t],
	);

	const weightChoices: {
		value: HeaderOptions["nameFontWeight"];
		label: string;
	}[] = useMemo(
		() => [
			{ value: "normal", label: t("layout.controls.header.weight.normal") },
			{ value: "bold", label: t("layout.controls.header.weight.bold") },
			{ value: "heavy", label: t("layout.controls.header.weight.heavy") },
		],
		[t],
	);

	const titleStyleChoices: {
		value: HeaderOptions["titleStyle"];
		label: string;
	}[] = useMemo(
		() => [
			{ value: "normal", label: t("layout.controls.header.titleStyle.normal") },
			{ value: "italic", label: t("layout.controls.header.titleStyle.italic") },
			{
				value: "uppercase",
				label: t("layout.controls.header.titleStyle.uppercase"),
			},
		],
		[t],
	);

	const aspectRatioOptions: SelectOption<PhotoOptions["aspectRatio"]>[] =
		useMemo(
			() => [
				{ value: "1:1", label: "1:1" },
				{ value: "3:4", label: "3:4" },
				{ value: "4:3", label: "4:3" },
			],
			[],
		);

	return (
		<div className="space-y-4">
			<Group title={t("design.header.layout")}>
				<OptionGrid
					label={t("design.header.align")}
					group="align"
					columns={2}
					choices={alignChoices}
					value={style.header.align}
					onChange={(align) => design.patchHeaderStyle({ align })}
				/>
				<OptionGrid
					label={t("design.header.contact")}
					group="contact"
					choices={contactChoices}
					value={style.header.contact}
					onChange={(contact) => design.patchHeaderStyle({ contact })}
				/>
				<Toggle
					label={t("design.header.divider")}
					hint={t("design.header.divider.help")}
					checked={style.header.divider}
					onChange={(divider) => design.patchHeaderStyle({ divider })}
				/>
			</Group>

			<Group title={t("layout.controls.header.nameSection")}>
				<Slider
					label={t("layout.controls.header.nameSize")}
					value={header.nameFontSize}
					min={14}
					max={36}
					onChange={(nameFontSize) => design.patchHeader({ nameFontSize })}
				/>
				<Segmented
					label={t("layout.controls.header.weight.label")}
					choices={weightChoices}
					value={header.nameFontWeight}
					onChange={(nameFontWeight) => design.patchHeader({ nameFontWeight })}
				/>
				<ColorField
					label={t("layout.controls.header.color")}
					value={header.nameColor || "#000000"}
					onChange={(nameColor) => design.patchHeader({ nameColor })}
				/>
				<Segmented
					label={t("layout.controls.header.titleStyle.label")}
					choices={titleStyleChoices}
					value={header.titleStyle}
					onChange={(titleStyle) => design.patchHeader({ titleStyle })}
				/>
			</Group>

			<Group title={t("layout.controls.header.divider.title")}>
				<Segmented
					label={t("layout.controls.header.divider.thickness")}
					choices={[
						{ value: 1, label: "1" },
						{ value: 2, label: "2" },
						{ value: 3, label: "3" },
					]}
					value={header.dividerThickness}
					onChange={(value) =>
						design.patchHeader({
							dividerThickness: value as HeaderOptions["dividerThickness"],
						})
					}
				/>
				<Segmented
					label={t("layout.controls.header.divider.style.label")}
					choices={[
						{
							value: "solid",
							label: t("layout.controls.header.divider.style.solid"),
						},
						{
							value: "dashed",
							label: t("layout.controls.header.divider.style.dashed"),
						},
					]}
					value={header.dividerStyle}
					onChange={(dividerStyle) => design.patchHeader({ dividerStyle })}
				/>
			</Group>

			<Group title={t("layout.controls.photo.title")}>
				<Toggle
					label={t("layout.controls.photo.enable")}
					checked={photo.enabled}
					onChange={(enabled) => design.patchPhoto({ enabled })}
				/>

				{photo.enabled && (
					<div className="space-y-2">
						<Field label={t("layout.controls.photo.title")}>
							<SelectMenu
								className="w-full"
								options={aspectRatioOptions}
								value={photo.aspectRatio || "1:1"}
								placeholder={t("layout.controls.photo.title")}
								onSelect={(aspectRatio) => design.patchPhoto({ aspectRatio })}
							/>
						</Field>
						<Slider
							label={t("layout.controls.photo.borderRadius.label")}
							value={photo.borderRadius ?? 1}
							min={1}
							max={50}
							suffix="px"
							onChange={(borderRadius) => design.patchPhoto({ borderRadius })}
						/>
						<input
							id={photoInputId}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								const reader = new FileReader();
								reader.onload = () =>
									design.patchPhoto({
										dataUrl:
											typeof reader.result === "string" ? reader.result : "",
									});
								reader.readAsDataURL(file);
							}}
						/>
						<button
							type="button"
							onClick={() => document.getElementById(photoInputId)?.click()}
							className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
						>
							<Upload className="w-4 h-4" />
							<span>{t("layout.controls.photo.choose")}</span>
						</button>
						<p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-2">
							{t("layout.controls.photo.atsWarning")}
						</p>
					</div>
				)}
			</Group>
		</div>
	);
}
