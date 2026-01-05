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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let UsersService = UsersService_1 = class UsersService {
    prisma;
    configService;
    logger = new common_1.Logger(UsersService_1.name);
    supabaseAdmin;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.supabaseAdmin = (0, supabase_js_1.createClient)(this.configService.getOrThrow('SUPABASE_URL'), this.configService.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'), {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
    async createEmployee(dto) {
        this.logger.log(`Creating employee: ${dto.email}`);
        const defaultPassword = 'Mudar@123';
        try {
            const { data: authData, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
                email: dto.email,
                password: defaultPassword,
                email_confirm: true,
                user_metadata: {
                    name: dto.name,
                    is_first_login: true,
                },
            });
            if (authError) {
                this.logger.error(`Supabase Auth Error: ${authError.message}`);
                throw new common_1.BadRequestException(`Supabase Auth Error: ${authError.message}`);
            }
            this.logger.log(`User created in Supabase with ID: ${authData.user.id}`);
            try {
                const role = this.mapRole(dto.role);
                const profile = await this.prisma.profile.create({
                    data: {
                        id: authData.user.id,
                        email: dto.email,
                        name: dto.name,
                        role: role,
                    },
                });
                this.logger.log(`Profile created in local DB: ${profile.id}`);
                return profile;
            }
            catch (prismaError) {
                this.logger.error(`Prisma Error: ${prismaError.message}`, prismaError.stack);
                await this.supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                this.logger.warn(`Rolled back Supabase user ${authData.user.id} due to Prisma error`);
                if (prismaError.code === 'P2002') {
                    throw new common_1.ConflictException('User with this email already exists in the database.');
                }
                throw new common_1.InternalServerErrorException(`Prisma Error: ${prismaError.message}`);
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Unexpected error: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Debug Error: ${error.message} - Stack: ${error.stack}`);
        }
    }
    async createFromWebhook(data) {
        this.logger.log(`Creating profile from webhook: ${data.email}`);
        const role = this.mapRole(data.role);
        return this.prisma.profile.create({
            data: {
                id: data.id,
                email: data.email,
                name: data.name,
                role: role,
            },
        });
    }
    async findBySupabaseId(id) {
        return this.findById(id);
    }
    async findById(id) {
        return await this.prisma.profile.findUnique({
            where: { id },
        });
    }
    mapRole(roleStr) {
        if (!roleStr)
            return client_1.Role.USER;
        switch (roleStr.toUpperCase()) {
            case 'SUPER_ADMIN': return client_1.Role.SUPER_ADMIN;
            case 'COMPANY_ADMIN': return client_1.Role.COMPANY_ADMIN;
            default: return client_1.Role.USER;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map