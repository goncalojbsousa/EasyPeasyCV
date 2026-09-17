import { Link, Text, View } from "@react-pdf/renderer";
import type React from "react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { buildEntryFrame } from "../components/cv_templates/entry_frame";
import type {
	CustomSection,
	CvData,
	CvRenderSettings,
	CvStyleSettings,
	EntryVariant,
	Language,
	SectionKey,
} from "../types/cv";
import { DEFAULT_PREDEFINED_SECTION_ORDER } from "./cv-data";
import { getCustomSectionVariant } from "./style-presets";
import {
	formatDateRange,
	splitLines,
	translateLabel,
	translateLanguageLevel,
} from "./template-helpers";
import type { CvStyleSheet } from "./template-styles";

export interface SectionRenderProps {
	styles: CvStyleSheet;
	lang: string;
	settings?: CvRenderSettings;
	/** The modular presentation choices for this CV */
	style: CvStyleSettings;
	/** The globally chosen section heading */
	SectionTitle: React.ComponentType<{ label: string }>;
}

export function getSectionOrder(
	sectionOrder: SectionKey[] | undefined,
	customSections: CustomSection[] | undefined,
): SectionKey[] {
	const customOrder = (customSections || []).map(
		(cs) => `custom_${cs.id}` as SectionKey,
	);
	const baseOrder = sectionOrder?.length
		? sectionOrder
		: DEFAULT_PREDEFINED_SECTION_ORDER;
	return [...baseOrder, ...customOrder.filter((k) => !baseOrder.includes(k))];
}

/* -------------------------------------------------------------------------- */
/*                              Shared building blocks                        */
/* -------------------------------------------------------------------------- */

const BULLET_MARKERS = { dot: "• ", dash: "– ", none: "" } as const;

/** A list of bullet lines, using the globally chosen marker. */
function Bullets({
	lines,
	keyPrefix,
	styles,
	style,
}: {
	lines: string[];
	keyPrefix: string;
	styles: CvStyleSheet;
	style: CvStyleSettings;
}) {
	if (lines.length === 0) return null;
	const marker = BULLET_MARKERS[style.bullets];

	return (
		<View style={{ marginTop: 2 }}>
			{lines.map((line) => (
				<Text
					key={`${keyPrefix}-${line}`}
					style={
						style.bullets === "none"
							? { ...styles.bullets, marginLeft: 0 }
							: styles.bullets
					}
				>
					{marker}
					{line}
				</Text>
			))}
		</View>
	);
}

/**
 * The normalised shape every list section maps its data onto, so that date
 * placement, bullet style and entry framing behave identically everywhere.
 */
export interface EntryContent {
	key: string;
	title?: string;
	subtitle?: string;
	/** Secondary detail appended to the subtitle, e.g. degree • status */
	meta?: string;
	date?: string;
	body?: string;
	bullets?: string[];
	/** Rendered after the body, e.g. a technologies line or links */
	extra?: ReactNode;
	/** Centre the body text (custom sections can opt into this per field) */
	centerBody?: boolean;
	/**
	 * Keep the date next to the title in italics instead of in the date column.
	 * Used by certifications and projects, which have a single short date.
	 */
	inlineDate?: boolean;
}

/** One entry, honouring the global date placement and bullet options. */
function EntryBlock({
	entry,
	styles,
	style,
}: {
	entry: EntryContent;
	styles: CvStyleSheet;
	style: CvStyleSettings;
}) {
	const dateBelow = style.datePlacement === "below";
	const inlineDate = entry.inlineDate && !dateBelow;
	const showDateColumn = Boolean(entry.date) && !dateBelow && !inlineDate;

	const subtitleText =
		entry.subtitle || entry.meta ? (
			<Text style={{ ...styles.company, marginBottom: 0 }}>
				{entry.subtitle}
				{entry.meta && (
					<Text style={{ fontSize: 9, color: "#000000" }}>
						{entry.subtitle ? "  |  " : ""}
						{entry.meta}
					</Text>
				)}
			</Text>
		) : null;

	return (
		<>
			{(entry.title || subtitleText || entry.date) && (
				<View style={styles.expHeaderRow}>
					<View style={styles.expLeft}>
						{entry.title && (
							<Text style={styles.jobRole}>
								{entry.title}
								{inlineDate && entry.date ? (
									<Text style={{ fontSize: 10, fontStyle: "italic" }}>
										{` ${entry.date}`}
									</Text>
								) : null}
							</Text>
						)}
						{subtitleText}
						{dateBelow && entry.date && (
							<Text style={styles.entryDateBelow}>{entry.date}</Text>
						)}
					</View>
					{showDateColumn && (
						<View style={styles.expRight}>
							<Text>{entry.date}</Text>
						</View>
					)}
				</View>
			)}

			{entry.body && (
				<Text
					style={
						entry.centerBody
							? { ...styles.activitiesText, textAlign: "center" }
							: styles.activitiesText
					}
				>
					{entry.body}
				</Text>
			)}

			{entry.bullets && (
				<Bullets
					lines={entry.bullets}
					keyPrefix={entry.key}
					styles={styles}
					style={style}
				/>
			)}

			{entry.extra}
		</>
	);
}

/**
 * Renders a whole list section: the heading plus every entry inside the frame
 * chosen for that section.
 */
function renderEntrySection(
	sectionKey: string,
	variant: EntryVariant,
	label: string,
	entries: EntryContent[],
	{ styles, style, SectionTitle }: SectionRenderProps,
) {
	if (entries.length === 0) return null;

	const frame = buildEntryFrame(styles, variant);
	const items = (
		<>
			{entries.map((entry) => (
				<frame.Item key={entry.key}>
					<EntryBlock entry={entry} styles={styles} style={style} />
				</frame.Item>
			))}
		</>
	);

	return (
		<View style={styles.section} key={sectionKey}>
			<SectionTitle label={label} />
			{frame.List ? <frame.List>{items}</frame.List> : items}
		</View>
	);
}

/** A themed hyperlink line. */
function LinkLine({ href, styles }: { href: string; styles: CvStyleSheet }) {
	return (
		<Link
			src={href}
			style={{
				fontSize: 9,
				color: (styles.linkColor as unknown as string) || "#2563eb",
			}}
		>
			{href}
		</Link>
	);
}

/* -------------------------------------------------------------------------- */
/*                                  Sections                                  */
/* -------------------------------------------------------------------------- */

export function renderSummarySection(
	resume: string | undefined,
	{ styles, lang, SectionTitle }: SectionRenderProps,
) {
	if (!resume) return null;

	return (
		<View style={styles.section} key="professional_summary">
			<SectionTitle label={translateLabel("pdf.section.summary", lang)} />
			<Text style={styles.summaryText}>{resume}</Text>
		</View>
	);
}

export function renderExperienceSection(
	experiences: CvData["experiences"],
	props: SectionRenderProps,
) {
	const { lang, settings, styles } = props;

	const entries: EntryContent[] = (experiences || []).map((exp, idx) => ({
		key: `${exp.company}-${exp.role}-${exp.startYear}-${exp.endYear}-${idx}`,
		title: exp.role,
		subtitle: exp.company,
		date: formatDateRange(
			exp.startMonth,
			exp.startYear,
			exp.endMonth,
			exp.endYear,
			exp.current,
			lang,
			settings?.sections?.dateFormat,
		),
		body: exp.activities,
		bullets: splitLines(exp.results),
		extra: exp.tech ? (
			<Text
				style={{
					marginTop: 4,
					color: "#000000",
					fontSize: styles.activitiesText?.fontSize || 10,
					textAlign: styles.activitiesText?.textAlign || undefined,
				}}
			>
				{exp.tech}
			</Text>
		) : undefined,
	}));

	return renderEntrySection(
		"professional_experience",
		props.style.entries.professional_experience,
		translateLabel("pdf.section.experience", lang),
		entries,
		props,
	);
}

export function renderEducationSection(
	education: CvData["education"],
	props: SectionRenderProps,
) {
	const { lang, settings } = props;

	const entries: EntryContent[] = (education || []).map((edu, idx) => ({
		key: `${edu.institution}-${edu.course}-${edu.startYear}-${edu.endYear}-${idx}`,
		title: edu.course,
		subtitle: edu.institution,
		meta: [translateLabel(edu.type, lang), translateLabel(edu.status, lang)]
			.filter(Boolean)
			.join(" • "),
		date: formatDateRange(
			edu.startMonth,
			edu.startYear,
			edu.endMonth,
			edu.endYear,
			edu.current,
			lang,
			settings?.sections?.dateFormat,
		),
		body: edu.description,
		bullets: splitLines(edu.achievements),
	}));

	return renderEntrySection(
		"academic_education",
		props.style.entries.academic_education,
		translateLabel("pdf.section.education", lang),
		entries,
		props,
	);
}

export function renderSkillsSection(
	skills: string | undefined,
	{ styles, lang, style, SectionTitle }: SectionRenderProps,
) {
	if (!skills) return null;

	const label = translateLabel("pdf.section.skills", lang);

	return (
		<View style={styles.section} key="technical_skills">
			<SectionTitle label={label} />
			{style.skills === "bulleted" ? (
				<View>
					{skills
						.split(/[,;\n]/)
						.map((entry) => entry.trim())
						.filter(Boolean)
						.map((entry) => (
							<Text key={entry} style={styles.bullets}>
								{BULLET_MARKERS[style.bullets]}
								{entry}
							</Text>
						))}
				</View>
			) : (
				<Text
					style={
						style.skills === "centered"
							? styles.skillsCentered
							: styles.summaryText
					}
				>
					{skills}
				</Text>
			)}
		</View>
	);
}

export function renderLanguagesSection(
	languages: Language[] | undefined,
	{ styles, lang, style, SectionTitle }: SectionRenderProps,
) {
	if (!languages || languages.length === 0) return null;

	const label = translateLabel("pdf.section.languages", lang);
	const rows = languages.map((item) => ({
		key: `${item.name}-${item.level || "unknown"}`,
		name: item.name,
		level: translateLanguageLevel(item.level, lang),
	}));

	return (
		<View style={styles.section} key="languages">
			<SectionTitle label={label} />

			{style.languages === "rows" && (
				<View>
					{rows.map((row) => (
						<View key={row.key} style={styles.langRow}>
							<Text style={styles.langName}>{row.name}</Text>
							<Text style={styles.langLevel}>{row.level}</Text>
						</View>
					))}
				</View>
			)}

			{style.languages === "leaders" && (
				<View>
					{rows.map((row) => (
						<View key={row.key} style={styles.langLeaderRow}>
							<Text style={styles.langName}>{row.name}</Text>
							<View style={styles.langLeaderRule} />
							<Text style={styles.langLevel}>{row.level}</Text>
						</View>
					))}
				</View>
			)}

			{style.languages === "inline" && (
				<View style={styles.langInlineWrap}>
					{rows.map((row) => (
						<Text key={row.key} style={styles.langInlineItem}>
							{row.name}
							{row.level ? ` (${row.level})` : ""}
						</Text>
					))}
				</View>
			)}
		</View>
	);
}

export function renderCertificationsSection(
	certifications: CvData["certifications"],
	props: SectionRenderProps,
) {
	const { lang, styles } = props;

	const entries: EntryContent[] = (certifications || []).map((cert, idx) => ({
		key: `${cert.name}-${cert.issuer}-${cert.completionDate}-${idx}`,
		title: cert.name,
		subtitle: cert.issuer,
		date: cert.completionDate,
		inlineDate: true,
		bullets: cert.description ? [cert.description] : undefined,
		extra: cert.validationLink ? (
			<LinkLine href={cert.validationLink} styles={styles} />
		) : undefined,
	}));

	return renderEntrySection(
		"certifications",
		props.style.entries.certifications,
		translateLabel("pdf.section.certifications", lang),
		entries,
		props,
	);
}

export function renderProjectsSection(
	projects: CvData["projects"],
	props: SectionRenderProps,
) {
	const { lang, styles } = props;

	const entries: EntryContent[] = (projects || []).map((proj, idx) => ({
		key: `${proj.name}-${proj.year}-${idx}`,
		title: proj.name,
		subtitle: proj.tech,
		date: proj.year,
		inlineDate: true,
		body: proj.description,
		bullets: splitLines(proj.impact),
		extra: (
			<>
				{proj.link && <LinkLine href={proj.link} styles={styles} />}
				{proj.sourceCode && <LinkLine href={proj.sourceCode} styles={styles} />}
			</>
		),
	}));

	return renderEntrySection(
		"projects",
		props.style.entries.projects,
		translateLabel("pdf.section.projects", lang),
		entries,
		props,
	);
}

export function renderVolunteerSection(
	volunteers: CvData["volunteers"],
	props: SectionRenderProps,
) {
	const { lang, settings } = props;

	const entries: EntryContent[] = (volunteers || []).map((vol, idx) => ({
		key: `${vol.organization}-${vol.role}-${vol.startYear}-${vol.endYear}-${idx}`,
		title: vol.role,
		subtitle: vol.organization,
		date: formatDateRange(
			vol.startMonth,
			vol.startYear,
			vol.endMonth,
			vol.endYear,
			vol.current,
			lang,
			settings?.sections?.dateFormat,
		),
		body: vol.description,
		bullets: splitLines(vol.impact),
	}));

	return renderEntrySection(
		"volunteer",
		props.style.entries.volunteer,
		translateLabel("pdf.section.volunteer", lang),
		entries,
		props,
	);
}

export function renderCustomSection(
	section: CustomSection,
	props: SectionRenderProps,
) {
	const { lang, settings } = props;

	const meaningfulFields = (section.fields || []).filter(
		(f) =>
			f.label ||
			f.value ||
			f.bullets ||
			f.subtitle ||
			f.startYear ||
			f.endYear ||
			f.startMonth ||
			f.endMonth ||
			f.current,
	);

	if (!section.title && meaningfulFields.length === 0) return null;

	const sectionKey = `custom_${section.id}`;
	const entries: EntryContent[] = meaningfulFields.map((field, idx) => ({
		key: `${sectionKey}-${field.id || idx}`,
		title: field.label,
		subtitle: field.subtitle,
		date: formatDateRange(
			field.startMonth,
			field.startYear,
			field.endMonth,
			field.endYear,
			field.current,
			lang,
			settings?.sections?.dateFormat,
		),
		body: field.value,
		bullets: splitLines(field.bullets),
		centerBody: field.centerValue,
	}));

	return renderEntrySection(
		sectionKey,
		getCustomSectionVariant(props.style, section.id),
		section.title || translateLabel("pdf.section.custom", lang),
		entries,
		props,
	);
}

/**
 * Renders the CV section named by `sectionKey`.
 *
 * Every presentation difference now comes from `props.style`, so there is a
 * single dispatch for the whole app rather than one per theme.
 */
export function renderSectionByKey(
	sectionKey: SectionKey,
	data: CvData,
	props: SectionRenderProps,
): ReactNode {
	switch (sectionKey) {
		case "professional_summary":
			return renderSummarySection(data.resume, props);
		case "professional_experience":
			return renderExperienceSection(data.experiences, props);
		case "academic_education":
			return renderEducationSection(data.education, props);
		case "technical_skills":
			return renderSkillsSection(data.skills, props);
		case "languages":
			return renderLanguagesSection(data.languages, props);
		case "certifications":
			return renderCertificationsSection(data.certifications, props);
		case "projects":
			return renderProjectsSection(data.projects, props);
		case "volunteer":
			return renderVolunteerSection(data.volunteers, props);
		default: {
			const customId = sectionKey.replace("custom_", "");
			const section = (data.customSections || []).find(
				(cs) => cs.id === customId,
			);
			if (!section) return null;
			return (
				<Fragment key={sectionKey}>
					{renderCustomSection(section, props)}
				</Fragment>
			);
		}
	}
}
