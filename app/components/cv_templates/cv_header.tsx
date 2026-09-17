import { Image, Link, Text, View } from "@react-pdf/renderer";
import { Fragment } from "react";
import type {
	Link as CvLink,
	CvRenderSettings,
	CvStyleSettings,
	PersonalInfo,
} from "../../types/cv";
import type { ContactItem } from "../../utils/template-helpers";
import { buildContactItems, getSocialUrl } from "../../utils/template-helpers";
import type { CvStyleSheet } from "../../utils/template-styles";

interface CvHeaderProps {
	personalInfo?: PersonalInfo;
	links?: CvLink[];
	lang: string;
	styles: CvStyleSheet;
	style: CvStyleSettings;
	settings?: CvRenderSettings;
}

/** One "Label: value" contact pair. */
function ContactPair({
	item,
	styles,
	stacked,
}: {
	item: ContactItem;
	styles: CvStyleSheet;
	stacked: boolean;
}) {
	return (
		<View style={stacked ? styles.contactItemStacked : styles.contactItem}>
			<Text style={styles.contactLabel}>{item.label}:</Text>
			<Text>{item.value}</Text>
		</View>
	);
}

/**
 * Personal information block.
 *
 * Alignment, contact layout and the trailing rule are independent options, so
 * any combination is renderable — e.g. a centred name with stacked contacts.
 */
export function CvHeader({
	personalInfo,
	links,
	lang,
	styles,
	style,
	settings,
}: CvHeaderProps) {
	const contactItems = buildContactItems(personalInfo, lang);
	const photoSrc = settings?.photo?.enabled
		? settings.photo?.dataUrl || null
		: null;
	const stacked = style.header.contact === "stacked";

	return (
		<View style={styles.header}>
			<View style={styles.headerRow}>
				<View style={styles.headerMain}>
					<Text style={[styles.name, styles.headerText]}>
						{personalInfo?.name}
					</Text>
					{personalInfo?.desiredRole && (
						<Text style={[styles.title, styles.headerText]}>
							{personalInfo.desiredRole}
						</Text>
					)}

					{contactItems.length > 0 && (
						<View style={stacked ? styles.contactStack : styles.contactWrap}>
							{contactItems.map((item, idx) => (
								<Fragment key={`${item.label}-${item.value}`}>
									<ContactPair item={item} styles={styles} stacked={stacked} />
									{style.header.contact === "separated" &&
										idx < contactItems.length - 1 && (
											<Text style={styles.contactSeparator}>|</Text>
										)}
								</Fragment>
							))}
						</View>
					)}

					{links && links.length > 0 && (
						<View style={styles.linksWrap}>
							{links.map((lnk, idx) => (
								<Link
									key={`${lnk.type}-${lnk.value}-${idx}`}
									src={getSocialUrl(lnk.type, lnk.value)}
									style={styles.link}
								>
									{lnk.hideLinkLabel
										? lnk.value
										: `${lnk.customName || lnk.type}: ${lnk.value}`}
								</Link>
							))}
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

			{style.header.divider && <View style={styles.headerDivider} />}
		</View>
	);
}
