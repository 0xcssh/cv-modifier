import type { NextConfig } from "next";

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
// - connect-src lists both prod (Railway) and dev (localhost:8000) backend
//   URLs plus R2 endpoints used by presigned uploads/downloads.
// - frame-ancestors 'none' is the modern replacement for X-Frame-Options,
//   but we keep X-Frame-Options: DENY for older browsers (belt-and-braces).
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://cv-modifier-production.up.railway.app http://localhost:8000 https://*.r2.cloudflarestorage.com https://*.r2.dev",
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
};

export default nextConfig;
