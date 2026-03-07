import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Next.js configuration
 * Defines build settings and optimizations for the EasyPeasyCV application
 */
const nextConfig: NextConfig = {
	images: {
		unoptimized: true, // Disables Next.js image optimization
	},
};

export default withNextIntl(nextConfig);
