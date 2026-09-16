import { StyleSheet } from "@react-pdf/renderer";
import type { CvColor, CvRenderSettings, CvStyleSettings } from "../types/cv";
import { getColorTheme } from "./color-themes";
import { cmToPt } from "./template-helpers";

export type PdfTextAlign = "left" | "right" | "center" | "justify";

export interface DensityMultipliers {
	margin: number;
	spacing: number;
	lineHeight: number;
	fontSize: number;
}

export interface ComputedMetrics {
	margins: { top: number; right: number; bottom: number; left: number };
	sectionSpacing: number;
	lineSpacing: number;
	finalScale: number;
	singlePageMult: number;
	densityMult: DensityMultipliers;
	textAlign: PdfTextAlign;
	fontFamily: string;
	sectionTitleColor: string;
	sectionTitleSize: number;
	accent: string;
	linkColor: string;
}

export const DENSITY_PRESETS: Record<
	"compact" | "normal" | "spacious",
	DensityMultipliers
> = {
	compact: { margin: 0.7, spacing: 0.6, lineHeight: 0.9, fontSize: 0.95 },
	normal: { margin: 1, spacing: 1, lineHeight: 1, fontSize: 1 },
	spacious: { margin: 1.3, spacing: 1.5, lineHeight: 1.1, fontSize: 1 },
};

export function computeMetrics(
	settings?: CvRenderSettings,
	color: CvColor = "blue",
): ComputedMetrics {
	const s = settings;
	const hyperlinkBlue = "#2563eb";
	const scale = s?.layout.textScale || 1;
	const familyRaw = s?.layout.fontFamily || "Helvetica";
	const fontFamily =
		s?.layout.fontFamily === "Custom"
			? s?.layout.customFont?.name || "Helvetica"
			: familyRaw === "Arial"
				? "Helvetica"
				: familyRaw;

	const density = s?.layout.density || "normal";
	const densityMult = DENSITY_PRESETS[density];
	const singlePageMult = s?.layout.singlePageMode ? 0.85 : 1;

	const baseMargins = s?.layout.marginsCm ?? {
		top: 1.5,
		right: 1.5,
		bottom: 1.5,
		left: 1.5,
	};
	const margins = {
		top: baseMargins.top * densityMult.margin * singlePageMult,
		right: baseMargins.right * densityMult.margin * singlePageMult,
		bottom: baseMargins.bottom * densityMult.margin * singlePageMult,
		left: baseMargins.left * densityMult.margin * singlePageMult,
	};

	const sectionSpacing =
		(s?.layout.sectionSpacingPx ?? 12) * densityMult.spacing * singlePageMult;
	const lineSpacing = (s?.layout.lineSpacing ?? 1.4) * densityMult.lineHeight;
	const finalScale = scale * densityMult.fontSize * singlePageMult;
	const textAlign: PdfTextAlign =
		(s?.layout.textAlignment as PdfTextAlign) || "justify";

	const sectionTitleColor =
		s?.sections?.titleColor || getColorTheme(color).primary;
	const sectionTitleSize = (s?.sections?.titleFontSize ?? 12) * finalScale;
	const accent = getColorTheme(color).primary;
	const linkColor = s?.sections?.useThemeColorForLinks ? accent : hyperlinkBlue;

	return {
		margins,
		sectionSpacing,
		lineSpacing,
		finalScale,
		singlePageMult,
		densityMult,
		textAlign,
		fontFamily,
		sectionTitleColor,
		sectionTitleSize,
		accent,
		linkColor,
	};
}

export function getPhotoSize(aspectRatio?: "1:1" | "3:4" | "4:3"): {
	width: number;
	height: number;
} {
	const ar = aspectRatio || "1:1";
	if (ar === "1:1") return { width: 90, height: 90 };
	if (ar === "3:4") return { width: 90, height: 120 };
	if (ar === "4:3") return { width: 120, height: 90 };
	return { width: 90, height: 90 };
}

export function buildCommonStyles(
	metrics: ComputedMetrics,
	settings?: CvRenderSettings,
) {
	const { margins, lineSpacing, finalScale, fontFamily, singlePageMult } =
		metrics;

	return StyleSheet.create({
		page: {
			paddingTop: cmToPt(margins.top),
			paddingRight: cmToPt(margins.right),
			paddingBottom: cmToPt(margins.bottom),
			paddingLeft: cmToPt(margins.left),
			fontSize: 11 * finalScale,
			fontFamily,
			lineHeight: lineSpacing,
		},
		section: {
			marginBottom: metrics.sectionSpacing,
		},
		sectionTitle: {
			fontSize: metrics.sectionTitleSize,
			fontWeight: "bold",
			letterSpacing: 1.2,
			color: metrics.sectionTitleColor,
			marginBottom: 6 * singlePageMult,
		},
		name: {
			fontSize: (settings?.header.nameFontSize ?? 24) * finalScale,
			fontWeight:
				settings?.header.nameFontWeight === "heavy"
					? 800
					: settings?.header.nameFontWeight === "bold"
						? 700
						: 500,
			color: settings?.header.nameColor || "#000000",
			marginBottom: 8 * singlePageMult,
		},
		title: {
			fontSize: 12 * finalScale,
			color: "#000000",
			marginBottom: 6 * singlePageMult,
			...(settings?.header.titleStyle === "uppercase"
				? ({ textTransform: "uppercase" } as const)
				: {}),
			fontStyle: settings?.header.titleStyle === "italic" ? "italic" : "normal",
		},
		divider: {
			width: "100%",
			borderBottomWidth: (settings?.header.dividerThickness ?? 1) as number,
			borderBottomColor: "#e5e7eb",
			borderStyle: "solid",
			marginVertical: 6 * singlePageMult,
		},
		summaryText: {
			textAlign: metrics.textAlign,
			marginBottom: 4 * singlePageMult,
			fontSize: 10 * finalScale,
			color: "#000000",
		},
		expItem: {
			marginBottom: 8 * singlePageMult,
		},
		expHeaderRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
		},
		expLeft: {
			flexDirection: "column",
			flex: 1,
			paddingRight: 6,
		},
		expRight: {
			width: 100,
			textAlign: "right",
			color: "#000000",
			fontSize: 10 * finalScale,
		},
		jobRole: {
			fontSize: 11 * finalScale,
			fontWeight: "bold",
		},
		company: {
			fontSize: 10 * finalScale,
			color: "#000000",
			marginBottom: 4 * singlePageMult,
		},
		bullets: {
			marginLeft: 8,
			color: "#000000",
			fontSize: 10 * finalScale,
			textAlign: metrics.textAlign,
		},
		activitiesText: {
			marginLeft: 0,
			color: "#000000",
			fontSize: 10 * finalScale,
			textAlign: metrics.textAlign,
		},
	});
}

/**
 * The complete stylesheet the renderer draws with: the shared base above plus
 * the pieces the variant components need.
 *
 * There is one of these for the whole app — the variants pick which styles
 * they use, instead of each old template shipping its own sheet.
 */
/**
 * `textTransform: "none"` is not a value @react-pdf understands: it breaks the
 * text measurement (the string still paints, but lays out as zero width), so
 * the property has to be omitted rather than set to "none".
 */
function textTransform(transform: "none" | "uppercase") {
	return transform === "uppercase"
		? ({ textTransform: "uppercase" } as const)
		: {};
}

export function buildCvStyles(
	settings: CvRenderSettings | undefined,
	color: CvColor,
	style: CvStyleSettings,
) {
	const metrics = computeMetrics(settings, color);
	const base = buildCommonStyles(metrics, settings);
	const { finalScale, singlePageMult, accent, linkColor } = metrics;
	const ruleColor = "#e5e7eb";
	const photo = getPhotoSize(settings?.photo?.aspectRatio);
	const photoRadius = settings?.photo?.borderRadius ?? 1;
	const centered = style.header.align === "center";
	const ruleWidth = (settings?.header.dividerThickness ?? 1) as number;
	const dashed = settings?.header.dividerStyle === "dashed";

	const variantStyles = StyleSheet.create({
		/* ------------------------------------------------------------ header */
		header: {
			flexDirection: "column",
			marginBottom: 10 * singlePageMult,
		},
		headerRow: {
			flexDirection: "row",
			alignItems: centered ? "center" : "flex-start",
			justifyContent: "space-between",
			gap: 12,
		},
		headerMain: {
			flex: 1,
			alignItems: centered ? "center" : "flex-start",
		},
		headerText: {
			textAlign: centered ? "center" : "left",
		},
		contactWrap: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: centered ? "center" : "flex-start",
			alignItems: "center",
			color: "#000000",
			fontSize: 9 * finalScale,
			marginTop: 2,
		},
		contactStack: {
			flexDirection: "column",
			alignItems: centered ? "center" : "flex-start",
			color: "#000000",
			fontSize: 9 * finalScale,
			marginTop: 2,
		},
		contactItem: {
			flexDirection: "row",
			marginRight: 10,
			marginBottom: 3,
		},
		contactItemStacked: {
			flexDirection: "row",
			marginBottom: 2,
		},
		contactLabel: {
			fontWeight: "bold",
			marginRight: 4,
			color: "#000000",
		},
		contactSeparator: {
			marginRight: 8,
			marginBottom: 3,
			color: "#9ca3af",
		},
		linksWrap: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: centered ? "center" : "flex-start",
			marginTop: 3,
		},
		link: {
			fontSize: 9 * finalScale,
			color: linkColor,
			marginRight: 8,
			marginBottom: 2,
		},
		photoFrame: {
			width: photo.width,
			height: photo.height,
			borderRadius: photoRadius,
			overflow: "hidden",
			backgroundColor: "#f5f5f5",
		},
		photoImage: {
			width: photo.width,
			height: photo.height,
			objectFit: "cover",
		},
		headerDivider: {
			width: "100%",
			borderBottomWidth: ruleWidth,
			borderBottomColor: ruleColor,
			borderStyle: dashed ? "dashed" : "solid",
			marginTop: 8 * singlePageMult,
		},

		/* ------------------------------------------------------ section title */
		/**
		 * Heading text without `textAlign`.
		 *
		 * Setting `textAlign` makes a @react-pdf Text claim the full available
		 * width, which would leave no room for a rule beside it — so the
		 * inline-rule variant uses this style and the others use the aligned one
		 * below.
		 */
		titleText: {
			...base.sectionTitle,
			marginBottom: 0,
			...textTransform(style.sectionTitle.transform),
		},
		titleTextAligned: {
			...base.sectionTitle,
			marginBottom: 0,
			textAlign: style.sectionTitle.align === "center" ? "center" : "left",
			...textTransform(style.sectionTitle.transform),
		},
		titlePlain: {
			marginBottom: 6 * singlePageMult,
		},
		titleRuled: {
			marginBottom: 8 * singlePageMult,
			paddingBottom: 4 * singlePageMult,
			borderBottomWidth: ruleWidth,
			borderBottomColor: ruleColor,
			borderStyle: dashed ? "dashed" : "solid",
		},
		titleInlineRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 8 * singlePageMult,
		},
		titleInlineRule: {
			height: ruleWidth,
			backgroundColor: ruleColor,
			flex: 1,
			marginLeft: 8,
		},
		titleBlock: {
			marginBottom: 8 * singlePageMult,
			paddingVertical: 3 * singlePageMult,
			paddingHorizontal: 6,
			backgroundColor: getColorTheme(color).accent,
			borderRadius: 2,
		},

		/* -------------------------------------------------------- entry frames */
		entryPlain: {
			marginBottom: 8 * singlePageMult,
		},
		entryCard: {
			marginBottom: 10 * singlePageMult,
			paddingLeft: 8,
			borderLeftWidth: 2,
			borderLeftColor: accent,
		},
		timelineRail: {
			paddingLeft: 18,
			marginLeft: 8,
			borderLeftWidth: 1,
			borderLeftColor: ruleColor,
		},
		timelineItem: {
			position: "relative",
			paddingLeft: 8,
			marginBottom: 12 * singlePageMult,
		},
		timelineBullet: {
			position: "absolute",
			width: 10,
			height: 10,
			borderRadius: 5,
			borderWidth: 2,
			borderColor: accent,
			backgroundColor: "#ffffff",
			left: -23.5,
			top: 0,
		},

		/* ------------------------------------------------------------- entries */
		entryDateBelow: {
			fontSize: 9 * finalScale,
			color: "#4b5563",
			marginBottom: 3 * singlePageMult,
		},

		/* ----------------------------------------------------------- languages */
		langInlineWrap: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent:
				style.sectionTitle.align === "center" ? "center" : "flex-start",
		},
		langInlineItem: {
			marginRight: 12,
			fontSize: 10 * finalScale,
			color: "#000000",
		},
		langRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			marginBottom: 5 * singlePageMult,
			paddingBottom: 3 * singlePageMult,
			borderBottomWidth: 0.5,
			borderBottomColor: ruleColor,
		},
		langLeaderRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 4 * singlePageMult,
		},
		langLeaderRule: {
			flex: 1,
			height: ruleWidth,
			backgroundColor: ruleColor,
			marginHorizontal: 6,
		},
		langName: {
			fontSize: 10 * finalScale,
			fontWeight: "bold",
			color: "#000000",
		},
		langLevel: {
			fontSize: 9 * finalScale,
			color: "#6b7280",
			textTransform: "uppercase",
		},

		/* -------------------------------------------------------------- skills */
		skillsCentered: {
			...base.summaryText,
			textAlign: "center",
		},
	});

	return {
		...base,
		...variantStyles,
		_finalScale: finalScale,
		_singlePageMult: singlePageMult,
		_accent: accent,
		linkColor,
	};
}

export type CvStyleSheet = ReturnType<typeof buildCvStyles>;
