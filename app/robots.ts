import type { MetadataRoute } from "next";
import { SITE_URL } from "./utils/page-metadata";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = SITE_URL;
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
