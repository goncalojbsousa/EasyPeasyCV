import type { Metadata } from "next";
import type { Locale } from "../translations";

export const SITE_URL = "https://www.easypeasycv.com";

/** Open Graph locale tags. */
export const OG_LOCALES: Record<Locale, string> = {
	en: "en_US",
	pt: "pt_PT",
	br: "pt_BR",
	es: "es_ES",
};

export type LocalizedCopy = Record<
	Locale,
	{ title: string; description: string }
>;

/**
 * Metadata of a page below /[locale], e.g. /pt/faq.
 *
 * A page that sets `openGraph` replaces the whole block inherited from the
 * locale layout, so it is rebuilt complete here — including the localized
 * preview image, which would otherwise be lost on every page but the home.
 */
export function localizedPageMetadata(
	locale: string,
	segment: string,
	copy: LocalizedCopy,
): Metadata {
	const { title, description } = copy[locale as Locale] ?? copy.en;
	const path = `/${locale}/${segment}`;

	return {
		title,
		description,
		openGraph: {
			title: `${title} | EasyPeasyCV`,
			description,
			url: `${SITE_URL}${path}`,
			siteName: "EasyPeasyCV",
			locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
			type: "website",
			images: [
				{
					url: `/${locale}/opengraph-image`,
					width: 1200,
					height: 630,
					alt: "EasyPeasyCV",
				},
			],
		},
		alternates: {
			canonical: path,
			languages: {
				en: `/en/${segment}`,
				pt: `/pt/${segment}`,
				"pt-BR": `/br/${segment}`,
				es: `/es/${segment}`,
			},
		},
	};
}
