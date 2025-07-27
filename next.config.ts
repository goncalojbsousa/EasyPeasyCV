import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disables Next.js image optimization
  },
};

export default nextConfig;