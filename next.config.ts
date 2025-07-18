import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all domains
      },
      {
        protocol: "http",
        hostname: "**", // Allow all domains
      },
    ],
  },
};

export default nextConfig;
