import type { NextConfig } from "next";
import { InjectManifest } from "@serwist/webpack-plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind v4 is compiled via postcss.config.mjs (`@tailwindcss/postcss`),
  // which both Turbopack (dev) and webpack (prod build) pick up. A
  // `turbopack.rules` CSS loader is deliberately not used here: it only
  // applies to Turbopack, so `next build --webpack` would emit unstyled CSS.
  // Empty `turbopack` config silences Next 16's "webpack config but no
  // turbopack config" guard; there are no Turbopack-specific options left.
  turbopack: {},
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
        {
          key: "Service-Worker-Allowed",
          value: "/",
        },
      ],
    },
  ],
  webpack: (config, { buildId, dev, isServer, webpack }) => {
    // The SW is only built for the client production compilation: in dev it
    // would point at uncompilable dev assets (Serwist's plugin uses a webpack
    // child compilation), and the server compilation has no client assets to
    // precache. In dev, registration is skipped server-side so users get a
    // normal, cacheless dev experience.
    if (isServer || dev) {
      return config;
    }

    config.plugins.push(
      new InjectManifest({
        // Serwist compiles the SW in a child compilation using its own
        // bundled webpack, so this must be a plain path (no Turbopack
        // interpolation tokens).
        swSrc: "./app/sw.ts",
        swDest: "../public/sw.js",
        // Precache the app shell + generated client assets. `public/*` files
        // (icons, etc.) are content-hashed at build so we list them with a
        // build revision.
        additionalPrecacheEntries: [
          { url: "/", revision: buildId },
          { url: "/mission", revision: buildId },
          { url: "/journal", revision: buildId },
          { url: "/~offline", revision: buildId },
          { url: "/manifest.webmanifest", revision: buildId },
          { url: "/icons/icon-192.png", revision: buildId },
          { url: "/icons/icon-512.png", revision: buildId },
          { url: "/icons/maskable-192.png", revision: buildId },
          { url: "/icons/maskable-512.png", revision: buildId },
        ],
        exclude: [
          /\.(?:map|txt|md)$/i,
          /^server\//,
          /^[^/]*\.json$/,
          /^manifest\..*\.js$/,
          // Pages Router manifests: unused by this App-Router-only app and
          // not served by the Next server (404) — they would fail install.
          /^_buildManifest\.js$/,
          /^_ssgManifest\.js$/,
          /^static\/(?:[^/]+)\/_?(?:build|ssg)Manifest\.js$/,
        ],
      }),
    );

    // Silence @types/webpack types mismatch with Next's bundled webpack.
    // `sandbox: true` - Next needs this since it uses its own bundled webpack
    // here due to the SW child compilation running within the same process.
    void webpack;

    return config;
  },
};

export default nextConfig;
