import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================
  // MOBILE / LAN NETWORK TESTING COMPATIBILITY
  // Allows iPhone/Android on same WiFi to access dev server
  // via local IP (e.g. 172.20.10.5:3000) without React
  // event system being blocked by Next.js origin checks.
  // Without this, buttons render but clicks never fire on mobile.
  // ============================================================
  allowedDevOrigins: [
    "172.20.10.5",
    "172.20.10.5:3000",
    "0.0.0.0",
    "0.0.0.0:3000",
    "localhost:3000",
    "192.168.1.*",
    "192.168.0.*",
    "10.0.0.*",
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.20.*.*",
    "172.21.*.*",
    "172.22.*.*",
    "172.23.*.*",
    "172.24.*.*",
    "172.25.*.*",
    "172.26.*.*",
    "172.27.*.*",
    "172.28.*.*",
    "172.29.*.*",
    "172.30.*.*",
    "172.31.*.*",
  ], // Ensure SQLite dev.db is included in Vercel serverless function bundles
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"],
  },

  // Serve static images directly without proxy failures on mobile Safari or LAN testing
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
