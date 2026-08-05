import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Changes on every Vercel deploy, so it doubles as a cache-busting query
// param for /public assets whose filename stays the same but content changes.
const ASSET_VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ASSET_VERSION: ASSET_VERSION,
  },
  async redirects() {
    // Fixes a marketing email that shipped links with a stray trailing ")"
    // e.g. https://kvum-website.vercel.app/ko/) -> /ko/
    // Covers both the literal ")" and its percent-encoded form "%29",
    // in case an edge/proxy hop leaves the path un-decoded.
    const locales = ['ko', 'en', 'ja', 'zh'];
    return locales.map(locale => ({
      source: `/${locale}/:trailing(\\)|%29)`,
      destination: `/${locale}/`,
      permanent: false,
    }));
  },
};

export default withNextIntl(nextConfig);
