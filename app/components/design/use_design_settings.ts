"use client";

import { useMemo } from "react";
import type {
	CvColor,
	CvLayoutSettings,
	CvRenderSettings,
	CvStyleSettings,
	CvTemplate,
	EntryVariant,
	HeaderOptions,
	PhotoOptions,
	SectionOptions,
	StyledSectionKey,
} from "../../types/cv";
import { DEFAULT_RENDER_SETTINGS } from "../../utils/cv-data";
import {
	cloneStyle,
	matchPreset,
	resolveStyle,
	STYLE_PRESETS,
} from "../../utils/style-presets";

export interface DesignController {
	settings: CvRenderSettings;
	style: CvStyleSettings;
	color: CvColor;
	setColor: (color: CvColor) => void;

	/* Design tokens */
	patchLayout: (patch: Partial<CvLayoutSettings>) => void;
	patchHeader: (patch: Partial<HeaderOptions>) => void;
	patchPhoto: (patch: Partial<PhotoOptions>) => void;
	patchSections: (patch: Partial<SectionOptions>) => void;

	/* Modular variants */
	patchStyle: (patch: Partial<CvStyleSettings>) => void;
	patchSectionTitle: (patch: Partial<CvStyleSettings["sectionTitle"]>) => void;
	patchHeaderStyle: (patch: Partial<CvStyleSettings["header"]>) => void;
	setEntryVariant: (key: StyledSectionKey, variant: EntryVariant) => void;

	/** The preset the current style matches, or null once customised */
	activePreset: CvTemplate | null;
	applyPreset: (preset: CvTemplate) => void;
	/** Restores every design token and variant to its default */
	resetAll: () => void;
}

/**
 * Typed writers for the render settings.
 *
 * Without these every control has to spell out
 * `onChange({ ...settings, layout: { ...settings.layout, x: v } })`, which is
 * where the old flat panel got most of its bulk — and its bugs, since a
 * forgotten spread silently dropped sibling values.
 */
export function useDesignSettings(
	rawSettings: CvRenderSettings | undefined,
	onSettingsChange: (settings: CvRenderSettings) => void,
	color: CvColor,
	setColor: (color: CvColor) => void,
	legacyTemplate?: CvTemplate,
): DesignController {
	const settings = rawSettings ?? DEFAULT_RENDER_SETTINGS;
	const style = useMemo(
		() => resolveStyle(settings, legacyTemplate),
		[settings, legacyTemplate],
	);

	return useMemo(() => {
		const commit = (next: CvRenderSettings) => onSettingsChange(next);
		const commitStyle = (nextStyle: CvStyleSettings) =>
			commit({ ...settings, style: nextStyle });

		return {
			settings,
			style,
			color,
			setColor,

			patchLayout: (patch) =>
				commit({ ...settings, layout: { ...settings.layout, ...patch } }),
			patchHeader: (patch) =>
				commit({ ...settings, header: { ...settings.header, ...patch } }),
			patchPhoto: (patch) =>
				commit({ ...settings, photo: { ...settings.photo, ...patch } }),
			patchSections: (patch) =>
				commit({ ...settings, sections: { ...settings.sections, ...patch } }),

			patchStyle: (patch) => commitStyle({ ...style, ...patch }),
			patchSectionTitle: (patch) =>
				commitStyle({
					...style,
					sectionTitle: { ...style.sectionTitle, ...patch },
				}),
			patchHeaderStyle: (patch) =>
				commitStyle({ ...style, header: { ...style.header, ...patch } }),
			setEntryVariant: (key, variant) =>
				commitStyle({
					...style,
					entries: { ...style.entries, [key]: variant },
				}),

			activePreset: matchPreset(style),
			applyPreset: (preset) => commitStyle(cloneStyle(STYLE_PRESETS[preset])),
			resetAll: () => {
				commit({
					...DEFAULT_RENDER_SETTINGS,
					// Keep the uploaded photo; wiping it on a style reset would be
					// destructive and is not what "reset design" implies.
					photo: {
						...DEFAULT_RENDER_SETTINGS.photo,
						dataUrl: settings.photo.dataUrl ?? null,
						crop: settings.photo.crop ?? null,
					},
					style: cloneStyle(STYLE_PRESETS.professional),
				});
				setColor("blue");
			},
		};
	}, [settings, style, color, setColor, onSettingsChange]);
}
