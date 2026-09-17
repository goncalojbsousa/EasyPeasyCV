import { Font } from "@react-pdf/renderer";
import type { CvData, CvRenderSettings } from "../types/cv";
import { resolveStyle } from "../utils/style-presets";
import { CvRenderer } from "./cv_templates/cv_renderer";

/**
 * Props for every component that renders a CV: the CV itself plus the language
 * it should be rendered in. Presentation choices travel inside
 * `CvData.settings.style`, so the whole PDF pipeline shares one prop shape.
 */
export interface CvRenderProps {
	data: CvData;
	/** Language for the document (pt, br, en or es) */
	lang?: string;
}

/**
 * A custom uploaded font must be registered with @react-pdf before any
 * style references it by name.
 */
function registerCustomFont(settings?: CvRenderSettings) {
	if (settings?.layout.fontFamily !== "Custom") return;
	const customFont = settings.layout.customFont;
	if (!customFont?.dataUrl || !customFont?.name) return;

	try {
		Font.register({
			family: customFont.name,
			src: customFont.dataUrl,
			fontStyle: "normal",
			fontWeight: "normal",
		});
	} catch {
		// A failed registration falls back to the default font
	}
}

/**
 * Main CV Document component.
 * Resolves the modular style (migrating CVs saved with a legacy theme) and
 * hands it to the renderer.
 */
export function CvDocument({ data, lang }: CvRenderProps) {
	registerCustomFont(data.settings);

	return (
		<CvRenderer
			data={data}
			lang={lang || "pt"}
			style={resolveStyle(data.settings, data.template)}
		/>
	);
}
