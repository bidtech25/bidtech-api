import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      return value === undefined ? null : value;
    } catch (error) {
      this.logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl || 3600);
    } catch (error) {
      this.logger.error(`Cache SET error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Cache DEL error for key ${key}:`, error);
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    try {
      // Accessing underlying store for pattern matching
      const store = (this.cacheManager as any).store;
      if (store.keys) {
        const keys = await store.keys(pattern);
        if (keys && keys.length > 0) {
          this.logger.log(`Deleting ${keys.length} keys for pattern: ${pattern}`);
          // Delete keys in parallel
          await Promise.all(keys.map((k: string) => this.cacheManager.del(k)));
        }
      } else {
         this.logger.warn('Cache store does not support "keys" method');
      }
    } catch (error) {
      this.logger.error(`Cache DEL PATTERN error for ${pattern}:`, error);
    }
  }

  // Helper para padrões de cache
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
}
