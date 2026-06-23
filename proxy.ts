import { NextRequest, NextResponse } from "next/server";

/**
 * In-process rate limiter for /api/* routes.
 *
 * Effective for single-node deployments (next start on a single Debian server).
 * For production clusters or behind a load balancer, replace with a Redis-backed
 * implementation or rely exclusively on Nginx limit_req (see security/01-infra-nginx.md).
 *
 * When Nginx is active: this middleware acts as a secondary defense-in-depth layer.
 * Its limits are intentionally higher than Nginx's to avoid interfering with legitimate
 * proxied traffic while still blocking extreme abuse.
 */

const WINDOW_MS   = 60_000;  // 1-minute sliding window
const MAX_PER_WIN = 120;     // requests per IP per window (reduce to 60 if no Nginx in front)

const counters = new Map<string, { n: number; reset: number }>();

function pruneStale(now: number) {
  for (const [ip, entry] of counters) {
    if (now > entry.reset) counters.delete(ip);
  }
}

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const now = Date.now();

  // Prune stale entries periodically to prevent the Map from growing unboundedly.
  if (counters.size > 5_000) pruneStale(now);

  const entry = counters.get(ip) ?? { n: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) { entry.n = 0; entry.reset = now + WINDOW_MS; }
  entry.n++;
  counters.set(ip, entry);

  if (entry.n > MAX_PER_WIN) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((entry.reset - now) / 1000)),
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
