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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    config;
    usersService;
    logger = new common_1.Logger(AuthService_1.name);
    webhookSecret;
    constructor(config, usersService) {
        this.config = config;
        this.usersService = usersService;
        this.webhookSecret = this.config.get('SUPABASE_WEBHOOK_SECRET') || '';
    }
    async handleUserCreated(payload) {
        this.logger.log(`Processing user creation webhook for: ${payload.record.email}`);
        try {
            const { id, email, raw_user_meta_data } = payload.record;
            const existing = await this.usersService.findById(id);
            if (existing) {
                this.logger.warn(`User ${email} already exists in database`);
                return { success: true, message: 'User already exists' };
            }
            const user = await this.usersService.createFromWebhook({
                id: id,
                email,
                name: raw_user_meta_data?.full_name || email.split('@')[0],
                role: 'user',
            });
            this.logger.log(`User ${email} created successfully with ID: ${user.id}`);
            return { success: true, userId: user.id };
        }
        catch (error) {
            this.logger.error(`Failed to create user from webhook: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to process user creation webhook');
        }
    }
    verifyWebhookSignature(signature, payload) {
        if (!this.webhookSecret)
            return true;
        return true;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map