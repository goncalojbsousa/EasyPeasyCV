import { Link, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type React from "react";
import type {
	Certification,
	CustomSection,
	CvRenderSettings,
	Education,
	Experience,
	Language,
	PredefinedSectionKey,
	Project,
	SectionKey,
	Volunteer,
} from "../types/cv";
import {
	formatDateRange,
	splitLines,
	translateLabel,
	translateLanguageLevel,
} from "./template-helpers";

export type PdfStyles = {
	summaryText: Style;
	expItem: Style;
	expHeaderRow: Style;
	expLeft: Style;
	expRight: Style;
	jobRole: Style;
	company: Style;
	bullets: Style;
	activitiesText: Style;
	section: Style;
	[key: string]: Style | string | number | undefined;
};

export interface SectionRenderProps {
	styles: PdfStyles;
	lang: string;
	settings?: CvRenderSettings;
}

export interface SectionWrapperProps {
	children: React.ReactNode;
	sectionKey: string;
	label: string;
}

export function getSectionOrder(
	sectionOrder: SectionKey[] | undefined,
	customSections: CustomSection[] | undefined,
): SectionKey[] {
	const defaultOrder: PredefinedSectionKey[] = [
		"professional_summary",
		"professional_experience",
		"academic_education",
		"technical_skills",
		"languages",
		"certifications",
		"projects",
		"volunteer",
	];

	const customOrder = (customSections || []).map(
		(cs) => `custom_${cs.id}` as SectionKey,
	);
	const baseOrder =
		sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;
	return [...baseOrder, ...customOrder.filter((k) => !baseOrder.includes(k))];
}

export function renderSummarySection(
	resume: string | undefined,
	{ styles, lang }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
) {
	if (!resume) return null;

	const label = translateLabel("pdf.section.summary", lang);

	return (
		<View style={styles.section} key="professional_summary">
			<SectionTitle label={label} />
			<Text style={styles.summaryText}>{resume}</Text>
		</View>
	);
}

export function renderExperienceSection(
	experiences: Experience[],
	{ styles, lang, settings }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
	ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
	SectionWrapper?: React.ComponentType<SectionWrapperProps>,
) {
	if (experiences.length === 0) return null;

	const label = translateLabel("pdf.section.experience", lang);

	const itemsContent = (
		<>
			{experiences.map((exp, idx) => {
				const expKey = `${exp.company}-${exp.role}-${exp.startYear}-${exp.startMonth}-${exp.endYear}-${exp.endMonth}-${idx}`;
				const content = (
					<View key={expKey} style={styles.expItem}>
						<View style={styles.expHeaderRow}>
							<View style={styles.expLeft}>
								{exp.role && <Text style={styles.jobRole}>{exp.role}</Text>}
								{exp.company && (
									<Text style={styles.company}>{exp.company}</Text>
								)}
							</View>
							<View style={styles.expRight}>
								<Text>
									{formatDateRange(
										exp.startMonth,
										exp.startYear,
										exp.endMonth,
										exp.endYear,
										exp.current,
										lang,
										settings?.sections?.dateFormat,
									)}
								</Text>
							</View>
						</View>
						{exp.activities && (
							<Text style={styles.activitiesText}>{exp.activities}</Text>
						)}
						{exp.results && (
							<View style={{ marginTop: 2 }}>
								{splitLines(exp.results).map((line) => {
									const bulletKey = `${expKey}-${line}`;
									return (
										<Text key={bulletKey} style={styles.bullets}>
											• {line}
										</Text>
									);
								})}
							</View>
						)}
						{exp.tech && (
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
						)}
					</View>
				);

				return ItemWrapper ? (
					<ItemWrapper key={expKey}>{content}</ItemWrapper>
				) : (
					content
				);
			})}
		</>
	);

	if (SectionWrapper) {
		return (
			<SectionWrapper sectionKey="professional_experience" label={label}>
				{itemsContent}
			</SectionWrapper>
		);
	}

	return (
		<View style={styles.section} key="professional_experience">
			<SectionTitle label={label} />
			{itemsContent}
		</View>
	);
}

export function renderEducationSection(
	education: Education[],
	{ styles, lang, settings }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
	ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
	SectionWrapper?: React.ComponentType<SectionWrapperProps>,
) {
	if (education.length === 0) return null;

	const label = translateLabel("pdf.section.education", lang);

	const itemsContent = (
		<>
			{education.map((edu, idx) => {
				const typeLabel = translateLabel(
					edu.type,
					lang === "pt" ? "pt" : lang === "es" ? "es" : "en",
				);
				const statusLabel = translateLabel(
					edu.status,
					lang === "pt" ? "pt" : lang === "es" ? "es" : "en",
				);
				const meta = [typeLabel, statusLabel].filter(Boolean).join(" • ");
				const eduKey = `${edu.institution}-${edu.course}-${edu.startYear}-${edu.startMonth}-${edu.endYear}-${edu.endMonth}-${idx}`;

				const content = (
					<View key={eduKey} style={styles.expItem}>
						<View style={{ ...styles.expHeaderRow, alignItems: "center" }}>
							<View style={styles.expLeft}>
								<Text style={styles.jobRole}>{edu.course}</Text>
								{(edu.institution || meta) && (
									<Text style={{ ...styles.company, marginBottom: 0 }}>
										{edu.institution}
										{meta && (
											<Text
												style={{ fontSize: 9, color: "#000000", marginTop: 0 }}
											>
												{"  |  "}
												{meta}
											</Text>
										)}
									</Text>
								)}
							</View>
							<View style={styles.expRight}>
								<Text>
									{formatDateRange(
										edu.startMonth,
										edu.startYear,
										edu.endMonth,
										edu.endYear,
										edu.current,
										lang,
										settings?.sections?.dateFormat,
									)}
								</Text>
							</View>
						</View>
						{edu.description && (
							<Text style={styles.activitiesText}>{edu.description}</Text>
						)}
						{edu.achievements && (
							<View style={{ marginTop: 2 }}>
								{splitLines(edu.achievements).map((line) => {
									const achievementKey = `${eduKey}-${line}`;
									return (
										<Text key={achievementKey} style={styles.bullets}>
											• {line}
										</Text>
									);
								})}
							</View>
						)}
					</View>
				);

				return ItemWrapper ? (
					<ItemWrapper key={eduKey}>{content}</ItemWrapper>
				) : (
					content
				);
			})}
		</>
	);

	if (SectionWrapper) {
		return (
			<SectionWrapper sectionKey="academic_education" label={label}>
				{itemsContent}
			</SectionWrapper>
		);
	}

	return (
		<View style={styles.section} key="academic_education">
			<SectionTitle label={label} />
			{itemsContent}
		</View>
	);
}

export function renderSkillsSection(
	skills: string | undefined,
	{ styles, lang }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
	customTextStyle?: Style,
) {
	if (!skills) return null;

	const label = translateLabel("pdf.section.skills", lang);
	const textStyle = customTextStyle || styles.summaryText;

	return (
		<View style={styles.section} key="technical_skills">
			<SectionTitle label={label} />
			<Text style={textStyle}>{skills}</Text>
		</View>
	);
}

export function renderLanguagesSection(
	languages: Language[] | undefined,
	{ styles, lang }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
	CustomRender?: (
		languages: Language[],
		styles: PdfStyles,
		lang: string,
	) => React.ReactNode,
) {
	if (!languages || languages.length === 0) return null;

	const label = translateLabel("pdf.section.languages", lang);

	return (
		<View style={styles.section} key="languages">
			<SectionTitle label={label} />
			{CustomRender ? (
				CustomRender(languages, styles, lang)
			) : (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					{languages.map((langItem) => {
						const levelLabel = translateLanguageLevel(
							langItem.level,
							lang === "pt" ? "pt" : lang === "es" ? "es" : "en",
						);
						const languageKey = `${langItem.name}-${langItem.level || "unknown"}`;
						return (
							<Text
								key={languageKey}
								style={{ marginHorizontal: 6, fontSize: 10 }}
							>
								{langItem.name}
								{levelLabel ? ` (${levelLabel})` : ""}
							</Text>
						);
					})}
				</View>
			)}
		</View>
	);
}

export function renderCertificationsSection(
	certifications: Certification[] | undefined,
	{ styles, lang }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
) {
	if (!certifications || certifications.length === 0) return null;

	const label = translateLabel("pdf.section.certifications", lang);

	return (
		<View style={styles.section} key="certifications">
			<SectionTitle label={label} />
			{certifications.map((cert, i) => (
				<View
					key={`${cert.name}-${cert.issuer}-${cert.completionDate}-${i}`}
					style={{ marginBottom: 6 }}
				>
					<Text style={{ ...styles.jobRole }}>
						{cert.name}{" "}
						<Text style={{ fontSize: 10, fontStyle: "italic" }}>
							{cert.completionDate}
						</Text>
					</Text>
					{cert.issuer && (
						<Text style={{ fontSize: 10, color: "#000000" }}>
							{cert.issuer}
						</Text>
					)}
					{cert.validationLink && (
						<Link
							src={cert.validationLink}
							style={{
								fontSize: 9,
								color: (styles.linkColor as unknown as string) || "#2563eb",
							}}
						>
							{cert.validationLink}
						</Link>
					)}
					{cert.description && (
						<Text style={styles.bullets}>• {cert.description}</Text>
					)}
				</View>
			))}
		</View>
	);
}

export function renderProjectsSection(
	projects: Project[] | undefined,
	{ styles, lang }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
) {
	if (!projects || projects.length === 0) return null;

	const label = translateLabel("pdf.section.projects", lang);

	return (
		<View style={styles.section} key="projects">
			<SectionTitle label={label} />
			{projects.map((proj, i) => (
				<View
					key={`${proj.name}-${proj.year}-${i}`}
					style={{ marginBottom: 6 }}
				>
					<Text style={styles.jobRole}>
						{proj.name}{" "}
						{proj.year ? (
							<Text style={{ fontSize: 10, fontStyle: "italic" }}>
								{proj.year}
							</Text>
						) : null}
					</Text>
					{proj.tech && (
						<Text style={{ fontSize: 10, color: "#000000" }}>{proj.tech}</Text>
					)}
					{proj.description && (
						<Text style={styles.activitiesText}>{proj.description}</Text>
					)}
					{proj.impact && (
						<View style={{ marginTop: 2 }}>
							{splitLines(proj.impact).map((line) => {
								const impactKey = `${proj.name}-${proj.year}-${line}`;
								return (
									<Text key={impactKey} style={styles.bullets}>
										• {line}
									</Text>
								);
							})}
						</View>
					)}
					{proj.link && (
						<Link
							src={proj.link}
							style={{
								fontSize: 9,
								color: (styles.linkColor as unknown as string) || "#2563eb",
							}}
						>
							{proj.link}
						</Link>
					)}
					{proj.sourceCode && (
						<Link
							src={proj.sourceCode}
							style={{
								fontSize: 9,
								color: (styles.linkColor as unknown as string) || "#2563eb",
							}}
						>
							{proj.sourceCode}
						</Link>
					)}
				</View>
			))}
		</View>
	);
}

export function renderVolunteerSection(
	volunteers: Volunteer[] | undefined,
	{ styles, lang, settings }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
	ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
	SectionWrapper?: React.ComponentType<SectionWrapperProps>,
) {
	if (!volunteers || volunteers.length === 0) return null;

	const label = translateLabel("pdf.section.volunteer", lang);

	const itemsContent = (
		<>
			{volunteers.map((vol, i) => {
				const volKey = `${vol.organization}-${vol.role}-${vol.startYear}-${vol.startMonth}-${vol.endYear}-${vol.endMonth}-${i}`;
				const content = (
					<View key={volKey} style={{ marginBottom: 6 }}>
						<View style={styles.expHeaderRow}>
							<View style={styles.expLeft}>
								<Text style={styles.jobRole}>{vol.role}</Text>
								<Text style={styles.company}>{vol.organization}</Text>
							</View>
							<View style={styles.expRight}>
								<Text>
									{formatDateRange(
										vol.startMonth,
										vol.startYear,
										vol.endMonth,
										vol.endYear,
										vol.current,
										lang,
										settings?.sections?.dateFormat,
									)}
								</Text>
							</View>
						</View>
						{vol.description && (
							<Text style={styles.activitiesText}>{vol.description}</Text>
						)}
						{vol.impact && (
							<View style={{ marginTop: 2 }}>
								{splitLines(vol.impact).map((line) => {
									const impactKey = `${volKey}-${line}`;
									return (
										<Text key={impactKey} style={styles.bullets}>
											• {line}
										</Text>
									);
								})}
							</View>
						)}
					</View>
				);

				return ItemWrapper ? (
					<ItemWrapper key={volKey}>{content}</ItemWrapper>
				) : (
					content
				);
			})}
		</>
	);

	if (SectionWrapper) {
		return (
			<SectionWrapper sectionKey="volunteer" label={label}>
				{itemsContent}
			</SectionWrapper>
		);
	}

	return (
		<View style={styles.section} key="volunteer">
			<SectionTitle label={label} />
			{itemsContent}
		</View>
	);
}

export function renderCustomSection(
	section: CustomSection,
	{ styles, lang, settings }: SectionRenderProps,
	SectionTitle: React.ComponentType<{ label: string }>,
	ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
	SectionWrapper?: React.ComponentType<SectionWrapperProps>,
) {
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

	const label = section.title || translateLabel("pdf.section.custom", lang);
	const sectionKey = `custom_${section.id}`;

	const itemsContent = (
		<>
			{meaningfulFields.map((field, idx) => {
				const content = (
					<View key={field.id || idx} style={{ marginBottom: 8 }}>
						{(field.label ||
							field.subtitle ||
							field.startYear ||
							field.endYear ||
							field.startMonth ||
							field.endMonth ||
							field.current) && (
							<View style={styles.expHeaderRow}>
								<View style={styles.expLeft}>
									{field.label && (
										<Text style={styles.jobRole}>{field.label}</Text>
									)}
									{field.subtitle && (
										<Text style={styles.company}>{field.subtitle}</Text>
									)}
								</View>
								<View style={styles.expRight}>
									<Text>
										{formatDateRange(
											field.startMonth,
											field.startYear,
											field.endMonth,
											field.endYear,
											field.current,
											lang,
											settings?.sections?.dateFormat,
										)}
									</Text>
								</View>
							</View>
						)}
						{field.value && (
							<Text
								style={
									field.centerValue
										? { ...styles.activitiesText, textAlign: "center" }
										: styles.activitiesText
								}
							>
								{field.value}
							</Text>
						)}
						{field.bullets && (
							<View style={{ marginTop: 2 }}>
								{splitLines(field.bullets).map((line) => {
									const bulletKey = `${sectionKey}-${field.id || "field"}-${line}`;
									return (
										<Text key={bulletKey} style={styles.bullets}>
											• {line}
										</Text>
									);
								})}
							</View>
						)}
					</View>
				);

				return ItemWrapper ? (
					<ItemWrapper key={field.id || idx}>{content}</ItemWrapper>
				) : (
					content
				);
			})}
		</>
	);

	if (SectionWrapper) {
		return (
			<SectionWrapper sectionKey={sectionKey} label={label}>
				{itemsContent}
			</SectionWrapper>
		);
	}

	return (
		<View style={styles.section} key={sectionKey}>
			<SectionTitle label={label} />
			{itemsContent}
		</View>
	);
}
