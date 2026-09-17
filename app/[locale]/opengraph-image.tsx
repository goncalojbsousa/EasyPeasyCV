import { routing } from "../../navigation";
import { renderSocialImage } from "../components/social_image";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export const alt = "EasyPeasyCV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link preview in the page's language, inherited by every page below. */
export default async function OpenGraphImage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	return renderSocialImage(locale);
}
