import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', // For local development
        '*.app.github.dev', // Wildcard for Codespaces domains
      ],
    },
  },
};

export default nextConfig;