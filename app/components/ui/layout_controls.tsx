"use client";

import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import type {
	CvColor,
	CvRenderSettings,
	DateFormat,
	FontFamilyOption,
	HeaderOptions,
	LayoutDensity,
	PhotoOptions,
	TextAlignment,
} from "../../types/cv";
import { ColorSelector } from "./color_selector";
import { SelectMenu, type SelectOption } from "./select_menu";

type TFunc = (key: string) => string;

interface LayoutControlsProps {
	t: TFunc;
	settings?: CvRenderSettings;
	selectedColor: CvColor;
	onColorChange: (c: CvColor) => void;
	onSettingsChange?: (s: CvRenderSettings) => void;
	onResetSectionOrder?: () => void;
}

export function LayoutControls({
	t,
	settings,
	selectedColor,
	onColorChange,
	onSettingsChange,
	onResetSectionOrder,
}: LayoutControlsProps) {
	const fontOptions: SelectOption<FontFamilyOption>[] = useMemo(
		() => [
			{ value: "Helvetica", label: "Helvetica" },
			{ value: "Times-Roman", label: "Times New Roman" },
			{ value: "Arial", label: "Arial" },
		],
		[],
	);

	const headerWeightOptions: SelectOption<HeaderOptions["nameFontWeight"]>[] =
		useMemo(
			() => [
				{ value: "normal", label: t("layout.controls.header.weight.normal") },
				{ value: "bold", label: t("layout.controls.header.weight.bold") },
				{ value: "heavy", label: t("layout.controls.header.weight.heavy") },
			],
			[t],
		);

	const titleStyleOptions: SelectOption<HeaderOptions["titleStyle"]>[] =
		useMemo(
			() => [
				{
					value: "normal",
					label: t("layout.controls.header.titleStyle.normal"),
				},
				{
					value: "italic",
					label: t("layout.controls.header.titleStyle.italic"),
				},
				{
					value: "uppercase",
					label: t("layout.controls.header.titleStyle.uppercase"),
				},
			],
			[t],
		);

	const dividerThicknessOptions: SelectOption<
		HeaderOptions["dividerThickness"]
	>[] = useMemo(
		() => [
			{ value: 1, label: "1px" },
			{ value: 2, label: "2px" },
			{ value: 3, label: "3px" },
		],
		[],
	);

	const dividerStyleOptions: SelectOption<HeaderOptions["dividerStyle"]>[] =
		useMemo(
			() => [
				{
					value: "solid",
					label: t("layout.controls.header.divider.style.solid"),
				},
				{
					value: "dashed",
					label: t("layout.controls.header.divider.style.dashed"),
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

	const densityOptions: SelectOption<LayoutDensity>[] = useMemo(
		() => [
			{ value: "compact", label: t("layout.controls.density.compact") },
			{ value: "normal", label: t("layout.controls.density.normal") },
			{ value: "spacious", label: t("layout.controls.density.spacious") },
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

	const textAlignmentOptions: SelectOption<TextAlignment>[] = useMemo(
		() => [
			{ value: "left", label: t("layout.controls.textAlignment.left") },
			{ value: "justify", label: t("layout.controls.textAlignment.justify") },
		],
		[t],
	);

	return (
		<div className="px-4 py-3 space-y-3">
			<div>
				<label htmlFor="font-select" className="block text-xs font-medium mb-1">
					{t("layout.controls.font.label")}
				</label>
				<SelectMenu
					className="w-full"
					options={fontOptions}
					value={settings?.layout.fontFamily || "Helvetica"}
					placeholder={t("layout.controls.font")}
					onSelect={(value) =>
						onSettingsChange &&
						settings &&
						onSettingsChange({
							...settings,
							layout: { ...settings.layout, fontFamily: value },
						})
					}
				/>
			</div>
			<div>
				<label
					htmlFor="text-scale"
					className="block text-xs font-medium mb-1"
				>{`${t("layout.controls.textScale.label")} (${Math.round((settings?.layout.textScale || 1) * 100)}%)`}</label>
				<input
					id="text-scale"
					type="range"
					min={0.8}
					max={1.2}
					step={0.05}
					value={settings?.layout.textScale || 1}
					onChange={(e) =>
						onSettingsChange &&
						settings &&
						onSettingsChange({
							...settings,
							layout: {
								...settings.layout,
								textScale: parseFloat(e.target.value),
							},
						})
					}
					className="w-full"
				/>
			</div>
			<div>
				<span className="block text-xs font-medium mb-1">{`${t("layout.controls.margins.title")} (cm)`}</span>
				<div className="grid grid-cols-2 gap-2">
					<div>
						<span className="text-xs">{`${t("layout.controls.margins.top")}: ${settings?.layout.marginsCm.top}`}</span>
						<input
							type="range"
							min={0.5}
							max={3}
							step={0.1}
							value={settings?.layout.marginsCm.top || 1.5}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									layout: {
										...settings.layout,
										marginsCm: {
											...settings.layout.marginsCm,
											top: parseFloat(e.target.value),
										},
									},
								})
							}
						/>
					</div>
					<div>
						<span className="text-xs">{`${t("layout.controls.margins.bottom")}: ${settings?.layout.marginsCm.bottom}`}</span>
						<input
							type="range"
							min={0.5}
							max={3}
							step={0.1}
							value={settings?.layout.marginsCm.bottom || 1.5}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									layout: {
										...settings.layout,
										marginsCm: {
											...settings.layout.marginsCm,
											bottom: parseFloat(e.target.value),
										},
									},
								})
							}
						/>
					</div>
					<div>
						<span className="text-xs">{`${t("layout.controls.margins.left")}: ${settings?.layout.marginsCm.left}`}</span>
						<input
							type="range"
							min={0.5}
							max={3}
							step={0.1}
							value={settings?.layout.marginsCm.left || 1.5}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									layout: {
										...settings.layout,
										marginsCm: {
											...settings.layout.marginsCm,
											left: parseFloat(e.target.value),
										},
									},
								})
							}
						/>
					</div>
					<div>
						<span className="text-xs">{`${t("layout.controls.margins.right")}: ${settings?.layout.marginsCm.right}`}</span>
						<input
							type="range"
							min={0.5}
							max={3}
							step={0.1}
							value={settings?.layout.marginsCm.right || 1.5}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									layout: {
										...settings.layout,
										marginsCm: {
											...settings.layout.marginsCm,
											right: parseFloat(e.target.value),
										},
									},
								})
							}
						/>
					</div>
				</div>
			</div>
			<div>
				<label
					htmlFor="line-spacing"
					className="block text-xs font-medium mb-1"
				>{`${t("layout.controls.lineSpacing.label")} (${settings?.layout.lineSpacing})`}</label>
				<input
					id="line-spacing"
					type="range"
					min={1.0}
					max={2.0}
					step={0.1}
					value={settings?.layout.lineSpacing || 1.4}
					onChange={(e) =>
						onSettingsChange &&
						settings &&
						onSettingsChange({
							...settings,
							layout: {
								...settings.layout,
								lineSpacing: parseFloat(e.target.value),
							},
						})
					}
					className="w-full"
				/>
			</div>
			<div>
				<label
					htmlFor="section-spacing"
					className="block text-xs font-medium mb-1"
				>{`${t("layout.controls.sectionSpacing.label")} (${settings?.layout.sectionSpacingPx}px)`}</label>
				<input
					id="section-spacing"
					type="range"
					min={10}
					max={30}
					step={2}
					value={settings?.layout.sectionSpacingPx || 12}
					onChange={(e) =>
						onSettingsChange &&
						settings &&
						onSettingsChange({
							...settings,
							layout: {
								...settings.layout,
								sectionSpacingPx: parseInt(e.target.value, 10),
							},
						})
					}
					className="w-full"
				/>
			</div>

			<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
				<div className="text-[11px] font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
					{t("layout.controls.quickSettings")}
				</div>

				<div className="mb-3">
					<label
						htmlFor="density-select"
						className="block text-xs font-medium mb-1"
					>
						{t("layout.controls.density.label")}
					</label>
					<SelectMenu
						className="w-full"
						options={densityOptions}
						value={settings?.layout.density || "normal"}
						placeholder={t("layout.controls.density.label")}
						onSelect={(value) =>
							onSettingsChange &&
							settings &&
							onSettingsChange({
								...settings,
								layout: { ...settings.layout, density: value },
							})
						}
					/>
					<div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
						{t("layout.controls.density.help")}
					</div>
				</div>

				<div className="mb-3">
					<label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
						<input
							type="checkbox"
							checked={settings?.layout.singlePageMode || false}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									layout: {
										...settings.layout,
										singlePageMode: e.target.checked,
									},
								})
							}
							className="rounded"
						/>
						{t("layout.controls.singlePageMode.label")}
					</label>
					<div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-5">
						{t("layout.controls.singlePageMode.help")}
					</div>
				</div>

				<div>
					<label
						htmlFor="text-alignment-select"
						className="block text-xs font-medium mb-1"
					>
						{t("layout.controls.textAlignment.label")}
					</label>
					<SelectMenu
						className="w-full"
						options={textAlignmentOptions}
						value={settings?.layout.textAlignment || "left"}
						placeholder={t("layout.controls.textAlignment.label")}
						onSelect={(value) =>
							onSettingsChange &&
							settings &&
							onSettingsChange({
								...settings,
								layout: { ...settings.layout, textAlignment: value },
							})
						}
					/>
				</div>
			</div>

			<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
				<div className="text-xs font-semibold mb-3 text-gray-700 dark:text-gray-300">
					{t("layout.controls.header.title")}
				</div>

				<div className="space-y-2 mb-3">
					<div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
						{t("layout.controls.header.nameSection")}
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div>
							<label
								htmlFor="name-size"
								className="block text-xs mb-1"
							>{`${t("layout.controls.header.nameSize")} (${settings?.header.nameFontSize})`}</label>
							<input
								id="name-size"
								type="range"
								min={16}
								max={28}
								step={1}
								value={settings?.header.nameFontSize || 22}
								onChange={(e) =>
									onSettingsChange &&
									settings &&
									onSettingsChange({
										...settings,
										header: {
											...settings.header,
											nameFontSize: parseInt(e.target.value, 10),
										},
									})
								}
								className="w-full"
							/>
						</div>
						<div>
							<label htmlFor="header-weight" className="block text-xs mb-1">
								{t("layout.controls.header.weight.label")}
							</label>
							<SelectMenu
								className="w-full"
								options={headerWeightOptions}
								value={settings?.header.nameFontWeight || "bold"}
								placeholder={t("layout.controls.header.weight.label")}
								onSelect={(value) =>
									onSettingsChange &&
									settings &&
									onSettingsChange({
										...settings,
										header: { ...settings.header, nameFontWeight: value },
									})
								}
							/>
						</div>
						<div>
							<label htmlFor="header-color" className="block text-xs mb-1">
								{t("layout.controls.header.color")}
							</label>
							<input
								id="header-color"
								type="color"
								value={settings?.header.nameColor || "#000000"}
								onChange={(e) =>
									onSettingsChange &&
									settings &&
									onSettingsChange({
										...settings,
										header: { ...settings.header, nameColor: e.target.value },
									})
								}
								className="w-full h-8 p-0 rounded"
							/>
						</div>
						<div>
							<label htmlFor="title-style" className="block text-xs mb-1">
								{t("layout.controls.header.titleStyle.label")}
							</label>
							<SelectMenu
								className="w-full"
								options={titleStyleOptions}
								value={settings?.header.titleStyle || "normal"}
								placeholder={t("layout.controls.header.titleStyle.label")}
								onSelect={(value) =>
									onSettingsChange &&
									settings &&
									onSettingsChange({
										...settings,
										header: { ...settings.header, titleStyle: value },
									})
								}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-2 mb-3">
					<div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
						{t("layout.controls.header.divider.title")}
					</div>
					<div className="grid grid-cols-2 gap-2">
						<SelectMenu
							className="w-full min-w-0"
							options={dividerThicknessOptions}
							value={settings?.header.dividerThickness || 1}
							placeholder={t("layout.controls.header.divider.thickness")}
							onSelect={(value) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									header: { ...settings.header, dividerThickness: value },
								})
							}
						/>
						<SelectMenu
							className="w-full min-w-0"
							options={dividerStyleOptions}
							value={settings?.header.dividerStyle || "solid"}
							placeholder={t("layout.controls.header.divider.style.label")}
							onSelect={(value) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									header: { ...settings.header, dividerStyle: value },
								})
							}
						/>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
				<div className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
					{t("color.selector")}
				</div>
				<div className="h-9">
					<ColorSelector
						selectedColor={selectedColor}
						onColorChange={onColorChange}
						show={true}
					/>
				</div>
				<label className="mt-3 flex items-center gap-2 text-xs font-medium cursor-pointer text-gray-800 dark:text-gray-200">
					<input
						type="checkbox"
						checked={!!settings?.sections?.useThemeColorForLinks}
						onChange={(e) =>
							onSettingsChange &&
							settings &&
							onSettingsChange({
								...settings,
								sections: {
									...settings.sections,
									useThemeColorForLinks: e.target.checked,
								},
							})
						}
						className="rounded"
					/>
					<span>{t("layout.controls.links.useThemeColor.label")}</span>
				</label>
				<div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
					{t("layout.controls.links.useThemeColor.help")}
				</div>
			</div>

			<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
				<div className="text-xs font-semibold mb-2">
					{t("layout.controls.photo.title")}
				</div>
				<label className="flex items-center gap-2 text-xs font-medium">
					<input
						type="checkbox"
						checked={settings?.photo.enabled || false}
						onChange={(e) =>
							onSettingsChange &&
							settings &&
							onSettingsChange({
								...settings,
								photo: { ...settings.photo, enabled: e.target.checked },
							})
						}
					/>
					{t("layout.controls.photo.enable")}
				</label>
				{settings?.photo.enabled && (
					<div className="mt-2 space-y-2">
						<SelectMenu
							className="w-full"
							options={aspectRatioOptions}
							value={settings?.photo.aspectRatio || "1:1"}
							placeholder={t("layout.controls.photo.title")}
							onSelect={(value) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									photo: { ...settings.photo, aspectRatio: value },
								})
							}
						/>
						<div>
							<label
								htmlFor="border-radius"
								className="block text-xs font-medium mb-1"
							>{`${t("layout.controls.photo.borderRadius.label")} (${settings?.photo.borderRadius ?? 1}px)`}</label>
							<input
								id="border-radius"
								type="range"
								min={1}
								max={50}
								step={1}
								value={settings?.photo.borderRadius ?? 1}
								onChange={(e) =>
									onSettingsChange &&
									settings &&
									onSettingsChange({
										...settings,
										photo: {
											...settings.photo,
											borderRadius: parseInt(e.target.value, 10),
										},
									})
								}
								className="w-full"
							/>
						</div>
						<div className="flex items-center gap-2">
							<input
								id="photo-upload-desktop"
								type="file"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (!file || !onSettingsChange || !settings) return;
									const reader = new FileReader();
									reader.onload = () => {
										const dataUrl =
											typeof reader.result === "string" ? reader.result : "";
										onSettingsChange({
											...settings,
											photo: { ...settings.photo, dataUrl },
										});
									};
									reader.readAsDataURL(file);
								}}
								className="hidden"
							/>
							<button
								type="button"
								onClick={() =>
									document.getElementById("photo-upload-desktop")?.click()
								}
								className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									className="w-4 h-4"
									aria-hidden="true"
								>
									<title>Upload</title>
									<path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
									<path d="M7 9l5-5 5 5" />
									<path d="M12 4v12" />
								</svg>
								<span>{t("layout.controls.photo.choose")}</span>
							</button>
						</div>
						<div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-2">
							{t("layout.controls.photo.atsWarning")}
						</div>
					</div>
				)}
			</div>

			<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
				<div className="text-xs font-semibold mb-3 text-gray-700 dark:text-gray-300">
					{t("layout.controls.sections.title")}
				</div>

				<div className="space-y-3">
					<div>
						<label
							htmlFor="section-title-color"
							className="block text-xs font-medium mb-1"
						>
							{t("layout.controls.sections.titleColor")}
						</label>
						<input
							id="section-title-color"
							type="color"
							value={settings?.sections?.titleColor || "#000000"}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									sections: {
										...settings.sections,
										titleColor: e.target.value,
										titleFontSize: settings.sections?.titleFontSize || 12,
										dateFormat: settings.sections?.dateFormat || "medium",
									},
								})
							}
							className="w-full h-8 p-0 rounded"
						/>
					</div>

					<div>
						<label
							htmlFor="section-title-size"
							className="block text-xs font-medium mb-1"
						>{`${t("layout.controls.sections.titleSize")} (${settings?.sections?.titleFontSize || 12})`}</label>
						<input
							id="section-title-size"
							type="range"
							min={10}
							max={16}
							step={1}
							value={settings?.sections?.titleFontSize || 12}
							onChange={(e) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									sections: {
										...settings.sections,
										titleFontSize: parseInt(e.target.value, 10),
										titleColor: settings.sections?.titleColor || "#000000",
										dateFormat: settings.sections?.dateFormat || "medium",
									},
								})
							}
							className="w-full"
						/>
					</div>

					<div>
						<label
							htmlFor="date-format-select"
							className="block text-xs font-medium mb-1"
						>
							{t("layout.controls.sections.dateFormat.label")}
						</label>
						<SelectMenu
							className="w-full"
							options={dateFormatOptions}
							value={settings?.sections?.dateFormat || "medium"}
							placeholder={t("layout.controls.sections.dateFormat.label")}
							onSelect={(value) =>
								onSettingsChange &&
								settings &&
								onSettingsChange({
									...settings,
									sections: {
										...settings.sections,
										dateFormat: value,
										titleColor: settings.sections?.titleColor || "#000000",
										titleFontSize: settings.sections?.titleFontSize || 12,
									},
								})
							}
						/>
						<div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
							{t("layout.controls.sections.dateFormat.help")}
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
				<button
					type="button"
					className="w-full h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm flex items-center justify-center gap-2"
					onClick={() => {
						if (!onSettingsChange || !settings) return;
						const layoutDefaults = {
							fontFamily: "Helvetica" as const,
							customFont: null,
							textScale: 1.0,
							marginsCm: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
							lineSpacing: 1.4,
							sectionSpacingPx: 12,
							columns: 1 as const,
							atsSafe: false,
							density: "normal" as const,
							textAlignment: "left" as const,
							singlePageMode: false,
						};
						const headerDefaults = {
							nameFontSize: 22,
							nameFontWeight: "bold" as const,
							nameColor: "#000000",
							titleStyle: "normal" as const,
							titlePosition: "below" as const,
							dividerThickness: 1 as const,
							dividerStyle: "solid" as const,
							iconSizePx: 18 as const,
							iconSpacingPx: 9 as const,
							iconAlignment: "left" as const,
						};
						const photoDefaults = {
							enabled: false,
							aspectRatio: "1:1" as const,
							borderRadius: 1,
							crop: null,
							dataUrl: null,
						};
						const sectionsDefaults = {
							titleColor: "#000000",
							titleFontSize: 12,
							dateFormat: "medium" as const,
							useThemeColorForLinks: false,
						};
						onSettingsChange({
							...settings,
							layout: layoutDefaults,
							header: headerDefaults,
							photo: photoDefaults,
							sections: sectionsDefaults,
						});
						onColorChange("blue");
					}}
				>
					<RotateCcw className="w-4 h-4" />
					<span className="font-medium">{t("layout.controls.reset")}</span>
				</button>
			</div>

			{onResetSectionOrder && (
				<div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
					<button
						type="button"
						className="w-full h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm flex items-center justify-center gap-2"
						onClick={onResetSectionOrder}
						title={t("section.order.reset")}
					>
						<RotateCcw className="w-4 h-4" />
						<span className="font-medium">{t("section.order.reset")}</span>
					</button>
				</div>
			)}
		</div>
	);
}
