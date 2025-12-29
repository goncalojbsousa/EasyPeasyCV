import {
	Document,
	Image,
	Link,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { Fragment, type ReactNode } from "react";
import type {
	CvColor,
	CvData,
	CvRenderSettings,
	Language,
	SectionKey,
} from "../../types/cv";
import {
	getSectionOrder,
	type PdfStyles,
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
	translateLabel,
	translateLanguageLevel,
} from "../../utils/template-helpers";
import {
	buildCommonStyles,
	computeMetrics,
	getPhotoSize,
	type PdfTextAlign,
} from "../../utils/template-styles";

interface TimelineTemplateProps extends CvData {
	lang?: string;
	settings?: CvRenderSettings;
	color?: CvColor;
}

const buildStyles = (settings?: CvRenderSettings, color: CvColor = "blue") => {
	const metrics = computeMetrics(settings, color);
	const commonStyles = buildCommonStyles(metrics, settings);
	const lineColor = "#e5e7eb";
	const photoDimensions = getPhotoSize(settings?.photo?.aspectRatio);
	const photoBorderRadius = settings?.photo?.borderRadius ?? 1;
	const linkColor = metrics.linkColor;

	const specificStyles = StyleSheet.create({
		page: { ...commonStyles.page, color: "#111827" },
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 12 * metrics.singlePageMult,
		},
		headerLeft: { flex: 1 },
		name: {
			...commonStyles.name,
			color: settings?.header.nameColor || "#0f172a",
			marginBottom: 8 * metrics.singlePageMult,
		},
		title: {
			...commonStyles.title,
			color: "#1f2937",
			marginBottom: 8 * metrics.singlePageMult,
		},
		contactRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			alignItems: "center",
		},
		contactItem: {
			flexDirection: "row",
			alignItems: "center",
			marginRight: 10,
			marginBottom: 4,
			fontSize: 9 * metrics.finalScale,
			color: "#374151",
		},
		contactLabel: { fontWeight: "bold", marginRight: 4 },
		contactSeparator: { marginRight: 8, color: "#9ca3af" },
		photoFrame: {
			width: photoDimensions.width,
			height: photoDimensions.height,
			borderRadius: photoBorderRadius,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#f8fafc",
			overflow: "hidden",
		},
		photoImage: {
			width: photoDimensions.width,
			height: photoDimensions.height,
			objectFit: "cover",
		},
		initials: {
			fontSize: 20 * metrics.finalScale,
			fontWeight: "bold",
			color: "#0f172a",
		},
		divider: {
			...commonStyles.divider,
			marginTop: 10 * metrics.singlePageMult,
			marginBottom: 12 * metrics.singlePageMult,
		},
		sectionTitleWrap: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 8 * metrics.singlePageMult,
		},
		sectionLine: {
			height: settings?.header.dividerThickness || 1,
			backgroundColor: lineColor,
			flex: 1,
			marginLeft: 8,
		},
		paragraph: {
			fontSize: 10 * metrics.finalScale,
			color: "#111827",
			textAlign: metrics.textAlign,
		},
		subText: {
			fontSize: 9 * metrics.finalScale,
			color: "#374151",
			textAlign: metrics.textAlign,
		},
		timelineWrap: {
			paddingLeft: 18,
			marginLeft: 8,
			borderLeftWidth: 1,
			borderLeftColor: lineColor,
		},
		timelineItem: {
			position: "relative",
			paddingLeft: 8,
			marginBottom: 12 * metrics.singlePageMult,
		},
		timelineBullet: {
			position: "absolute",
			width: 10,
			height: 10,
			borderRadius: 5,
			borderWidth: 2,
			borderColor: metrics.accent,
			backgroundColor: "#ffffff",
			left: -23.5,
			top: 0,
		},
		entryHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
			marginBottom: 2,
		},
		role: {
			fontSize: 11 * metrics.finalScale,
			fontWeight: "bold",
			color: "#0f172a",
		},
		company: {
			fontSize: 10 * metrics.finalScale,
			color: "#1f2937",
			marginBottom: 2,
		},
		date: {
			fontSize: 10 * metrics.finalScale,
			color: "#374151",
			textAlign: "right",
			marginLeft: 8,
		},
		bulletText: {
			marginLeft: 8,
			fontSize: 10 * metrics.finalScale,
			color: "#0f172a",
			textAlign: metrics.textAlign,
		},
		metaText: { fontSize: 9 * metrics.finalScale, color: "#4b5563" },
		langRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
		langName: {
			fontSize: 10 * metrics.finalScale,
			fontWeight: "bold",
			color: "#0f172a",
		},
		langDivider: {
			flex: 1,
			height: settings?.header.dividerThickness || 1,
			backgroundColor: lineColor,
			marginHorizontal: 6,
		},
		langLevel: {
			fontSize: 9 * metrics.finalScale,
			color: "#6b7280",
			textTransform: "uppercase",
		},
		centerText: { textAlign: "center" as PdfTextAlign },
		link: {
			fontSize: 9 * metrics.finalScale,
			color: linkColor,
			marginRight: 8,
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

type TemplateStyles = ReturnType<typeof buildStyles>;

export function TimelineTemplate({
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
}: TimelineTemplateProps) {
	const l = lang || "pt";
	const styles = buildStyles(settings, color || "blue");
	const order = getSectionOrder(sectionOrder, customSections);

	const contactItems = [
		personalInfo?.phone && {
			label: translateLabel("field.phone", l),
			value:
				personalInfo.countryCode && personalInfo.phone
					? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}`
					: personalInfo.phone,
		},
		personalInfo?.email && {
			label: translateLabel("field.email", l),
			value: personalInfo.email,
		},
		personalInfo?.city && {
			label: translateLabel("field.city", l),
			value: [personalInfo.city, personalInfo.postalCode]
				.filter(Boolean)
				.join(" "),
		},
	].filter(Boolean) as { label: string; value: string }[];

	const photoSrc = settings?.photo?.enabled
		? settings.photo?.dataUrl || null
		: null;

	const SectionTitle = ({ label }: { label: string }) => (
		<View style={styles.sectionTitleWrap}>
			<Text style={styles.sectionTitle}>{label}</Text>
			<View style={styles.sectionLine} />
		</View>
	);

	const TimelineItem = ({ children }: { children: ReactNode }) => (
		<View style={styles.timelineItem}>
			<View style={styles.timelineBullet} />
			{children}
		</View>
	);

	const TimelineWrapper = ({ children, label }: SectionWrapperProps) => (
		<View style={styles.section}>
			<View style={styles.sectionTitleWrap}>
				<Text style={styles.sectionTitle}>{label}</Text>
				<View style={styles.sectionLine} />
			</View>
			<View style={styles.timelineWrap}>{children}</View>
		</View>
	);

	const renderProps = { styles, lang: l, settings };

	const LanguagesCustomRender = (
		languages: Language[],
		_styles: PdfStyles,
		lang: string,
	) => {
		const styles = _styles as TemplateStyles;
		return (
			<>
				{languages.map((langItem) => (
					<View
						key={`${langItem.name}-${langItem.level}`}
						style={styles.langRow}
					>
						<Text style={styles.langName}>{langItem.name}</Text>
						<View style={styles.langDivider} />
						<Text style={styles.langLevel}>
							{translateLanguageLevel(
								langItem.level,
								lang === "pt" ? "pt" : lang === "es" ? "es" : "en",
							)}
						</Text>
					</View>
				))}
			</>
		);
	};

	const renderSection = (sectionKey: SectionKey) => {
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
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text style={styles.name}>{personalInfo?.name}</Text>
						{personalInfo?.desiredRole ? (
							<Text style={styles.title}>{personalInfo.desiredRole}</Text>
						) : null}
						{contactItems.length > 0 ? (
							<View style={styles.contactRow}>
								{contactItems.map((item, idx) => (
									<Fragment key={`${item.label}-${item.value}`}>
										<Text style={styles.contactItem}>
											<Text style={styles.contactLabel}>{item.label}:</Text>{" "}
											{item.value}
										</Text>
										{idx < contactItems.length - 1 ? (
											<Text style={styles.contactSeparator}>|</Text>
										) : null}
									</Fragment>
								))}
							</View>
						) : null}
						{links && links.length > 0 ? (
							<View
								style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}
							>
								{links.map((lnk) => (
									<Link
										key={`${lnk.type}-${lnk.value}`}
										src={getSocialUrl(lnk.type, lnk.value)}
										style={styles.link}
									>
										{lnk.hideLinkLabel
											? lnk.value
											: `${lnk.customName || lnk.type}: ${lnk.value}`}
									</Link>
								))}
							</View>
						) : null}
					</View>
					{photoSrc ? (
						<View style={styles.photoFrame}>
							{/* eslint-disable-next-line jsx-a11y/alt-text */}
							<Image src={photoSrc} style={styles.photoImage} />
						</View>
					) : null}
				</View>

				{order.map((sectionKey) => (
					<Fragment key={sectionKey}>{renderSection(sectionKey)}</Fragment>
				))}
			</Page>
		</Document>
	);
}
