import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { CvRenderSettings, CvTemplate } from "../app/types/cv";
import { STYLED_SECTION_KEYS } from "../app/types/cv";
import { DEFAULT_RENDER_SETTINGS } from "../app/utils/cv-data";
import {
	cloneStyle,
	DEFAULT_CV_STYLE,
	matchPreset,
	PRESET_KEYS,
	resolveStyle,
	STYLE_PRESETS,
} from "../app/utils/style-presets";

const LEGACY_TEMPLATES: CvTemplate[] = ["professional", "classic", "timeline"];

describe("modular style presets", () => {
	test("every legacy theme has a reproducing preset", () => {
		for (const template of LEGACY_TEMPLATES) {
			assert.ok(
				STYLE_PRESETS[template],
				`missing preset for legacy theme "${template}"`,
			);
		}
		assert.deepStrictEqual(
			[...PRESET_KEYS].sort(),
			[...LEGACY_TEMPLATES].sort(),
		);
	});

	test("presets cover every styled section", () => {
		for (const template of PRESET_KEYS) {
			for (const key of STYLED_SECTION_KEYS) {
				assert.ok(
					STYLE_PRESETS[template].entries[key],
					`preset "${template}" has no entry variant for "${key}"`,
				);
			}
		}
	});

	test("a CV saved with a legacy theme migrates to that theme's preset", () => {
		for (const template of LEGACY_TEMPLATES) {
			const settings: CvRenderSettings = {
				...DEFAULT_RENDER_SETTINGS,
				style: undefined,
			};
			assert.deepStrictEqual(
				resolveStyle(settings, template),
				STYLE_PRESETS[template],
			);
		}
	});

	test("a CV with no settings at all falls back to the default style", () => {
		assert.deepStrictEqual(
			resolveStyle(undefined, undefined),
			DEFAULT_CV_STYLE,
		);
	});

	test("an explicit style always wins over the legacy theme", () => {
		const style = cloneStyle(STYLE_PRESETS.timeline);
		const settings = { ...DEFAULT_RENDER_SETTINGS, style };
		assert.deepStrictEqual(resolveStyle(settings, "classic"), style);
	});

	test("matchPreset recognises each preset and rejects a customised style", () => {
		for (const template of PRESET_KEYS) {
			assert.equal(matchPreset(cloneStyle(STYLE_PRESETS[template])), template);
		}

		const customised = cloneStyle(STYLE_PRESETS.professional);
		customised.bullets = "dash";
		assert.equal(matchPreset(customised), null);
	});

	test("cloneStyle produces an independent copy", () => {
		const copy = cloneStyle(STYLE_PRESETS.classic);
		copy.entries.professional_experience = "timeline";
		copy.sectionTitle.align = "center";

		assert.equal(
			STYLE_PRESETS.classic.entries.professional_experience,
			"card",
			"mutating a clone must not affect the preset",
		);
		assert.equal(STYLE_PRESETS.classic.sectionTitle.align, "left");
	});
});
