import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: undefined,
      allowedOrigins: undefined,
    },
  },
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
};

export default nextConfig;
