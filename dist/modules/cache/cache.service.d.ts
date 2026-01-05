import type { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    private readonly logger;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    delByPattern(pattern: string): Promise<void>;
    wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T>;
}
