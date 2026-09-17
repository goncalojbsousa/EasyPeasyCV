import { routing } from "../../navigation";
import { renderSocialImage } from "../components/social_image";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export const alt = "EasyPeasyCV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Same card as the Open Graph image, for X/Twitter's own meta tags. */
export default async function TwitterImage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	return renderSocialImage(locale);
}
