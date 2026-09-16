// Utility functions to serialize and deserialize CvData to/from XML.
// Browser imports use DOMParser; Node tests use the small fallback parser below.

import type {
	Certification,
	CustomSection,
	CvData,
	CvRenderSettings,
	CvStyleSettings,
	Education,
	EntryVariant,
	Experience,
	Language,
	Link,
	Project,
	SectionKey,
	StyledSectionKey,
	Volunteer,
} from "../types/cv";
import { STYLED_SECTION_KEYS } from "../types/cv";
import { DEFAULT_COUNTRY_CODE, DEFAULT_RENDER_SETTINGS } from "./cv-data";
import { DEFAULT_CV_STYLE } from "./style-presets";

export const CV_XML_VERSION = "2";

type XmlElementLike = {
	textContent: string | null;
	getElementsByTagName: (tag: string) => ArrayLike<XmlElementLike>;
	getAttribute?: (name: string) => string | null;
};

class SimpleXmlElement implements XmlElementLike {
	children: SimpleXmlElement[] = [];
	private textParts: string[] = [];

	constructor(
		private readonly tagName: string,
		private readonly attributes: Record<string, string> = {},
	) {}

	get textContent(): string {
		return [
			...this.textParts,
			...this.children.map((child) => child.textContent),
		].join("");
	}

	appendText(text: string) {
		this.textParts.push(text);
	}

	getAttribute(name: string): string | null {
		return this.attributes[name] ?? null;
	}

	getElementsByTagName(tag: string): SimpleXmlElement[] {
		const matches: SimpleXmlElement[] = [];
		const visit = (node: SimpleXmlElement) => {
			for (const child of node.children) {
				if (child.tagName === tag) matches.push(child);
				visit(child);
			}
		};
		visit(this);
		return matches;
	}
}

const generateId = () => {
	if (
		typeof crypto !== "undefined" &&
		"randomUUID" in crypto &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}
	return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
};

function escapeXml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function decodeXml(s: string): string {
	return s
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&amp;/g, "&");
}

function el(
	name: string,
	value: string | number | boolean | undefined | null,
): string {
	const safe = value ?? "";
	return `<${name}>${escapeXml(String(safe))}</${name}>`;
}

function optionalEl(
	name: string,
	value: string | number | boolean | undefined | null,
): string {
	return value === undefined ? "" : el(name, value);
}

function arr(name: string, itemsXml: string): string {
	return `<${name}>${itemsXml}</${name}>`;
}

function parseSimpleXml(xml: string): SimpleXmlElement {
	const root = new SimpleXmlElement("__root__");
	const stack = [root];
	const tokenRegex = /<([^>]+)>|([^<]+)/g;
	let match: RegExpExecArray | null = tokenRegex.exec(xml);

	while (match) {
		const [, tagToken, textToken] = match;

		if (textToken !== undefined) {
			stack[stack.length - 1]?.appendText(decodeXml(textToken));
			match = tokenRegex.exec(xml);
			continue;
		}

		const rawTag = tagToken.trim();
		if (
			rawTag.startsWith("?") ||
			rawTag.startsWith("!") ||
			rawTag.startsWith("!--")
		) {
			match = tokenRegex.exec(xml);
			continue;
		}

		if (rawTag.startsWith("/")) {
			if (stack.length > 1) stack.pop();
			match = tokenRegex.exec(xml);
			continue;
		}

		const selfClosing = rawTag.endsWith("/");
		const tagContent = selfClosing ? rawTag.slice(0, -1).trim() : rawTag;
		const nameMatch = tagContent.match(/^([^\s/>]+)/);
		const name = nameMatch?.[1];
		if (!name) {
			match = tokenRegex.exec(xml);
			continue;
		}

		const attributes: Record<string, string> = {};
		const attrRegex = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
		let attrMatch: RegExpExecArray | null = attrRegex.exec(tagContent);
		while (attrMatch) {
			attributes[attrMatch[1]] = decodeXml(attrMatch[2] ?? attrMatch[3] ?? "");
			attrMatch = attrRegex.exec(tagContent);
		}

		const node = new SimpleXmlElement(name, attributes);
		stack[stack.length - 1]?.children.push(node);
		if (!selfClosing) stack.push(node);
		match = tokenRegex.exec(xml);
	}

	return root;
}

function parseXml(xml: string): XmlElementLike {
	if (typeof DOMParser !== "undefined") {
		const parser = new DOMParser();
		const doc = parser.parseFromString(xml, "application/xml");
		const parserError = doc.getElementsByTagName("parsererror")[0];
		if (parserError) {
			throw new Error("Invalid XML");
		}
		const cvEl = doc.getElementsByTagName("cv")[0];
		if (!cvEl) throw new Error("Missing <cv> root");
		return cvEl;
	}

	const parsed = parseSimpleXml(xml);
	const cvEl = parsed.getElementsByTagName("cv")[0];
	if (!cvEl) throw new Error("Missing <cv> root");
	return cvEl;
}

function firstElement(
	parent: XmlElementLike | null | undefined,
	tag: string,
): XmlElementLike | null {
	return parent?.getElementsByTagName(tag)[0] ?? null;
}

function textContent(parent: XmlElementLike | null | undefined, tag: string) {
	return firstElement(parent, tag)?.textContent ?? "";
}

function optionalText(
	parent: XmlElementLike | null | undefined,
	tag: string,
	preserveEmpty = false,
) {
	const element = firstElement(parent, tag);
	if (!element) return undefined;
	const value = element.textContent ?? "";
	return value === "" && !preserveEmpty ? undefined : value;
}

function booleanContent(
	parent: XmlElementLike | null | undefined,
	tag: string,
	fallback = false,
) {
	const value = textContent(parent, tag);
	if (value === "") return fallback;
	return value === "true";
}

function optionalBoolean(
	parent: XmlElementLike | null | undefined,
	tag: string,
) {
	const value = textContent(parent, tag);
	if (value === "") return undefined;
	return value === "true";
}

function numberContent(
	parent: XmlElementLike | null | undefined,
	tag: string,
	fallback: number,
) {
	const value = Number(textContent(parent, tag));
	return Number.isFinite(value) ? value : fallback;
}

function optionalNumber(
	parent: XmlElementLike | null | undefined,
	tag: string,
) {
	const raw = textContent(parent, tag);
	if (raw === "") return undefined;
	const value = Number(raw);
	return Number.isFinite(value) ? value : undefined;
}

/**
 * Tag names for the per-section entry variants.
 *
 * Every tag inside <presentation> is deliberately unique across the whole
 * document: element lookups here search descendants, so a tag that also exists
 * elsewhere in the CV (e.g. "projects") would be ambiguous.
 */
const ENTRY_VARIANT_TAGS: Record<StyledSectionKey, string> = {
	professional_experience: "experienceEntries",
	academic_education: "educationEntries",
	certifications: "certificationEntries",
	projects: "projectEntries",
	volunteer: "volunteerEntries",
	custom: "customEntries",
};

function styleToXml(style?: CvStyleSettings): string {
	if (!style) return "";

	const entries = STYLED_SECTION_KEYS.map((key) =>
		el(ENTRY_VARIANT_TAGS[key], style.entries[key]),
	).join("\n        ");

	// Only written when some custom section has a style of its own, so CVs
	// without one keep exporting exactly as before.
	const customStyles = Object.entries(style.customSectionEntries ?? {});
	const customStylesXml = customStyles.length
		? `<customSectionStyles>
        ${customStyles
					.map(
						([sectionId, variant]) => `<customSectionStyle>
          ${el("styledSectionId", sectionId)}
          ${el("styledSectionVariant", variant)}
        </customSectionStyle>`,
					)
					.join("\n        ")}
      </customSectionStyles>`
		: "";

	return `<presentation>
      ${el("titleVariant", style.sectionTitle.variant)}
      ${el("titleAlign", style.sectionTitle.align)}
      ${el("titleTransform", style.sectionTitle.transform)}
      ${el("headerAlign", style.header.align)}
      ${el("headerContact", style.header.contact)}
      ${el("headerDivider", style.header.divider)}
      ${el("datePlacement", style.datePlacement)}
      ${el("bulletVariant", style.bullets)}
      ${el("languagesVariant", style.languages)}
      ${el("skillsVariant", style.skills)}
      <entryVariants>
        ${entries}
      </entryVariants>
      ${customStylesXml}
    </presentation>`;
}

function settingsToXml(settings?: CvRenderSettings): string {
	if (!settings) return "";
	const customFontXml = settings.layout.customFont
		? `<customFont>
      ${el("name", settings.layout.customFont.name)}
      ${el("dataUrl", settings.layout.customFont.dataUrl)}
      ${el("style", settings.layout.customFont.style || "")}
    </customFont>`
		: "";
	const cropXml = settings.photo.crop
		? `<crop>
      ${el("x", settings.photo.crop.x)}
      ${el("y", settings.photo.crop.y)}
      ${el("width", settings.photo.crop.width)}
      ${el("height", settings.photo.crop.height)}
    </crop>`
		: "";

	return `<settings>
    <layout>
      ${el("fontFamily", settings.layout.fontFamily)}
      ${customFontXml}
      ${el("textScale", settings.layout.textScale)}
      <marginsCm>
        ${el("top", settings.layout.marginsCm.top)}
        ${el("right", settings.layout.marginsCm.right)}
        ${el("bottom", settings.layout.marginsCm.bottom)}
        ${el("left", settings.layout.marginsCm.left)}
      </marginsCm>
      ${el("lineSpacing", settings.layout.lineSpacing)}
      ${el("sectionSpacingPx", settings.layout.sectionSpacingPx)}
      ${el("columns", settings.layout.columns)}
      ${el("atsSafe", settings.layout.atsSafe)}
      ${el("density", settings.layout.density || "")}
      ${el("textAlignment", settings.layout.textAlignment || "")}
      ${el("singlePageMode", Boolean(settings.layout.singlePageMode))}
    </layout>
    <header>
      ${el("nameFontSize", settings.header.nameFontSize)}
      ${el("nameFontWeight", settings.header.nameFontWeight)}
      ${el("nameColor", settings.header.nameColor)}
      ${el("titleStyle", settings.header.titleStyle)}
      ${el("titlePosition", settings.header.titlePosition)}
      ${el("dividerThickness", settings.header.dividerThickness)}
      ${el("dividerStyle", settings.header.dividerStyle)}
      ${el("iconSizePx", settings.header.iconSizePx)}
      ${el("iconSpacingPx", settings.header.iconSpacingPx)}
      ${el("iconAlignment", settings.header.iconAlignment)}
    </header>
    <photo>
      ${el("enabled", settings.photo.enabled)}
      ${el("aspectRatio", settings.photo.aspectRatio)}
      ${el("borderRadius", settings.photo.borderRadius ?? "")}
      ${cropXml}
      ${el("dataUrl", settings.photo.dataUrl || "")}
    </photo>
    ${styleToXml(settings.style)}
    <sections>
      ${el("titleColor", settings.sections.titleColor)}
      ${el("titleFontSize", settings.sections.titleFontSize)}
      ${el("dateFormat", settings.sections.dateFormat)}
      ${el("useThemeColorForLinks", Boolean(settings.sections.useThemeColorForLinks))}
    </sections>
  </settings>`;
}

/**
 * Reads the modular presentation block. Returns undefined for CVs exported
 * before the modular system existed; `resolveStyle()` then migrates those from
 * the legacy `template` name.
 */
function parseStyle(settingsEl: XmlElementLike): CvStyleSettings | undefined {
	const el = firstElement(settingsEl, "presentation");
	if (!el) return undefined;

	const defaults = DEFAULT_CV_STYLE;
	const entriesEl = firstElement(el, "entryVariants");

	const pick = <T extends string>(
		parent: XmlElementLike | null,
		tag: string,
		fallback: T,
	): T => (optionalText(parent ?? undefined, tag) as T) || fallback;

	const entries = Object.fromEntries(
		STYLED_SECTION_KEYS.map((key) => [
			key,
			pick(entriesEl, ENTRY_VARIANT_TAGS[key], defaults.entries[key]),
		]),
	) as CvStyleSettings["entries"];

	const customSectionEntries = Object.fromEntries(
		Array.from(
			firstElement(el, "customSectionStyles")?.getElementsByTagName(
				"customSectionStyle",
			) ?? [],
		)
			.map((item) => [
				textContent(item, "styledSectionId"),
				textContent(item, "styledSectionVariant") as EntryVariant,
			])
			.filter(([sectionId, variant]) => sectionId && variant),
	) as Record<string, EntryVariant>;

	return {
		sectionTitle: {
			variant: pick(el, "titleVariant", defaults.sectionTitle.variant),
			align: pick(el, "titleAlign", defaults.sectionTitle.align),
			transform: pick(el, "titleTransform", defaults.sectionTitle.transform),
		},
		header: {
			align: pick(el, "headerAlign", defaults.header.align),
			contact: pick(el, "headerContact", defaults.header.contact),
			divider: booleanContent(el, "headerDivider", defaults.header.divider),
		},
		datePlacement: pick(el, "datePlacement", defaults.datePlacement),
		bullets: pick(el, "bulletVariant", defaults.bullets),
		languages: pick(el, "languagesVariant", defaults.languages),
		skills: pick(el, "skillsVariant", defaults.skills),
		entries,
		...(Object.keys(customSectionEntries).length > 0
			? { customSectionEntries }
			: {}),
	};
}

function parseSettings(cvEl: XmlElementLike): CvRenderSettings | undefined {
	const settingsEl = firstElement(cvEl, "settings");
	if (!settingsEl) return undefined;

	const layoutEl = firstElement(settingsEl, "layout");
	const marginsEl = firstElement(layoutEl, "marginsCm");
	const customFontEl = firstElement(layoutEl, "customFont");
	const headerEl = firstElement(settingsEl, "header");
	const photoEl = firstElement(settingsEl, "photo");
	const cropEl = firstElement(photoEl, "crop");
	const sectionsEl = firstElement(settingsEl, "sections");
	const defaults = DEFAULT_RENDER_SETTINGS;
	const style = parseStyle(settingsEl);

	const customFont = customFontEl
		? {
				name: textContent(customFontEl, "name"),
				dataUrl: textContent(customFontEl, "dataUrl"),
				...(optionalText(customFontEl, "style")
					? {
							style: optionalText(customFontEl, "style") as
								| "normal"
								| "bold"
								| "italic"
								| "boldItalic",
						}
					: {}),
			}
		: null;
	const borderRadius = optionalNumber(photoEl, "borderRadius");
	const photoCrop = cropEl
		? {
				x: numberContent(cropEl, "x", 0),
				y: numberContent(cropEl, "y", 0),
				width: numberContent(cropEl, "width", 0),
				height: numberContent(cropEl, "height", 0),
			}
		: null;

	return {
		layout: {
			fontFamily: (textContent(layoutEl, "fontFamily") ||
				defaults.layout.fontFamily) as CvRenderSettings["layout"]["fontFamily"],
			customFont,
			textScale: numberContent(
				layoutEl,
				"textScale",
				defaults.layout.textScale,
			),
			marginsCm: {
				top: numberContent(marginsEl, "top", defaults.layout.marginsCm.top),
				right: numberContent(
					marginsEl,
					"right",
					defaults.layout.marginsCm.right,
				),
				bottom: numberContent(
					marginsEl,
					"bottom",
					defaults.layout.marginsCm.bottom,
				),
				left: numberContent(marginsEl, "left", defaults.layout.marginsCm.left),
			},
			lineSpacing: numberContent(
				layoutEl,
				"lineSpacing",
				defaults.layout.lineSpacing,
			),
			sectionSpacingPx: numberContent(
				layoutEl,
				"sectionSpacingPx",
				defaults.layout.sectionSpacingPx,
			),
			columns: numberContent(layoutEl, "columns", defaults.layout.columns) as
				| 1
				| 2
				| 3,
			atsSafe: booleanContent(layoutEl, "atsSafe", defaults.layout.atsSafe),
			density: (optionalText(layoutEl, "density") ||
				defaults.layout.density) as CvRenderSettings["layout"]["density"],
			textAlignment: (optionalText(layoutEl, "textAlignment") ||
				defaults.layout
					.textAlignment) as CvRenderSettings["layout"]["textAlignment"],
			singlePageMode: booleanContent(
				layoutEl,
				"singlePageMode",
				Boolean(defaults.layout.singlePageMode),
			),
		},
		header: {
			nameFontSize: numberContent(
				headerEl,
				"nameFontSize",
				defaults.header.nameFontSize,
			),
			nameFontWeight: (textContent(headerEl, "nameFontWeight") ||
				defaults.header
					.nameFontWeight) as CvRenderSettings["header"]["nameFontWeight"],
			nameColor:
				textContent(headerEl, "nameColor") || defaults.header.nameColor,
			titleStyle: (textContent(headerEl, "titleStyle") ||
				defaults.header.titleStyle) as CvRenderSettings["header"]["titleStyle"],
			titlePosition: (textContent(headerEl, "titlePosition") ||
				defaults.header
					.titlePosition) as CvRenderSettings["header"]["titlePosition"],
			dividerThickness: numberContent(
				headerEl,
				"dividerThickness",
				defaults.header.dividerThickness,
			) as 1 | 2 | 3,
			dividerStyle: (textContent(headerEl, "dividerStyle") ||
				defaults.header
					.dividerStyle) as CvRenderSettings["header"]["dividerStyle"],
			iconSizePx: numberContent(
				headerEl,
				"iconSizePx",
				defaults.header.iconSizePx,
			) as 16 | 18 | 20 | 22 | 24,
			iconSpacingPx: numberContent(
				headerEl,
				"iconSpacingPx",
				defaults.header.iconSpacingPx,
			) as 5 | 7 | 9 | 11 | 13 | 15,
			iconAlignment: (textContent(headerEl, "iconAlignment") ||
				defaults.header
					.iconAlignment) as CvRenderSettings["header"]["iconAlignment"],
		},
		photo: {
			enabled: booleanContent(photoEl, "enabled", defaults.photo.enabled),
			aspectRatio: (textContent(photoEl, "aspectRatio") ||
				defaults.photo.aspectRatio) as CvRenderSettings["photo"]["aspectRatio"],
			...(borderRadius !== undefined ? { borderRadius } : {}),
			crop: photoCrop,
			dataUrl: optionalText(photoEl, "dataUrl") || null,
		},
		sections: {
			titleColor:
				textContent(sectionsEl, "titleColor") || defaults.sections.titleColor,
			titleFontSize: numberContent(
				sectionsEl,
				"titleFontSize",
				defaults.sections.titleFontSize,
			),
			dateFormat: (textContent(sectionsEl, "dateFormat") ||
				defaults.sections
					.dateFormat) as CvRenderSettings["sections"]["dateFormat"],
			useThemeColorForLinks: booleanContent(
				sectionsEl,
				"useThemeColorForLinks",
				Boolean(defaults.sections.useThemeColorForLinks),
			),
		},
		...(style ? { style } : {}),
	};
}

export function cvDataToXml(data: CvData): string {
	const linksXml = (data.links || [])
		.map(
			(l: Link) =>
				`<link>${el("type", l.type)}${el("value", l.value)}${optionalEl("customName", l.customName)}${optionalEl("hideLinkLabel", l.hideLinkLabel)}</link>`,
		)
		.join("");

	const experiencesXml = (data.experiences || [])
		.map(
			(e: Experience) => `<experience>
      ${el("role", e.role)}
      ${el("company", e.company)}
      ${el("startMonth", e.startMonth)}
      ${el("startYear", e.startYear)}
      ${el("endMonth", e.endMonth)}
      ${el("endYear", e.endYear)}
      ${el("current", e.current)}
      ${el("tech", e.tech)}
      ${el("activities", e.activities)}
      ${el("results", e.results)}
    </experience>`,
		)
		.join("");

	const educationXml = (data.education || [])
		.map(
			(e: Education) => `<education>
      ${el("type", e.type)}
      ${el("status", e.status)}
      ${el("course", e.course)}
      ${el("institution", e.institution)}
      ${el("startMonth", e.startMonth)}
      ${el("startYear", e.startYear)}
      ${el("endMonth", e.endMonth)}
      ${el("endYear", e.endYear)}
      ${optionalEl("current", e.current)}
      ${el("description", e.description)}
      ${el("achievements", e.achievements || "")}
    </education>`,
		)
		.join("");

	const languagesXml = (data.languages || [])
		.map(
			(l: Language) =>
				`<language>${el("name", l.name)}${el("level", l.level)}</language>`,
		)
		.join("");

	const certificationsXml = (data.certifications || [])
		.map(
			(c: Certification) => `<certification>
      ${el("name", c.name)}
      ${el("issuer", c.issuer)}
      ${el("completionDate", c.completionDate)}
      ${el("hours", c.hours)}
      ${el("validationLink", c.validationLink)}
      ${el("description", c.description)}
    </certification>`,
		)
		.join("");

	const projectsXml = (data.projects || [])
		.map(
			(p: Project) => `<project>
      ${el("name", p.name)}
      ${el("description", p.description)}
      ${el("link", p.link)}
      ${optionalEl("sourceCode", p.sourceCode)}
      ${el("tech", p.tech)}
      ${el("year", p.year)}
      ${el("impact", p.impact || "")}
    </project>`,
		)
		.join("");

	const volunteersXml = (data.volunteers || [])
		.map(
			(v: Volunteer) => `<volunteer>
      ${el("organization", v.organization)}
      ${el("role", v.role)}
      ${el("startMonth", v.startMonth)}
      ${el("startYear", v.startYear)}
      ${el("endMonth", v.endMonth)}
      ${el("endYear", v.endYear)}
      ${el("current", v.current)}
      ${el("description", v.description)}
      ${el("impact", v.impact)}
    </volunteer>`,
		)
		.join("");

	const customSectionsXml = (data.customSections || [])
		.map(
			(cs: CustomSection) => `<customSection>
      ${el("id", cs.id)}
      ${el("title", cs.title)}
      ${arr(
				"fields",
				(cs.fields || [])
					.map(
						(f) => `<field>
        ${el("id", f.id)}
        ${el("label", f.label)}
        ${optionalEl("subtitle", f.subtitle)}
        ${el("value", f.value)}
        ${optionalEl("bullets", f.bullets)}
        ${optionalEl("startMonth", f.startMonth)}
        ${optionalEl("startYear", f.startYear)}
        ${optionalEl("endMonth", f.endMonth)}
        ${optionalEl("endYear", f.endYear)}
        ${optionalEl("current", f.current)}
        ${optionalEl("centerValue", f.centerValue)}
      </field>`,
					)
					.join(""),
			)}
    </customSection>`,
		)
		.join("");

	const sectionOrderXml = (data.sectionOrder || [])
		.map((key: SectionKey) => el("section", key))
		.join("");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cv version="${CV_XML_VERSION}">
  <personalInfo>
    ${el("name", data.personalInfo?.name)}
    ${el("desiredRole", data.personalInfo?.desiredRole)}
    ${el("city", data.personalInfo?.city)}
    ${el("postalCode", data.personalInfo?.postalCode)}
    ${el("email", data.personalInfo?.email)}
    ${el("countryCode", data.personalInfo?.countryCode)}
    ${el("phone", data.personalInfo?.phone)}
  </personalInfo>
  ${arr("links", linksXml)}
  ${el("resume", data.resume || "")}
  ${arr("experiences", experiencesXml)}
  ${arr("educations", educationXml)}
  ${el("skills", data.skills || "")}
  ${arr("languages", languagesXml)}
  ${arr("certifications", certificationsXml)}
  ${arr("projects", projectsXml)}
  ${arr("volunteers", volunteersXml)}
  ${arr("customSections", customSectionsXml)}
  ${arr("sectionOrder", sectionOrderXml)}
  ${el("template", data.template || "")}
  ${el("color", data.color || "")}
  ${settingsToXml(data.settings)}
</cv>`;
	return xml;
}

export function xmlToCvData(xml: string): CvData {
	const cvEl = parseXml(xml);
	const xmlVersion = cvEl.getAttribute?.("version") || "1";
	const preserveEmptyOptionalFields = xmlVersion !== "1";
	if (xmlVersion && xmlVersion !== "1") {
		// v2 is parsed structurally below. Future versions can branch here.
	}

	const personalInfoEl = firstElement(cvEl, "personalInfo");
	const personalInfo = {
		name: textContent(personalInfoEl, "name"),
		desiredRole: textContent(personalInfoEl, "desiredRole"),
		city: textContent(personalInfoEl, "city"),
		postalCode: textContent(personalInfoEl, "postalCode"),
		email: textContent(personalInfoEl, "email"),
		countryCode:
			textContent(personalInfoEl, "countryCode") || DEFAULT_COUNTRY_CODE,
		phone: textContent(personalInfoEl, "phone"),
	};

	const links: Link[] = Array.from(
		firstElement(cvEl, "links")?.getElementsByTagName("link") || [],
	).map((ln) => {
		const customName = optionalText(
			ln,
			"customName",
			preserveEmptyOptionalFields,
		);
		const hideLinkLabel = optionalBoolean(ln, "hideLinkLabel");
		return {
			type: textContent(ln, "type"),
			value: textContent(ln, "value"),
			...(customName !== undefined ? { customName } : {}),
			...(hideLinkLabel !== undefined ? { hideLinkLabel } : {}),
		};
	});

	const experiences: Experience[] = Array.from(
		firstElement(cvEl, "experiences")?.getElementsByTagName("experience") || [],
	).map((ex) => ({
		role: textContent(ex, "role"),
		company: textContent(ex, "company"),
		startMonth: textContent(ex, "startMonth"),
		startYear: textContent(ex, "startYear"),
		endMonth: textContent(ex, "endMonth"),
		endYear: textContent(ex, "endYear"),
		current: textContent(ex, "current") === "true",
		tech: textContent(ex, "tech"),
		activities: textContent(ex, "activities"),
		results: textContent(ex, "results"),
	}));

	const education: Education[] = Array.from(
		firstElement(cvEl, "educations")?.getElementsByTagName("education") || [],
	).map((ed) => {
		const current = optionalBoolean(ed, "current");
		return {
			type: textContent(ed, "type"),
			status: textContent(ed, "status"),
			course: textContent(ed, "course"),
			institution: textContent(ed, "institution"),
			startMonth: textContent(ed, "startMonth"),
			startYear: textContent(ed, "startYear"),
			endMonth: textContent(ed, "endMonth"),
			endYear: textContent(ed, "endYear"),
			...(current !== undefined ? { current } : {}),
			description: textContent(ed, "description"),
			achievements: textContent(ed, "achievements") || "",
		};
	});

	const languages: Language[] = Array.from(
		firstElement(cvEl, "languages")?.getElementsByTagName("language") || [],
	).map((lg) => ({
		name: textContent(lg, "name"),
		level: textContent(lg, "level"),
	}));

	const certifications: Certification[] = Array.from(
		firstElement(cvEl, "certifications")?.getElementsByTagName(
			"certification",
		) || [],
	).map((ce) => ({
		name: textContent(ce, "name"),
		issuer: textContent(ce, "issuer"),
		completionDate: textContent(ce, "completionDate"),
		hours: textContent(ce, "hours"),
		validationLink: textContent(ce, "validationLink"),
		description: textContent(ce, "description"),
	}));

	const projects: Project[] = Array.from(
		firstElement(cvEl, "projects")?.getElementsByTagName("project") || [],
	).map((pr) => {
		const sourceCode = optionalText(
			pr,
			"sourceCode",
			preserveEmptyOptionalFields,
		);
		return {
			name: textContent(pr, "name"),
			description: textContent(pr, "description"),
			link: textContent(pr, "link"),
			...(sourceCode !== undefined ? { sourceCode } : {}),
			tech: textContent(pr, "tech"),
			year: textContent(pr, "year"),
			impact: textContent(pr, "impact") || "",
		};
	});

	const volunteers: Volunteer[] = Array.from(
		firstElement(cvEl, "volunteers")?.getElementsByTagName("volunteer") || [],
	).map((vo) => ({
		organization: textContent(vo, "organization"),
		role: textContent(vo, "role"),
		startMonth: textContent(vo, "startMonth"),
		startYear: textContent(vo, "startYear"),
		endMonth: textContent(vo, "endMonth"),
		endYear: textContent(vo, "endYear"),
		current: textContent(vo, "current") === "true",
		description: textContent(vo, "description"),
		impact: textContent(vo, "impact"),
	}));

	const customSections: CustomSection[] = Array.from(
		firstElement(cvEl, "customSections")?.getElementsByTagName(
			"customSection",
		) || [],
	).map((sec) => {
		const fieldsParent = firstElement(sec, "fields");
		const fields = Array.from(
			fieldsParent?.getElementsByTagName("field") || [],
		).map((fd) => {
			const subtitle = optionalText(
				fd,
				"subtitle",
				preserveEmptyOptionalFields,
			);
			const bullets = optionalText(fd, "bullets", preserveEmptyOptionalFields);
			const startMonth = optionalText(
				fd,
				"startMonth",
				preserveEmptyOptionalFields,
			);
			const startYear = optionalText(
				fd,
				"startYear",
				preserveEmptyOptionalFields,
			);
			const endMonth = optionalText(
				fd,
				"endMonth",
				preserveEmptyOptionalFields,
			);
			const endYear = optionalText(fd, "endYear", preserveEmptyOptionalFields);
			const current = optionalBoolean(fd, "current");
			const centerValue = optionalBoolean(fd, "centerValue");

			return {
				id: textContent(fd, "id") || generateId(),
				label: textContent(fd, "label"),
				...(subtitle !== undefined ? { subtitle } : {}),
				value: textContent(fd, "value"),
				...(bullets !== undefined ? { bullets } : {}),
				...(startMonth !== undefined ? { startMonth } : {}),
				...(startYear !== undefined ? { startYear } : {}),
				...(endMonth !== undefined ? { endMonth } : {}),
				...(endYear !== undefined ? { endYear } : {}),
				...(current !== undefined ? { current } : {}),
				...(centerValue !== undefined ? { centerValue } : {}),
			};
		});

		return {
			id: textContent(sec, "id") || generateId(),
			title: textContent(sec, "title"),
			fields,
		};
	});

	const sectionOrder = Array.from(
		firstElement(cvEl, "sectionOrder")?.getElementsByTagName("section") || [],
	)
		.map((node) => (node.textContent || "").trim())
		.filter(Boolean) as SectionKey[];

	const resume = textContent(cvEl, "resume");
	const skills = textContent(cvEl, "skills");
	const template = textContent(cvEl, "template") as CvData["template"];
	const color = textContent(cvEl, "color") as CvData["color"];
	const settings = parseSettings(cvEl);

	return {
		personalInfo,
		links,
		resume,
		experiences,
		education,
		skills,
		languages,
		certifications,
		projects,
		volunteers,
		customSections,
		sectionOrder,
		template,
		color,
		settings,
	};
}
