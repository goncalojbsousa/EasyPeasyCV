import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.easypeasycv.com";
	const now = new Date();
	const locales = ["en", "pt", "br", "es"];
	const localizedPaths = ["", "/builder", "/privacy", "/terms"];

	const sitemapEntries: MetadataRoute.Sitemap = [];

	for (const path of localizedPaths) {
		const route = path === "" ? "" : path;

		const languages: Record<string, string> = {};

		for (const locale of locales) {
			languages[locale] = `${baseUrl}/${locale}${route}`;
		}

		for (const locale of locales) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}${route}`,
				lastModified: now,
				changeFrequency:
					path === "" ? "weekly" : path === "/builder" ? "weekly" : "yearly",
				priority: path === "" ? 1 : path === "/builder" ? 0.9 : 0.3,
				alternates: {
					languages,
				},
			});
		}
	}

	return sitemapEntries;
}
