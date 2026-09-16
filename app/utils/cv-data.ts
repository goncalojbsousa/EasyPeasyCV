import type {
	Certification,
	CustomField,
	CustomSection,
	CvColor,
	CvData,
	CvRenderSettings,
	CvTemplate,
	Education,
	Experience,
	Language,
	PersonalInfo,
	Project,
	SectionKey,
	Volunteer,
} from "../types/cv";

import { DEFAULT_CV_STYLE } from "./style-presets";

export const DEFAULT_COUNTRY_CODE = "Portugal (+351)";
export const DEFAULT_TEMPLATE: CvTemplate = "professional";
export const DEFAULT_COLOR: CvColor = "blue";

export const DEFAULT_PREDEFINED_SECTION_ORDER: SectionKey[] = [
	"professional_summary",
	"professional_experience",
	"academic_education",
	"technical_skills",
	"languages",
	"certifications",
	"projects",
	"volunteer",
];

export const DEFAULT_RENDER_SETTINGS: CvRenderSettings = {
	layout: {
		fontFamily: "Helvetica",
		customFont: null,
		textScale: 1.0,
		marginsCm: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
		lineSpacing: 1.4,
		sectionSpacingPx: 12,
		columns: 1,
		atsSafe: false,
		density: "normal",
		textAlignment: "justify",
		singlePageMode: false,
	},
	header: {
		nameFontSize: 22,
		nameFontWeight: "bold",
		nameColor: "#000000",
		titleStyle: "normal",
		titlePosition: "below",
		dividerThickness: 1,
		dividerStyle: "solid",
		iconSizePx: 18,
		iconSpacingPx: 9,
		iconAlignment: "left",
	},
	photo: {
		enabled: false,
		aspectRatio: "1:1",
		crop: null,
		dataUrl: null,
	},
	sections: {
		titleColor: "#000000",
		titleFontSize: 12,
		dateFormat: "medium",
		useThemeColorForLinks: false,
	},
	style: DEFAULT_CV_STYLE,
};

export const EMPTY_PERSONAL_INFO: PersonalInfo = {
	name: "",
	desiredRole: "",
	city: "",
	postalCode: "",
	email: "",
	countryCode: DEFAULT_COUNTRY_CODE,
	phone: "",
};

function hasText(value: string | undefined | null): boolean {
	return (value || "").trim() !== "";
}

function deepEqual(a: unknown, b: unknown): boolean {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function hasPersonalInfoContent(personalInfo?: PersonalInfo): boolean {
	if (!personalInfo) return false;
	return (
		hasText(personalInfo.name) ||
		hasText(personalInfo.desiredRole) ||
		hasText(personalInfo.city) ||
		hasText(personalInfo.postalCode) ||
		hasText(personalInfo.email) ||
		hasText(personalInfo.phone) ||
		(personalInfo.countryCode || DEFAULT_COUNTRY_CODE) !== DEFAULT_COUNTRY_CODE
	);
}

function hasCustomSectionContent(data: CvData): boolean {
	return (data.customSections || []).some((section) => {
		if (hasText(section.title)) return true;
		if ((section.fields || []).length === 0) return false;
		return section.fields.some(
			(field) =>
				hasText(field.label) ||
				hasText(field.subtitle) ||
				hasText(field.value) ||
				hasText(field.bullets) ||
				hasText(field.startMonth) ||
				hasText(field.startYear) ||
				hasText(field.endMonth) ||
				hasText(field.endYear) ||
				Boolean(field.current) ||
				Boolean(field.centerValue),
		);
	});
}

export function hasCvContent(data: CvData): boolean {
	return (
		hasPersonalInfoContent(data.personalInfo) ||
		hasText(data.resume) ||
		(data.links || []).length > 0 ||
		(data.experiences || []).length > 0 ||
		(data.education || []).length > 0 ||
		hasText(data.skills) ||
		(data.languages || []).length > 0 ||
		(data.certifications || []).length > 0 ||
		(data.projects || []).length > 0 ||
		(data.volunteers || []).length > 0 ||
		hasCustomSectionContent(data)
	);
}

export function hasCvConfigurationChanges(data: CvData): boolean {
	const sectionOrder = data.sectionOrder || DEFAULT_PREDEFINED_SECTION_ORDER;
	return (
		(data.template || DEFAULT_TEMPLATE) !== DEFAULT_TEMPLATE ||
		(data.color || DEFAULT_COLOR) !== DEFAULT_COLOR ||
		!deepEqual(sectionOrder, DEFAULT_PREDEFINED_SECTION_ORDER) ||
		(data.settings !== undefined &&
			!deepEqual(data.settings, DEFAULT_RENDER_SETTINGS)) ||
		data.cvType !== undefined
	);
}

export function shouldAutoSaveCvData(
	data: CvData,
	currentProfileId?: string | null,
): boolean {
	return (
		Boolean(currentProfileId) ||
		hasCvContent(data) ||
		hasCvConfigurationChanges(data)
	);
}

export function createEmptyCvData(): CvData {
	return {
		personalInfo: EMPTY_PERSONAL_INFO,
		links: [],
		resume: "",
		experiences: [],
		education: [],
		skills: "",
		languages: [],
		certifications: [],
		projects: [],
		volunteers: [],
		customSections: [],
		template: DEFAULT_TEMPLATE,
		color: DEFAULT_COLOR,
		sectionOrder: DEFAULT_PREDEFINED_SECTION_ORDER,
		settings: DEFAULT_RENDER_SETTINGS,
	};
}

/** Stable id generator used for profiles and custom section fields. */
export function generateId(): string {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}
	return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

/** Deep copy of a CV, used when duplicating a profile. */
export function cloneCvData(data: CvData): CvData {
	if (typeof structuredClone === "function") return structuredClone(data);
	return JSON.parse(JSON.stringify(data)) as CvData;
}

/**
 * Factories for blank list entries. Kept here next to `createEmptyCvData` so
 * the shape of every entry has exactly one definition.
 */
export const createEmptyExperience = (): Experience => ({
	role: "",
	company: "",
	startMonth: "",
	startYear: "",
	endMonth: "",
	endYear: "",
	current: false,
	tech: "",
	activities: "",
	results: "",
});

export const createEmptyEducation = (): Education => ({
	type: "",
	status: "",
	course: "",
	institution: "",
	startMonth: "",
	startYear: "",
	endMonth: "",
	endYear: "",
	description: "",
	achievements: "",
});

export const createEmptyLanguage = (): Language => ({ name: "", level: "" });

export const createEmptyCertification = (): Certification => ({
	name: "",
	issuer: "",
	completionDate: "",
	hours: "",
	validationLink: "",
	description: "",
});

export const createEmptyProject = (): Project => ({
	name: "",
	description: "",
	link: "",
	sourceCode: "",
	tech: "",
	year: "",
	impact: "",
});

export const createEmptyVolunteer = (): Volunteer => ({
	organization: "",
	role: "",
	startMonth: "",
	startYear: "",
	endMonth: "",
	endYear: "",
	current: false,
	description: "",
	impact: "",
});

export const createEmptyCustomField = (): CustomField => ({
	id: generateId(),
	label: "",
	subtitle: "",
	value: "",
	current: false,
});

export const createEmptyCustomSection = (): CustomSection => ({
	id: generateId(),
	title: "",
	fields: [createEmptyCustomField()],
});

/** The section key used to order a custom section. */
export const customSectionKey = (id: string): SectionKey =>
	`custom_${id}` as SectionKey;
