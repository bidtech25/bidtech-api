"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const Joi = __importStar(require("joi"));
const prisma_module_1 = require("./prisma/prisma.module");
const redis_config_1 = __importDefault(require("./config/redis.config"));
const bull_config_1 = require("./config/bull.config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const cache_module_1 = require("./modules/cache/cache.module");
const queues_module_1 = require("./modules/queues/queues.module");
const ai_module_1 = require("./modules/ai/ai.module");
const processes_module_1 = require("./modules/processes/processes.module");
const bpmn_module_1 = require("./modules/bpmn/bpmn.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const attachments_module_1 = require("./modules/attachments/attachments.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [redis_config_1.default],
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
            prisma_module_1.PrismaModule,
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        socket: {
                            host: config.get('redis.host'),
                            port: config.get('redis.port'),
                        },
                        password: config.get('redis.password'),
                        database: config.get('redis.db'),
                        ttl: 3600 * 1000,
                    }),
                }),
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: bull_config_1.bullConfig,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            cache_module_1.CacheModuleCustom,
            queues_module_1.QueuesModule,
            ai_module_1.AiModule,
            processes_module_1.ProcessesModule,
            bpmn_module_1.BpmnModule,
            tenants_module_1.TenantsModule,
            attachments_module_1.AttachmentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map