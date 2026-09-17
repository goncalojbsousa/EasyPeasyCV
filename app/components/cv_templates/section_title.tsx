import { Text, View } from "@react-pdf/renderer";
import type { SectionTitleVariant } from "../../types/cv";
import type { CvStyleSheet } from "../../utils/template-styles";

/**
 * Section heading, drawn in one of the available variants.
 *
 * This is a **global** choice on purpose: a CV where each section announces
 * itself differently reads as a mistake, so the same variant is used
 * everywhere. Adding a variant means adding a case here plus its styles.
 */
export function buildSectionTitle(
	styles: CvStyleSheet,
	variant: SectionTitleVariant,
) {
	return function SectionTitle({ label }: { label: string }) {
		switch (variant) {
			case "ruled":
				return (
					<View style={styles.titleRuled}>
						<Text style={styles.titleTextAligned}>{label}</Text>
					</View>
				);

			case "inlineRule":
				return (
					<View style={styles.titleInlineRow}>
						{/* Unaligned on purpose: textAlign would make the text fill
						    the row, leaving no space for the rule beside it. */}
						<Text style={styles.titleText}>{label}</Text>
						<View style={styles.titleInlineRule} />
					</View>
				);

			case "block":
				return (
					<View style={styles.titleBlock}>
						<Text style={styles.titleTextAligned}>{label}</Text>
					</View>
				);

			default:
				return (
					<View style={styles.titlePlain}>
						<Text style={styles.titleTextAligned}>{label}</Text>
					</View>
				);
		}
	};
}
