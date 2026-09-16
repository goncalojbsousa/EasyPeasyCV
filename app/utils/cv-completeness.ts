import type { CvData, SectionKey } from "../types/cv";

/** Anchor key of the Personal Information block, which is not in `sectionOrder`. */
export const PERSONAL_INFO_KEY = "personal_info";

export type NavigableSectionKey = SectionKey | typeof PERSONAL_INFO_KEY;

function hasText(value?: string | null): boolean {
	return (value ?? "").trim() !== "";
}

/**
 * A field recruiters and ATS parsers expect to find. Each one knows where it
 * lives in the form, so the UI can take the user straight to it.
 */
export interface RecommendedField {
	key: string;
	/** Translation key of the field's display name */
	labelKey: string;
	done: boolean;
	/** Section to scroll to */
	section: NavigableSectionKey;
	/** DOM id of the input to focus, when there is a single one */
	inputId?: string;
}

/** DOM ids of the personal information inputs, shared with the form. */
export const PERSONAL_INPUT_IDS = {
	name: "cv-field-name",
	desiredRole: "cv-field-desired-role",
	email: "cv-field-email",
	phone: "cv-field-phone",
} as const;

/**
 * The recommended fields and whether each is filled in.
 *
 * Single source of truth for "is this CV complete enough": the builder shows it
 * while editing, and the post-download modal uses the same list.
 */
export function getRecommendedFields(data: CvData): RecommendedField[] {
	const info = data.personalInfo;
	return [
		{
			key: "name",
			labelKey: "field.full.name",
			done: hasText(info?.name),
			section: PERSONAL_INFO_KEY,
			inputId: PERSONAL_INPUT_IDS.name,
		},
		{
			key: "desiredRole",
			labelKey: "cvType.field.desired.role",
			done: hasText(info?.desiredRole),
			section: PERSONAL_INFO_KEY,
			inputId: PERSONAL_INPUT_IDS.desiredRole,
		},
		{
			key: "email",
			labelKey: "field.email",
			done: hasText(info?.email),
			section: PERSONAL_INFO_KEY,
			inputId: PERSONAL_INPUT_IDS.email,
		},
		{
			key: "phone",
			labelKey: "field.phone",
			done: hasText(info?.phone),
			section: PERSONAL_INFO_KEY,
			inputId: PERSONAL_INPUT_IDS.phone,
		},
		{
			key: "experience",
			labelKey: "section.professional.experience",
			done: (data.experiences?.length ?? 0) > 0,
			section: "professional_experience",
		},
		{
			key: "education",
			labelKey: "section.academic.education",
			done: (data.education?.length ?? 0) > 0,
			section: "academic_education",
		},
	];
}

/** Whether a section has any user content, for the navigator's indicator. */
export function isSectionFilled(
	key: NavigableSectionKey,
	data: CvData,
): boolean {
	switch (key) {
		case PERSONAL_INFO_KEY: {
			const info = data.personalInfo;
			return (
				hasText(info?.name) ||
				hasText(info?.desiredRole) ||
				hasText(info?.email) ||
				hasText(info?.phone) ||
				hasText(info?.city) ||
				(data.links?.length ?? 0) > 0
			);
		}
		case "professional_summary":
			return hasText(data.resume);
		case "technical_skills":
			return hasText(data.skills);
		case "professional_experience":
			return (data.experiences?.length ?? 0) > 0;
		case "academic_education":
			return (data.education?.length ?? 0) > 0;
		case "languages":
			return (data.languages?.length ?? 0) > 0;
		case "certifications":
			return (data.certifications?.length ?? 0) > 0;
		case "projects":
			return (data.projects?.length ?? 0) > 0;
		case "volunteer":
			return (data.volunteers?.length ?? 0) > 0;
		default: {
			const id = key.replace("custom_", "");
			const section = data.customSections?.find((cs) => cs.id === id);
			return Boolean(
				section?.fields.some(
					(field) =>
						hasText(field.label) ||
						hasText(field.value) ||
						hasText(field.bullets),
				),
			);
		}
	}
}
