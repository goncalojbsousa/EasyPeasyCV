import { Document, Page } from "@react-pdf/renderer";
import { Fragment } from "react";
import type { CvData, CvStyleSettings } from "../../types/cv";
import {
	getSectionOrder,
	renderSectionByKey,
	type SectionRenderProps,
} from "../../utils/section-renderers";
import { buildCvStyles } from "../../utils/template-styles";
import { CvHeader } from "./cv_header";
import { buildSectionTitle } from "./section_title";

interface CvRendererProps {
	data: CvData;
	lang: string;
	style: CvStyleSettings;
}

/**
 * The single CV renderer.
 *
 * Replaces the three hand-written themes: every visual difference they used to
 * encode is now a value in `style`, so the document is assembled from the
 * variant pieces the user picked.
 */
export function CvRenderer({ data, lang, style }: CvRendererProps) {
	const styles = buildCvStyles(data.settings, data.color ?? "blue", style);
	const SectionTitle = buildSectionTitle(styles, style.sectionTitle.variant);
	const order = getSectionOrder(data.sectionOrder, data.customSections);

	const renderProps: SectionRenderProps = {
		styles,
		lang,
		settings: data.settings,
		style,
		SectionTitle,
	};

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<CvHeader
					personalInfo={data.personalInfo}
					links={data.links}
					lang={lang}
					styles={styles}
					style={style}
					settings={data.settings}
				/>

				{order.map((sectionKey) => (
					<Fragment key={sectionKey}>
						{renderSectionByKey(sectionKey, data, renderProps)}
					</Fragment>
				))}
			</Page>
		</Document>
	);
}
