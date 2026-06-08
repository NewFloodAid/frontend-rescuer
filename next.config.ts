import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" is only needed for Docker self-hosting.
  // Vercel handles this automatically — no output config needed.
  // For Docker deployment, uncomment: output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    // In production (Vercel), proxy /api/* to the backend server.
    // NEXT_PUBLIC_API_BASE_URL should be set to "/api" on Vercel,
    // and the rewrite sends it to the actual backend.
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
