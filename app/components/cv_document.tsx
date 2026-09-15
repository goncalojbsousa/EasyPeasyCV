import { Font } from "@react-pdf/renderer";
import type { CvData, CvRenderSettings } from "../types/cv";
import { ClassicTemplate } from "./cv_templates/classic_template";
import { ProfessionalTemplate } from "./cv_templates/professional_template";
import { TimelineTemplate } from "./cv_templates/timeline_template";

/**
 * Props for every component that renders a CV: the CV itself plus the language
 * it should be rendered in. Template, color and layout settings travel inside
 * `CvData`, so the whole PDF pipeline shares one prop shape.
 */
export interface CvRenderProps {
	data: CvData;
	/** Language for the document (pt, br, en or es) */
	lang?: string;
}

/**
 * A custom uploaded font must be registered with @react-pdf before any
 * template references it by name.
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
 * Main CV Document component
 * Selects and renders the template named by `data.template`.
 */
export function CvDocument({ data, lang }: CvRenderProps) {
	registerCustomFont(data.settings);

	const templateProps = { ...data, lang, color: data.color ?? "blue" };

	switch (data.template) {
		case "timeline":
			return <TimelineTemplate {...templateProps} />;
		case "classic":
			return <ClassicTemplate {...templateProps} />;
		default:
			return <ProfessionalTemplate {...templateProps} />;
	}
}
