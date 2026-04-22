// Next.js 16 server-side instrumentation entry point.
// Must live at the project root (or src/). Next calls `register()` once per
// server instance startup. We dispatch on NEXT_RUNTIME so the Node SDK is
// only loaded in the Node.js server and the edge SDK in the edge runtime.
//
// See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
