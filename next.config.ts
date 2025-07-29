import type { NextConfig } from "next";

/**
 * Next.js configuration
 * Defines build settings and optimizations for the CV Builder application
 */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disables Next.js image optimization
  },
};

export default nextConfig;