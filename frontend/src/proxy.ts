import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Noindex Vercel preview deployments (*.vercel.app) to avoid duplicate
// content with the production domain cvmodifier.com. The production host
// is never affected — only preview hosts carry the X-Robots-Tag header.
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const res = NextResponse.next();
  if (host.endsWith(".vercel.app")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  // Exclude Next internals and static image assets. /api/* still traverses
  // the proxy — that's fine, we only add a response header, we don't rewrite
  // or redirect, so the Vercel rewrite to Railway still applies.
  matcher: "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
};
