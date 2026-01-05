import { BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const bullConfig = (config: ConfigService): BullModuleOptions => ({
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
    removeOnComplete: 100, // Manter últimos 100 jobs completados
    removeOnFail: 500,     // Manter últimos 500 jobs falhados
  },
});
