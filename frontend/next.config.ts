import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

/**
 * Initialize the Serwist PWA Wrapper.
 */
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/**
 * Main Next.js Configuration
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    /* Replaced deprecated 'domains' with secure 'remotePatterns' */
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: 's3.igs.mywire.org',
      },
      {
        protocol: 'https',
        hostname: 's3.igs.mywire.org',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  /* Silences the Turbopack error caused by Serwist's Webpack injection */
  turbopack: {},

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return {
      // Force Vercel to route the API traffic before it checks for Next.js pages
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://gmc-talent-lens-backend.vercel.app/api/:path*'
        }
      ]
    };
  }
};

export default withSerwist(nextConfig);