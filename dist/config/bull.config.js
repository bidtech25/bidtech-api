"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullConfig = void 0;
const bullConfig = (config) => ({
    redis: {
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        password: config.get('redis.password'),
        db: config.get('redis.db'),
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
    },
});
exports.bullConfig = bullConfig;
//# sourceMappingURL=bull.config.js.map