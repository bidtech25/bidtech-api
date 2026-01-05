import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import * as Joi from 'joi';

import { PrismaModule } from './prisma/prisma.module';
import redisConfig from './config/redis.config';
import { bullConfig } from './config/bull.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModuleCustom } from './modules/cache/cache.module';
import { QueuesModule } from './modules/queues/queues.module';
import { AiModule } from './modules/ai/ai.module';
import { ProcessesModule } from './modules/processes/processes.module';
import { BpmnModule } from './modules/bpmn/bpmn.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Config Module com validação
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        DIRECT_URL: Joi.string().required(),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_JWT_SECRET: Joi.string().required(),
        SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        OPENAI_API_KEY: Joi.string().required(),
      }),
    }),

    // Prisma Module (Global)
    PrismaModule,

    // Cache Module (Redis)
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
          },
          password: config.get('redis.password'),
          database: config.get('redis.db'),
          ttl: 3600 * 1000, // 1 hora em ms
        }),
      }),
    }),

    // Bull Module (Filas)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: bullConfig,
    }),

    // Módulos de domínio
    AuthModule,
    UsersModule,
    CacheModuleCustom,
    QueuesModule,
    AiModule,
    ProcessesModule,
    BpmnModule,
    TenantsModule,
    AttachmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
