import { View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { EntryVariant } from "../../types/cv";
import type { CvStyleSheet } from "../../utils/template-styles";

export interface EntryFrame {
	/** Wraps a single entry */
	Item: (props: { children: ReactNode }) => ReactNode;
	/** Wraps the whole list of entries, e.g. to draw a timeline rail */
	List?: (props: { children: ReactNode }) => ReactNode;
}

/**
 * The frame one list section draws its entries in.
 *
 * This is chosen **per section**, so a CV can show experience as a timeline
 * while education stays a plain list. A new variant only needs a case here
 * plus its styles.
 */
export function buildEntryFrame(
	styles: CvStyleSheet,
	variant: EntryVariant,
): EntryFrame {
	switch (variant) {
		case "card":
			return {
				Item: ({ children }) => (
					<View style={styles.entryCard}>{children}</View>
				),
			};

		case "timeline":
			return {
				Item: ({ children }) => (
					<View style={styles.timelineItem}>
						<View style={styles.timelineBullet} />
						{children}
					</View>
				),
				List: ({ children }) => (
					<View style={styles.timelineRail}>{children}</View>
				),
			};

		default:
			return {
				Item: ({ children }) => (
					<View style={styles.entryPlain}>{children}</View>
				),
			};
	}
}
