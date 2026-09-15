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
import type { CvColor, CvRenderSettings, SectionKey } from "../../types/cv";
import {
	getSectionOrder,
	renderSectionByKey,
	type TemplateProps,
} from "../../utils/section-renderers";
import type { ContactItem } from "../../utils/template-helpers";
import { buildContactItems, getSocialUrl } from "../../utils/template-helpers";
import {
	buildCommonStyles,
	computeMetrics,
	getPhotoSize,
} from "../../utils/template-styles";

type ProfessionalTemplateProps = TemplateProps;

const buildStyles = (settings?: CvRenderSettings, color: CvColor = "blue") => {
	const metrics = computeMetrics(settings, color);
	const commonStyles = buildCommonStyles(metrics, settings);
	const photoSize = getPhotoSize(settings?.photo?.aspectRatio);
	const photoBorderRadius = settings?.photo?.borderRadius ?? 1;
	const linkColor = metrics.linkColor;

	const specificStyles = StyleSheet.create({
		header: {
			flexDirection: "column",
			marginBottom: 8 * metrics.singlePageMult,
		},
		headerRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		contactRow: {
			flexDirection: "row",
			justifyContent: "center",
			flexWrap: "wrap",
			color: "#000000",
			fontSize: 9 * metrics.finalScale,
			marginBottom: 6 * metrics.singlePageMult,
		},
		contactItem: {
			marginHorizontal: 6,
			flexDirection: "row",
			alignItems: "center",
		},
		contactLabel: { fontWeight: "bold", marginRight: 4, color: "#000000" },
		contactSeparator: { marginHorizontal: 6, color: "#e5e7eb" },
		headerLeft: { flex: 1, alignItems: "center" },
		sectionTitle: {
			...commonStyles.sectionTitle,
			textAlign: "center",
			textTransform: "uppercase",
		},
		eduItem: { marginBottom: 8 * metrics.singlePageMult },
		educationMeta: {
			fontSize: 9 * metrics.finalScale,
			color: "#000000",
			marginTop: 2,
		},
		skills: {
			textAlign: "center",
			color: "#000000",
			fontSize: 10 * metrics.finalScale,
		},
		photo: {
			width: photoSize.width,
			height: photoSize.height,
			borderRadius: photoBorderRadius,
			marginLeft: 10,
		},
		photoImage: {
			width: photoSize.width,
			height: photoSize.height,
			objectFit: "cover",
			borderRadius: photoBorderRadius,
		},
	});

	return {
		...commonStyles,
		...specificStyles,
		_finalScale: metrics.finalScale,
		_singlePageMult: metrics.singlePageMult,
		linkColor,
	};
};

export function ProfessionalTemplate(cv: ProfessionalTemplateProps) {
	const { personalInfo, links, settings, lang, color } = cv;
	const l = lang || "pt";
	const styles = buildStyles(settings, color || "blue");
	const linkColor = styles.linkColor || "#2563eb";
	const order = getSectionOrder(cv.sectionOrder, cv.customSections);
	const contactItems = buildContactItems(personalInfo, l);

	const SectionTitle = ({ label }: { label: string }) => (
		<Text style={styles.sectionTitle}>{label}</Text>
	);

	const renderProps = { styles, lang: l, settings };

	const renderSection = (sectionKey: SectionKey) =>
		renderSectionByKey(sectionKey, cv, renderProps, SectionTitle, {
			skillsTextStyle: styles.skills,
		});

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<View style={styles.headerRow}>
						<View style={styles.headerLeft}>
							<Text style={styles.name}>{personalInfo?.name}</Text>
							{personalInfo?.desiredRole && (
								<Text style={styles.title}>{personalInfo.desiredRole}</Text>
							)}
							{contactItems.length > 0 && (
								<View style={styles.contactRow}>
									{contactItems.map((item: ContactItem) => {
										const key = `${item.label}-${item.value}`;
										return (
											<React.Fragment key={key}>
												<Text style={styles.contactItem}>
													<Text style={styles.contactLabel}>{item.label}:</Text>{" "}
													{item.value}
												</Text>
											</React.Fragment>
										);
									})}
								</View>
							)}
							{/* Social Links */}
							{links && links.length > 0 && (
								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										flexWrap: "wrap",
										marginTop: 2,
									}}
								>
									{links.map((lnk, idx) => {
										const linkKey = `${lnk.type}-${lnk.value}-${idx}`;
										return (
											<Link
												key={linkKey}
												src={getSocialUrl(lnk.type, lnk.value)}
												style={{
													fontSize: 9,
													color: linkColor,
													marginHorizontal: 6,
												}}
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
						{settings?.photo?.enabled && settings?.photo?.dataUrl ? (
							<View style={styles.photo}>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image src={settings.photo.dataUrl} style={styles.photoImage} />
							</View>
						) : null}
					</View>
					<View style={styles.divider} />
				</View>

				{/* Render sections dynamically based on sectionOrder */}
				{order.map((sectionKey) => renderSection(sectionKey))}
			</Page>
		</Document>
	);
}
