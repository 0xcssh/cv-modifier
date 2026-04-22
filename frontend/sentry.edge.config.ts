// Sentry edge-runtime config.
// Loaded from instrumentation.ts when NEXT_RUNTIME === "edge".
// Covers middleware and any route handlers that opt into the edge runtime.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
