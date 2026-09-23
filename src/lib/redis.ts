// Simple in-memory cache for serverless (no Redis needed)
// Falls back gracefully when Redis is unavailable
const memCache = new Map<string, { data: any; expiresAt: number }>();

export const redis = null; // Redis disabled for serverless compatibility

export async function fetchWithCache(key: string, fetcher: () => Promise<any>, ttlSeconds = 3600) {
  // Check in-memory cache first
  const cached = memCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const data = await fetcher();

  if (data) {
    memCache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  return data;
}
