// Sentry server-side config (Node.js runtime).
// Loaded from instrumentation.ts when NEXT_RUNTIME === "nodejs".
// Captures unhandled errors thrown in Server Components, Route Handlers,
// Server Actions, and the Node runtime middleware.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
      (process.env.NODE_ENV === "production" ? "production" : "development"),
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
