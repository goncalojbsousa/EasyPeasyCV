import {
	Document,
	Image,
	Link,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import React from "react";
import type {
	CvColor,
	CvData,
	CvRenderSettings,
	Language,
} from "../../types/cv";
import {
	getSectionOrder,
	renderCertificationsSection,
	renderCustomSection,
	renderEducationSection,
	renderExperienceSection,
	renderLanguagesSection,
	renderProjectsSection,
	renderSkillsSection,
	renderSummarySection,
	renderVolunteerSection,
	type SectionWrapperProps,
} from "../../utils/section-renderers";
import {
	getSocialUrl,
	translateLanguageLevel,
} from "../../utils/template-helpers";
import {
	buildCommonStyles,
	computeMetrics,
	getPhotoSize,
	type PdfTextAlign,
} from "../../utils/template-styles";

interface ClassicTemplateProps extends CvData {
	lang?: string;
	settings?: CvRenderSettings;
	color?: CvColor;
}

const buildStyles = (settings?: CvRenderSettings, color: CvColor = "blue") => {
	const metrics = computeMetrics(settings, color);
	const commonStyles = buildCommonStyles(metrics, settings);
	const photoDimensions = getPhotoSize(settings?.photo?.aspectRatio);
	const photoBorderRadius = settings?.photo?.borderRadius ?? 1;
	const linkColor = metrics.linkColor;

	const specificStyles = StyleSheet.create({
		page: { ...commonStyles.page, color: "#1a1a1a" },
		// Header section
		header: { marginBottom: 10 * metrics.singlePageMult, paddingBottom: 0 },
		headerTop: {
			flexDirection: "column",
			marginBottom: 6 * metrics.singlePageMult,
		},
		headerTopRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 12,
		},
		headerContent: {
			flex: 1,
			alignItems: "flex-start",
			justifyContent: "flex-start",
		},
		name: {
			...commonStyles.name,
			fontSize: (settings?.header.nameFontSize || 24) * metrics.finalScale,
			fontWeight:
				settings?.header.nameFontWeight === "heavy"
					? 800
					: settings?.header.nameFontWeight === "bold"
						? 700
						: 500,
			color: settings?.header.nameColor || "#000000",
			marginBottom: 8 * metrics.singlePageMult,
			textAlign: "left" as PdfTextAlign,
		},
		title: {
			...commonStyles.title,
			fontSize: 12 * metrics.finalScale,
			color: "#333333",
			fontWeight: "400",
			marginBottom: 8 * metrics.singlePageMult,
			textTransform:
				settings?.header.titleStyle === "uppercase" ? "uppercase" : "none",
			fontStyle: settings?.header.titleStyle === "italic" ? "italic" : "normal",
			letterSpacing: settings?.header.titleStyle === "uppercase" ? 0.5 : 0,
			textAlign: "left" as PdfTextAlign,
		},
		photoFrame: {
			width: photoDimensions.width,
			height: photoDimensions.height,
			borderRadius: photoBorderRadius,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#f5f5f5",
			overflow: "hidden",
			marginLeft: 8,
		},
		photoImage: {
			width: photoDimensions.width,
			height: photoDimensions.height,
			objectFit: "cover",
		},
		initials: {
			fontSize: 20 * metrics.finalScale,
			fontWeight: "bold",
			color: metrics.accent,
		},
		// Contact information
		contactSection: { marginBottom: 8 * metrics.singlePageMult },
		contactRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "flex-start",
			fontSize: 9 * metrics.finalScale,
			color: "#333333",
			lineHeight: 1.4,
			marginTop: 4 * metrics.singlePageMult,
		},
		contactItem: {
			marginRight: 12,
			flexDirection: "row",
			marginBottom: 4,
		},
		contactLabel: { fontWeight: "600", marginRight: 4, color: "#000000" },
		contactSeparator: { marginHorizontal: 8, color: "#cccccc" },
		linksRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "flex-start",
			marginTop: 4 * metrics.singlePageMult,
			gap: 8,
		},
		linkItem: {
			fontSize: 9 * metrics.finalScale,
			color: linkColor,
			textDecoration: "underline",
		},
		// Sections
		section: { marginBottom: metrics.sectionSpacing },
		sectionTitle: {
			...commonStyles.sectionTitle,
			fontSize: (settings?.sections?.titleFontSize || 12) * metrics.finalScale,
			fontWeight: "bold",
			color: settings?.sections?.titleColor || metrics.accent,
			marginBottom: 8 * metrics.singlePageMult,
			textTransform: "uppercase",
			letterSpacing: 0.5,
			paddingBottom: 4 * metrics.singlePageMult,
			borderBottomWidth: (settings?.header.dividerThickness || 1) as number,
			borderBottomColor: "#e5e7eb",
			borderStyle: "solid",
		},
		headerDivider: {
			...commonStyles.divider,
			marginTop: 10 * metrics.singlePageMult,
			marginBottom: 12 * metrics.singlePageMult,
		},
		// Timeline/List items
		entryContainer: {
			marginBottom: 10 * metrics.singlePageMult,
			pageBreakInside: "avoid",
		},
		entryHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
			marginBottom: 2,
		},
		entryTitle: {
			fontSize: 11 * metrics.finalScale,
			fontWeight: "bold",
			color: "#000000",
			flex: 1,
		},
		entrySubtitle: {
			fontSize: 10 * metrics.finalScale,
			color: "#333333",
			marginBottom: 2 * metrics.singlePageMult,
			fontWeight: "500",
		},
		entryDate: {
			fontSize: 9 * metrics.finalScale,
			color: "#666666",
			textAlign: "right" as PdfTextAlign,
			marginLeft: 8,
			fontWeight: "500",
		},
		entryMeta: {
			fontSize: 9 * metrics.finalScale,
			color: "#666666",
			marginBottom: 4 * metrics.singlePageMult,
			fontStyle: "italic",
		},
		bulletPoint: {
			flexDirection: "row",
			marginBottom: 4 * metrics.singlePageMult,
			marginLeft: 0,
		},
		bulletDot: {
			width: 4,
			height: 4,
			borderRadius: 2,
			backgroundColor: metrics.accent,
			marginRight: 8,
			marginTop: 5,
			flexShrink: 0,
		},
		bulletText: {
			fontSize: 10 * metrics.finalScale,
			color: "#333333",
			flex: 1,
			textAlign: metrics.textAlign,
			lineHeight: 1.4,
		},
		// Skills
		skillRow: {
			flexDirection: "row",
			marginBottom: 6 * metrics.singlePageMult,
			alignItems: "flex-start",
		},
		skillLabel: {
			fontSize: 10 * metrics.finalScale,
			fontWeight: "600",
			color: "#000000",
			minWidth: 80,
			marginRight: 12,
		},
		skillValues: {
			fontSize: 10 * metrics.finalScale,
			color: "#333333",
			flex: 1,
			textAlign: metrics.textAlign,
			lineHeight: 1.4,
		},
		// Languages
		languageRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 6 * metrics.singlePageMult,
			paddingBottom: 4 * metrics.singlePageMult,
			borderBottomWidth: 0.5,
			borderBottomColor: "#e5e7eb",
		},
		languageName: {
			fontSize: 10 * metrics.finalScale,
			fontWeight: "600",
			color: "#000000",
		},
		languageLevel: {
			fontSize: 9 * metrics.finalScale,
			color: "#666666",
			fontWeight: "500",
			textTransform: "uppercase",
		},
		// Descriptions
		descriptionText: {
			fontSize: 10 * metrics.finalScale,
			color: "#333333",
			textAlign: metrics.textAlign,
			lineHeight: 1.5,
			marginBottom: 4 * metrics.singlePageMult,
		},
		paragraph: {
			fontSize: 10 * metrics.finalScale,
			color: "#333333",
			textAlign: metrics.textAlign,
			lineHeight: metrics.lineSpacing,
		},
	});

	return {
		...commonStyles,
		...specificStyles,
		_finalScale: metrics.finalScale,
		_singlePageMult: metrics.singlePageMult,
		_accent: metrics.accent,
		linkColor,
	};
};

export function ClassicTemplate({
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
	lang,
	settings,
	color,
	sectionOrder,
}: ClassicTemplateProps) {
	const l = (lang === "br" ? "pt" : lang || "pt") as "pt" | "en" | "es";
	const styles = buildStyles(settings, color || "blue");
	const order = getSectionOrder(sectionOrder, customSections);

	const contactItems = [
		personalInfo?.phone && {
			label: "Tel",
			value:
				personalInfo.countryCode && personalInfo.phone
					? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}`
					: personalInfo.phone,
		},
		personalInfo?.email && { label: "Email", value: personalInfo.email },
		personalInfo?.city && {
			label: "City",
			value: [personalInfo.city, personalInfo.postalCode]
				.filter(Boolean)
				.join(" "),
		},
	].filter(Boolean) as { label: string; value: string }[];

	const photoSrc = settings?.photo?.enabled
		? settings.photo?.dataUrl || null
		: null;

	const SectionTitle = ({ label }: { label: string }) => (
		<Text style={styles.sectionTitle}>{label}</Text>
	);

	const TimelineItem = ({ children }: { children: React.ReactNode }) => (
		<View style={styles.entryContainer}>{children}</View>
	);

	const TimelineWrapper = ({ children, label }: SectionWrapperProps) => (
		<View style={styles.section}>
			<SectionTitle label={label} />
			{children}
		</View>
	);

	const renderProps = { styles, lang: l, settings };

	const LanguagesCustomRender = (
		langs: Language[],
		// biome-ignore lint/suspicious/noExplicitAny: Intentional loose typing for template compatibility
		currentStyles: any,
		currentLang: string,
	) => (
		<>
			{langs.map((langItem) => {
				const key = `${langItem.name}-${langItem.level}`;
				return (
					<View key={key} style={currentStyles.languageRow}>
						<Text style={currentStyles.languageName}>{langItem.name}</Text>
						<Text style={currentStyles.languageLevel}>
							{translateLanguageLevel(
								langItem.level,
								currentLang as "pt" | "en" | "es",
							)}
						</Text>
					</View>
				);
			})}
		</>
	);

	const renderSection = (sectionKey: import("../../types/cv").SectionKey) => {
		switch (sectionKey) {
			case "professional_summary":
				return renderSummarySection(resume, renderProps, SectionTitle);
			case "professional_experience":
				return renderExperienceSection(
					experiences,
					renderProps,
					SectionTitle,
					TimelineItem,
					TimelineWrapper,
				);
			case "academic_education":
				return renderEducationSection(
					education,
					renderProps,
					SectionTitle,
					TimelineItem,
					TimelineWrapper,
				);
			case "technical_skills":
				return renderSkillsSection(skills, renderProps, SectionTitle);
			case "languages":
				return renderLanguagesSection(
					languages,
					renderProps,
					SectionTitle,
					LanguagesCustomRender,
				);
			case "certifications":
				return renderCertificationsSection(
					certifications,
					renderProps,
					SectionTitle,
				);
			case "projects":
				return renderProjectsSection(projects, renderProps, SectionTitle);
			case "volunteer":
				return renderVolunteerSection(
					volunteers,
					renderProps,
					SectionTitle,
					TimelineItem,
					TimelineWrapper,
				);
			default:
				if (sectionKey.startsWith("custom_")) {
					const customId = sectionKey.replace("custom_", "");
					const section = (customSections || []).find(
						(cs) => cs.id === customId,
					);
					if (section) {
						return renderCustomSection(
							section,
							renderProps,
							SectionTitle,
							TimelineItem,
							TimelineWrapper,
						);
					}
				}
				return null;
		}
	};

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerTop}>
						<View style={styles.headerTopRow}>
							<View style={styles.headerContent}>
								<Text style={styles.name}>{personalInfo?.name}</Text>
								{personalInfo?.desiredRole && (
									<Text style={styles.title}>{personalInfo.desiredRole}</Text>
								)}

								{/* Contact Information */}
								<View style={styles.contactRow}>
									{contactItems.map((item) => (
										<View
											key={`${item.label}-${item.value}`}
											style={styles.contactItem}
										>
											<Text style={styles.contactLabel}>{item.label}:</Text>
											<Text>{item.value}</Text>
										</View>
									))}
								</View>

								{/* Social Links */}
								{links && links.length > 0 && (
									<View style={styles.linksRow}>
										{links.map((lnk) => {
											const linkKey = `${lnk.type}-${lnk.value}`;
											return (
												<Link
													key={linkKey}
													src={getSocialUrl(lnk.type, lnk.value)}
													style={styles.linkItem}
												>
													{lnk.hideLinkLabel
														? lnk.value
														: `${lnk.customName || lnk.type}: ${lnk.value}`}
												</Link>
											);
										})}
									</View>
								)}
							</View>

							{photoSrc && (
								<View style={styles.photoFrame}>
									{/* eslint-disable-next-line jsx-a11y/alt-text */}
									<Image src={photoSrc} style={styles.photoImage} />
								</View>
							)}
						</View>
					</View>
				</View>

				{/* Render sections dynamically */}
				{order.map((sectionKey) => (
					<React.Fragment key={sectionKey}>
						{renderSection(sectionKey)}
					</React.Fragment>
				))}
			</Page>
		</Document>
	);
}
