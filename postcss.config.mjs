const config = {
  plugins: {
    // Tailwind v4 is compiled through PostCSS so it runs for BOTH bundlers:
    // `next dev` (Turbopack) and `next build --webpack` (used because Serwist's
    // InjectManifest plugin requires the webpack build).
    "@tailwindcss/postcss": {},
  },
};

export default config;
