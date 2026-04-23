import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content Security Policy — enforced (not report-only).
// - 'unsafe-inline' on script-src: required because Next.js runtime injects
//   inline bootstrap/hydration scripts and we are not using nonces here.
// - 'unsafe-eval' on script-src: required by React in development (eval is
//   used for enhanced error stacks). Not strictly needed in production, but
//   kept for a single consistent policy across environments.
// - 'unsafe-inline' on style-src: required by Tailwind/shadcn runtime styles
//   and component libraries that inject inline <style> tags.
// - img-src permissive (https:) so presigned Cloudflare R2 URLs for user
//   photos work regardless of the exact R2 hostname variant (*.r2.dev,
//   *.r2.cloudflarestorage.com, or a custom domain).
// - frame-src 'self' blob: is required by the PDF preview iframe in
//   dashboard/generate/[id]/edit which loads generated PDFs as blob URLs.
// - connect-src only needs 'self' in prod because API calls go through the
//   Vercel rewrite (/api/* -> Railway, but the browser sees cvmodifier.com).
//   localhost:8000 kept for local dev, plus R2 endpoints used by presigned
//   uploads/downloads.
// - frame-ancestors 'none' is the modern replacement for X-Frame-Options,
//   but we keep X-Frame-Options: DENY for older browsers (belt-and-braces).
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' http://localhost:8000 https://*.r2.cloudflarestorage.com https://*.r2.dev https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io",
  "frame-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

const contentSecurityPolicy = cspDirectives.join("; ");

const isProduction = process.env.NODE_ENV === "production";

const securityHeaders: { key: string; value: string }[] = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// HSTS only on production — shipping it on localhost would force the
// browser to upgrade local http:// requests to https:// and break dev.
if (isProduction) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Force www.cvmodifier.com → cvmodifier.com (apex = canonical target).
  // Code-level safety net in case Vercel's domain redirect config drifts.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cvmodifier.com" }],
        destination: "https://cvmodifier.com/:path*",
        permanent: true,
      },
    ];
  },
};

// Wrap the Next config with Sentry's webpack plugin. It injects the client
// SDK via sentry.client.config.ts and (when SENTRY_AUTH_TOKEN / SENTRY_ORG /
// SENTRY_PROJECT are provided) uploads source maps so stack traces in the
// Sentry UI are readable. Those env vars are optional: when unset, source
// map upload is silently skipped — local dev builds keep working.
export default withSentryConfig(nextConfig, {
  silent: true, // don't pollute build output
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
});
