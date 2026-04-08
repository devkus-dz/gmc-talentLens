import { Request, Response, NextFunction } from 'express';
import { LRUCache } from 'lru-cache';
import { AuthRequest } from './authMiddleware';

// Initialize the LRU Cache
export const cache = new LRUCache<string, any>({
    max: 500,
    ttl: 1000 * 60 * 5,
    updateAgeOnGet: true,
});

export const cacheRoute = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.method !== 'GET') return next();

    const userId = req.user?.id || 'public';
    const cacheKey = `${req.originalUrl || req.url}_User_${userId}`;

    const cachedBody = cache.get(cacheKey);
    if (cachedBody) {
        res.status(200).json(cachedBody);
        return;
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any): Response<any> => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cache.set(cacheKey, body);
        }
        return originalJson(body);
    };

    next();
};

// ==========================================
// CACHE INVALIDATION HELPERS
// ==========================================

/**
 * Wipes the entire cache. Use this for mutations that affect multiple users 
 * (e.g., publishing a job, applying for a job).
 */
export const clearGlobalCache = () => {
    cache.clear();
    console.log('🧹 [CACHE] Global cache wiped due to data mutation.');
};

/**
 * Wipes the cache ONLY for a specific user. Use this for private mutations
 * (e.g., a user saving a job to their wishlist).
 */
export const clearUserCache = (userId: string) => {
    const keys = cache.keys();
    for (const key of keys) {
        if (key.includes(`_User_${userId}`)) {
            cache.delete(key);
        }
    }
    console.log(`🧹 [CACHE] Wiped cache for user: ${userId}`);
};