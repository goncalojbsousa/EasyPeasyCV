/**
 * Interface for personal information data
 */
export interface PersonalInfo {
	/** Full name of the person */
	name: string;
	/** Desired job role or position */
	desiredRole: string;
	/** City of residence */
	city: string;
	/** Postal code */
	postalCode: string;
	/** Email address */
	email: string;
	/** Country code for phone number */
	countryCode: string;
	/** Phone number */
	phone: string;
}

/**
 * Interface for social media and portfolio links
 */
export interface Link {
	/** Type of link (LinkedIn, GitHub, Portfolio, etc.) */
	type: string;
	/** URL or username value */
	value: string;
	/** Custom name for the platform (when type is "Other") */
	customName?: string;
	/** Hide the link label (e.g., "GitHub:") and show only the URL */
	hideLinkLabel?: boolean;
}

/**
 * Interface for professional experience entries
 */
export interface Experience {
	/** Job title or role */
	role: string;
	/** Company name */
	company: string;
	/** Start month (abbreviated) */
	startMonth: string;
	/** Start year */
	startYear: string;
	/** End month (abbreviated) */
	endMonth: string;
	/** End year */
	endYear: string;
	/** Whether this is the current job */
	current: boolean;
	/** Technologies used in this role */
	tech: string;
	/** Activities and responsibilities */
	activities: string;
	/** Achievements and results with metrics */
	results: string;
}

/**
 * Interface for education entries
 */
export interface Education {
	/** Type of education (degree level) */
	type: string;
	/** Status of education (completed, in progress, etc.) */
	status: string;
	/** Course or degree name */
	course: string;
	/** Educational institution */
	institution: string;
	/** Start month (abbreviated) */
	startMonth: string;
	/** Start year */
	startYear: string;
	/** End month (abbreviated) */
	endMonth: string;
	/** End year */
	endYear: string;
	/** Whether this education is still in progress */
	current?: boolean;
	/** Description of education and activities */
	description: string;
	/** Achievements and notable accomplishments */
	achievements: string;
}

/**
 * Interface for language proficiency entries
 */
export interface Language {
	/** Language name */
	name: string;
	/** Proficiency level */
	level: string;
}

/**
 * Interface for certification entries
 */
export interface Certification {
	/** Certification name */
	name: string;
	/** Issuing organization or institution */
	issuer: string;
	/** Date of completion */
	completionDate: string;
	/** Hours of study or course duration */
	hours: string;
	/** URL for certificate validation */
	validationLink: string;
	/** Description of certification content */
	description: string;
}

/**
 * Interface for project entries
 */
export interface Project {
	/** Project name */
	name: string;
	/** Project description */
	description: string;
	/** Project URL or repository link */
	link: string;
	/** Source code repository URL (e.g., GitHub) */
	sourceCode?: string;
	/** Technologies used in the project */
	tech: string;
	/** Year of project completion */
	year: string;
	/** Impact and results achieved with the project */
	impact: string;
}

/**
 * Interface for volunteer work entries
 */
export interface Volunteer {
	/** Organization name */
	organization: string;
	/** Role or position in the organization */
	role: string;
	/** Start month (abbreviated) */
	startMonth: string;
	/** Start year */
	startYear: string;
	/** End month (abbreviated) */
	endMonth: string;
	/** End year */
	endYear: string;
	/** Whether this is the current volunteer position */
	current: boolean;
	/** Description of volunteer activities and responsibilities */
	description: string;
	/** Impact and achievements in the volunteer role */
	impact: string;
}

/** Custom field inside a user-defined section */
export interface CustomField {
	id: string;
	label: string;
	value: string;
	subtitle?: string;
	startMonth?: string;
	startYear?: string;
	endMonth?: string;
	endYear?: string;
	current?: boolean;
	bullets?: string;
	/** Center the content text like skills section */
	centerValue?: boolean;
}

/** Custom section created by the user */
export interface CustomSection {
	id: string;
	title: string;
	fields: CustomField[];
}

/**
 * Legacy closed themes. Superseded by the modular `CvStyleSettings`; kept only
 * so CVs saved (or XML exported) before the modular system can be migrated.
 * @deprecated use `CvRenderSettings.style`
 */
export type CvTemplate = "professional" | "timeline" | "classic";

export type CvColor =
	| "blue"
	| "green"
	| "purple"
	| "orange"
	| "red"
	| "teal"
	| "indigo"
	| "pink";

/**
 * Section keys for ordering CV sections
 */
export type PredefinedSectionKey =
	| "professional_summary"
	| "professional_experience"
	| "academic_education"
	| "technical_skills"
	| "languages"
	| "certifications"
	| "projects"
	| "volunteer";

export type CustomSectionKey = `custom_${string}`;

/** Section keys for ordering CV sections, including custom ones */
export type SectionKey = PredefinedSectionKey | CustomSectionKey;

/**
 * Main interface containing all CV data
 */
export interface CvData {
	/** Personal information */
	personalInfo: PersonalInfo;
	/** Social media and portfolio links */
	links: Link[];
	/** Professional summary */
	resume: string;
	/** Professional experience entries */
	experiences: Experience[];
	/** Education entries */
	education: Education[];
	/** Technical skills */
	skills: string;
	/** Language proficiency entries */
	languages: Language[];
	/** Certification entries */
	certifications: Certification[];
	/** Project entries */
	projects: Project[];
	/** Volunteer work entries */
	volunteers: Volunteer[];
	/** Custom sections defined by the user */
	customSections?: CustomSection[];
	/** Selected CV template */
	template?: CvTemplate;
	/** Selected color theme */
	color?: CvColor;
	/** Section order for CV sections */
	sectionOrder?: SectionKey[];
	/** Rendering and layout settings persisted with the CV */
	settings?: CvRenderSettings;
	/**
	 * Professional area whose examples the form shows (placeholders and a few
	 * field labels). Editor-only: it never changes the rendered CV. Unset on CVs
	 * saved before it was stored per profile.
	 */
	cvType?: CVType;
}

export type FontFamilyOption = "Helvetica" | "Times-Roman" | "Arial" | "Custom";
export type LayoutDensity = "compact" | "normal" | "spacious";
export type DateFormat = "short" | "medium" | "long";
export type TextAlignment = "left" | "justify";

export interface CustomFontConfig {
	name: string;
	dataUrl: string;
	style?: "normal" | "bold" | "italic" | "boldItalic";
}

export interface CvLayoutSettings {
	fontFamily: FontFamilyOption;
	customFont?: CustomFontConfig | null;
	textScale: number;
	marginsCm: { top: number; right: number; bottom: number; left: number };
	lineSpacing: number;
	sectionSpacingPx: number;
	columns: 1 | 2 | 3;
	atsSafe: boolean;
	density?: LayoutDensity;
	textAlignment?: TextAlignment;
	singlePageMode?: boolean;
}

export interface HeaderOptions {
	nameFontSize: number;
	nameFontWeight: "normal" | "bold" | "heavy";
	nameColor: string;
	titleStyle: "normal" | "italic" | "uppercase";
	titlePosition: "above" | "below";
	dividerThickness: 1 | 2 | 3;
	dividerStyle: "solid" | "dashed";
	iconSizePx: 16 | 18 | 20 | 22 | 24;
	iconSpacingPx: 5 | 7 | 9 | 11 | 13 | 15;
	iconAlignment: "left" | "center" | "right";
}

export interface PhotoOptions {
	enabled: boolean;
	aspectRatio: "1:1" | "3:4" | "4:3";
	borderRadius?: number;
	crop?: { x: number; y: number; width: number; height: number } | null;
	dataUrl?: string | null;
}

export interface SectionOptions {
	titleColor: string;
	titleFontSize: number;
	dateFormat: DateFormat;
	/** When true, links use the selected theme color instead of the default hyperlink blue */
	useThemeColorForLinks?: boolean;
}

export interface CvRenderSettings {
	layout: CvLayoutSettings;
	header: HeaderOptions;
	photo: PhotoOptions;
	sections: SectionOptions;
	/**
	 * Modular presentation choices. Optional so CVs saved before the modular
	 * system still parse; `resolveStyle()` fills it in from the legacy
	 * `CvData.template` in that case.
	 */
	style?: CvStyleSettings;
}

/* -------------------------------------------------------------------------- */
/*                          Modular style settings                            */
/* -------------------------------------------------------------------------- */

/**
 * The visual system is split in two:
 *
 * - **Variants** (this block) — discrete, mutually exclusive presentation
 *   choices, e.g. "draw section titles with a rule underneath". They live in
 *   `CvRenderSettings.style`.
 * - **Tokens** — continuous values such as colors, sizes and spacing. Those
 *   stay in `layout` / `header` / `photo` / `sections`.
 *
 * Adding a new customisation option means adding a variant union plus a field
 * here; no new "template" is ever needed.
 */

/** How every section heading is drawn. Global: applies to all sections. */
export type SectionTitleVariant = "plain" | "ruled" | "inlineRule" | "block";

/** Horizontal placement used by titles and the header. */
export type BlockAlign = "left" | "center";

/** Whether text is forced to upper case. */
export type CaseTransform = "none" | "uppercase";

/** How the contact details are laid out in the header. */
export type ContactVariant = "inline" | "separated" | "stacked";

/** How the entries of a list section are presented. */
export type EntryVariant = "plain" | "card" | "timeline";

/** Where an entry's date range sits relative to its title. */
export type DatePlacement = "right" | "below";

/** The marker used for bullet lines. */
export type BulletVariant = "dot" | "dash" | "none";

/** How language proficiency rows are presented. */
export type LanguagesVariant = "inline" | "rows" | "leaders";

/** How the skills text is presented. */
export type SkillsVariant = "paragraph" | "centered" | "bulleted";

/**
 * Sections whose entries can each use a different presentation.
 * `custom` covers every user-defined section.
 */
export type StyledSectionKey =
	| "professional_experience"
	| "academic_education"
	| "certifications"
	| "projects"
	| "volunteer"
	| "custom";

export const STYLED_SECTION_KEYS: StyledSectionKey[] = [
	"professional_experience",
	"academic_education",
	"certifications",
	"projects",
	"volunteer",
	"custom",
];

/** Modular, combinable presentation choices for the rendered CV. */
export interface CvStyleSettings {
	/** Section headings — global by design, so the CV reads consistently */
	sectionTitle: {
		variant: SectionTitleVariant;
		align: BlockAlign;
		transform: CaseTransform;
	};
	/** Personal information block */
	header: {
		align: BlockAlign;
		contact: ContactVariant;
		/** Rule drawn between the header and the first section */
		divider: boolean;
	};
	/** Date presentation — global, so entries never disagree with each other */
	datePlacement: DatePlacement;
	/** Bullet marker — global */
	bullets: BulletVariant;
	/**
	 * Per-section entry presentation. `custom` is the default for every custom
	 * section that has no style of its own in `customSectionEntries`.
	 */
	entries: Record<StyledSectionKey, EntryVariant>;
	/**
	 * Entry presentation chosen for an individual custom section, keyed by the
	 * section's id. Kept here rather than on the section so that applying a
	 * preset resets it together with every other style choice.
	 */
	customSectionEntries?: Record<string, EntryVariant>;
	/** Languages section presentation */
	languages: LanguagesVariant;
	/** Skills section presentation */
	skills: SkillsVariant;
}

/**
 * Domain of the CV, used to pick role-specific placeholder/label translations.
 * The concrete list of values lives in `utils/cv-types.ts`.
 */
export type CVType =
	| "development"
	| "marketing"
	| "sales"
	| "hr"
	| "finance"
	| "design"
	| "health"
	| "education"
	| "admin"
	| "other";

/**
 * The controls every form section's header can offer. The builder page owns
 * this state so the section navigator and the sections stay in sync.
 */
export interface SectionControlProps {
	/** Whether this section can be reordered (false for Personal Information) */
	canReorder?: boolean;
	/** Callback when the user chooses "move up" */
	onMoveUp?: () => void;
	/** Callback when the user chooses "move down" */
	onMoveDown?: () => void;
	/** Whether "move up" is available */
	canMoveUp?: boolean;
	/** Whether "move down" is available */
	canMoveDown?: boolean;
	/** Opens this section's style options, when it has any */
	onOpenStyle?: () => void;
	/** Removes the whole section (custom sections only) */
	onRemove?: () => void;
	/** Controlled collapsed state; the section manages it itself when omitted */
	collapsed?: boolean;
	onToggleCollapsed?: () => void;
}
