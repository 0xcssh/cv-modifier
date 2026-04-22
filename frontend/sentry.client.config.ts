// Sentry client-side config.
// Loaded automatically by @sentry/nextjs via the webpack plugin configured
// in next.config.ts. Initializes the browser SDK that captures unhandled
// errors and rejections in React client components.
//
// Intentionally a no-op when NEXT_PUBLIC_SENTRY_DSN is not set so local dev
// and preview envs without Sentry configured behave exactly as before.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
      (process.env.NODE_ENV === "production" ? "production" : "development"),
    tracesSampleRate: 0.1,
    // RGPD: no session replays unless explicitly opted-in
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
  });
}
