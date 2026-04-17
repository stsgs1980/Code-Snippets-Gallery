/**
 * Simple API key authentication for mutation endpoints.
 * In production, use a proper auth system (NextAuth, etc.).
 */

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

/**
 * Validate API key from request headers.
 * Returns true if auth passes (no key configured = open in dev).
 */
export function validateApiKey(request: Request): boolean {
  // No key configured = development mode, allow all
  if (!ADMIN_API_KEY) return true;

  const authHeader = request.headers.get('authorization');
  const queryKey = new URL(request.url).searchParams.get('api_key');

  const providedKey =
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null) || queryKey;

  // Constant-time comparison to prevent timing attacks
  if (!providedKey || providedKey.length !== ADMIN_API_KEY.length) return false;

  let result = 0;
  for (let i = 0; i < providedKey.length; i++) {
    result |= providedKey.charCodeAt(i) ^ ADMIN_API_KEY.charCodeAt(i);
  }
  return result === 0;
}
