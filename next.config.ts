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
  images:{
    domains: ['fnyyupkfdmpoemcudpsl.supabase.co', 'localhost:3000', '*.app.github.dev']
  }
};

export default nextConfig;