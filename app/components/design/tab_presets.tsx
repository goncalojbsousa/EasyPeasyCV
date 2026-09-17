"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import type { CvTemplate } from "../../types/cv";
import { PRESET_KEYS } from "../../utils/style-presets";
import { ColorSelector } from "../ui/color_selector";
import { Group, Toggle } from "./controls";
import type { DesignController } from "./use_design_settings";

const PRESET_PREVIEWS: Record<CvTemplate, string> = {
	professional: "/professional_preview.webp",
	classic: "/classic_preview.webp",
	timeline: "/timeline_preview.webp",
};

/**
 * Starting points and the accent colour.
 *
 * Presets are deliberately framed as a *starting point*, not a locked theme:
 * picking one fills in all the modular options, which the other tabs then let
 * the user change individually.
 */
export function PresetsTab({ design }: { design: DesignController }) {
	const { t } = useLanguage();

	return (
		<div className="space-y-4">
			<Group title={t("design.presets.title")} help={t("design.presets.help")}>
				<div className="grid grid-cols-3 gap-2">
					{PRESET_KEYS.map((preset) => {
						const selected = design.activePreset === preset;
						return (
							<button
								key={preset}
								type="button"
								onClick={() => design.applyPreset(preset)}
								aria-pressed={selected}
								className={`relative rounded-lg border overflow-hidden text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
									selected
										? "border-sky-500 ring-1 ring-sky-400/60"
										: "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
								}`}
							>
								<div className="relative w-full aspect-[3/4] bg-gray-50 dark:bg-zinc-800">
									<Image
										src={PRESET_PREVIEWS[preset]}
										alt={t(`template.${preset}.name`)}
										fill
										className="object-cover object-top"
										sizes="120px"
									/>
									{selected && (
										<span className="absolute top-1 right-1 bg-sky-500 text-white rounded-full p-0.5">
											<Check className="w-3 h-3" />
										</span>
									)}
								</div>
								<span
									className={`block px-1.5 py-1 text-[10px] leading-tight text-center ${
										selected
											? "font-semibold text-sky-700 dark:text-sky-300"
											: "text-gray-600 dark:text-gray-400"
									}`}
								>
									{t(`template.${preset}.name`)}
								</span>
							</button>
						);
					})}
				</div>

				{design.activePreset === null && (
					<p className="text-[10px] text-gray-500 dark:text-gray-400">
						{t("design.presets.customised")}
					</p>
				)}
			</Group>

			<Group title={t("color.selector")}>
				<div className="h-9">
					<ColorSelector
						selectedColor={design.color}
						onColorChange={design.setColor}
						show={true}
					/>
				</div>
				<Toggle
					label={t("layout.controls.links.useThemeColor.label")}
					hint={t("layout.controls.links.useThemeColor.help")}
					checked={!!design.settings.sections.useThemeColorForLinks}
					onChange={(checked) =>
						design.patchSections({ useThemeColorForLinks: checked })
					}
				/>
			</Group>
		</div>
	);
}
