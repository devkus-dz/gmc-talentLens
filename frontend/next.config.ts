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
        hostname: 'talentlens-bucket.s3.localhost.localstack.cloud',
      },
      {
        protocol: 'https',
        hostname: 'talentlens-bucket.s3.localhost.localstack.cloud',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  /* Silences the Turbopack error caused by Serwist's Webpack injection */
  turbopack: {},
};

export default withSerwist(nextConfig);