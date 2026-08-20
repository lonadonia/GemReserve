import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_592_000,
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
