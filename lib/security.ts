import { timingSafeEqual } from "node:crypto";

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export const MAX_BODY_SIZE_BYTES = 64 * 1024;
export const MAX_TEXT_FIELD_LENGTH = 2000;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_FRAMES = 12;

export function constantTimeEqual(a: string, b: string) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  try {
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function isSafeRedirectPath(target: string, allowed: string[]) {
  const normalized = target.trim();
  return allowed.includes(normalized);
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  request: Request,
  keyPrefix: string,
  limit = 20,
  windowMs = 60_000,
) {
  const key = `${keyPrefix}:${getClientIp(request)}`;
  const now = Date.now();
  const existing = rateLimitBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, retryAfterMs: 0 };
}
