const TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  url: string
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

export function getCachedUrl(key: string): string | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.url
}

export function setCachedUrl(key: string, url: string): void {
  cache.set(key, { url, expiresAt: Date.now() + TTL_MS })
}

export function getBlobStoreUrl(): string {
  const url = process.env.BLOB_STORE_URL
  if (!url) {
    throw new Error(
      '[Hyeland] BLOB_STORE_URL environment variable is not set. ' +
      'Add it to .env.local and Vercel environment variables.'
    )
  }
  return url
}
