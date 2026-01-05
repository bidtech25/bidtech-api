"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_2 = require("@nestjs/common");
let CacheService = CacheService_1 = class CacheService {
    cacheManager;
    logger = new common_2.Logger(CacheService_1.name);
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        try {
            const value = await this.cacheManager.get(key);
            return value === undefined ? null : value;
        }
        catch (error) {
            this.logger.error(`Cache GET error for key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            await this.cacheManager.set(key, value, ttl || 3600);
        }
        catch (error) {
            this.logger.error(`Cache SET error for key ${key}:`, error);
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(key);
        }
        catch (error) {
            this.logger.error(`Cache DEL error for key ${key}:`, error);
        }
    }
    async delByPattern(pattern) {
        try {
            const store = this.cacheManager.store;
            if (store.keys) {
                const keys = await store.keys(pattern);
                if (keys && keys.length > 0) {
                    this.logger.log(`Deleting ${keys.length} keys for pattern: ${pattern}`);
                    await Promise.all(keys.map((k) => this.cacheManager.del(k)));
                }
            }
            else {
                this.logger.warn('Cache store does not support "keys" method');
            }
        }
        catch (error) {
            this.logger.error(`Cache DEL PATTERN error for ${pattern}:`, error);
        }
    }
    async wrap(key, fn, ttl) {
        const cached = await this.get(key);
        if (cached !== null)
            return cached;
        const result = await fn();
        await this.set(key, result, ttl);
        return result;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
//# sourceMappingURL=cache.service.js.map