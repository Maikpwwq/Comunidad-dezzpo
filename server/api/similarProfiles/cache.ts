/**
 * In-Memory LRU Cache with TTL for Similar Profiles (ADR-02)
 *
 * Provides thread-safe, memory-bounded caching for recommendation payloads:
 * - O(1) lookups and updates
 * - Eviction of least recently used entries when capacity exceeds maxEntries
 * - Automatic expiration check via TTL (default 900 seconds = 15 minutes)
 * - Zero visitor PII stored in cache keys (Invariant R8)
 */

interface CacheEntry<T> {
    readonly value: T
    readonly expiresAt: number
}

export class SimilarProfilesCache<T> {
    private readonly entries = new Map<string, CacheEntry<T>>()
    private readonly maxEntries: number
    private readonly defaultTtlMs: number

    private hits = 0
    private misses = 0

    constructor(maxEntries = 500, defaultTtlSeconds = 900) {
        this.maxEntries = maxEntries
        this.defaultTtlMs = defaultTtlSeconds * 1000
    }

    /**
     * Retrieves an entry if present and not expired.
     * Updates LRU order on hit.
     */
    get(key: string): T | null {
        const entry = this.entries.get(key)
        if (!entry) {
            this.misses++
            return null
        }

        const now = Date.now()
        if (now > entry.expiresAt) {
            this.entries.delete(key)
            this.misses++
            return null
        }

        // Refresh LRU order (delete & re-insert)
        this.entries.delete(key)
        this.entries.set(key, entry)
        this.hits++
        return entry.value
    }

    /**
     * Stores an entry with TTL. Evicts oldest item if at capacity.
     */
    set(key: string, value: T, ttlSeconds?: number): void {
        const ttlMs = typeof ttlSeconds === 'number' ? ttlSeconds * 1000 : this.defaultTtlMs
        const expiresAt = Date.now() + ttlMs

        if (this.entries.has(key)) {
            this.entries.delete(key)
        } else if (this.entries.size >= this.maxEntries) {
            // Evict oldest (first key in map)
            const oldestKey = this.entries.keys().next().value
            if (oldestKey) {
                this.entries.delete(oldestKey)
            }
        }

        this.entries.set(key, { value, expiresAt })
    }

    /**
     * Clears all cache entries (useful for testing or cache invalidation).
     */
    clear(): void {
        this.entries.clear()
        this.hits = 0
        this.misses = 0
    }

    /**
     * Returns cache performance statistics.
     */
    getStats(): { size: number; hits: number; misses: number; hitRate: number } {
        const total = this.hits + this.misses
        const hitRate = total > 0 ? Math.round((this.hits / total) * 100) / 100 : 0
        return {
            size: this.entries.size,
            hits: this.hits,
            misses: this.misses,
            hitRate,
        }
    }
}

// Singleton cache instance for similar profiles recommendations
export const similarProfilesMemoryCache = new SimilarProfilesCache<unknown>(500, 900)
