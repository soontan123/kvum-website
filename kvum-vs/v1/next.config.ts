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
};

export default withNextIntl(nextConfig);
