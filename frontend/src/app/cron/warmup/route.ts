// Vercel Cron warmup — pings the Railway backend every 5 min so the
// container never goes to sleep on the Hobby plan. Without this, the
// first generation of the day pays a ~30-45 s cold start tax.
//
// Vercel calls this at the schedule defined in vercel.json. The route
// just forwards a GET to /health on Railway and returns the JSON.
//
// Note: this path lives outside `/api/*` so the apex rewrite to Railway
// in vercel.json doesn't intercept it.

const RAILWAY_HEALTH = "https://cv-modifier-production.up.railway.app/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  try {
    const res = await fetch(RAILWAY_HEALTH, {
      method: "GET",
      cache: "no-store",
      // Short timeout so the cron itself doesn't hang Vercel; if Railway
      // takes more than 15 s we still want a quick response with the error.
      signal: AbortSignal.timeout(15_000),
    });
    const elapsed = Date.now() - start;
    return Response.json({
      ok: res.ok,
      status: res.status,
      elapsed_ms: elapsed,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        elapsed_ms: Date.now() - start,
      },
      { status: 502 },
    );
  }
}
