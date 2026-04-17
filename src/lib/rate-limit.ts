/**
 * Simple in-memory rate limiter.
 * Tracks requests per IP address with a sliding window.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const entries = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate-limited.
 * Returns true if the request exceeds the limit.
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = entries.get(key);

  if (!entry || now >= entry.resetTime) {
    entries.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > maxRequests;
}

/**
 * Get remaining requests for a given key.
 */
export function getRateLimitRemaining(
  key: string,
  maxRequests: number,
  windowMs: number
): number {
  const now = Date.now();
  const entry = entries.get(key);

  if (!entry || now >= entry.resetTime) return maxRequests;
  return Math.max(0, maxRequests - entry.count);
}

// Periodic cleanup to prevent memory leaks (every 5 minutes)
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (now >= entry.resetTime) entries.delete(key);
    }
  }, 5 * 60 * 1000);
}
