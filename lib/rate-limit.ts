// Simple in-memory rate limiter — resets on server restart
// Good enough for a single-instance deployment; use Redis/Upstash for multi-instance

interface RateLimitEntry {
  count:     number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Returns true if the request should be allowed, false if rate limited.
 * @param key      Unique identifier (e.g. IP + route)
 * @param limit    Max requests per window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now  = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
