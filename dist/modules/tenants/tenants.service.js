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
var TenantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const client_1 = require("@prisma/client");
let TenantsService = TenantsService_1 = class TenantsService {
    prisma;
    configService;
    logger = new common_1.Logger(TenantsService_1.name);
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
    async onboardNewClient(dto) {
        this.logger.log(`Starting onboarding for client: ${dto.companyName}`);
        const existingCompany = await this.prisma.company.findUnique({ where: { cnpj: dto.cnpj } });
        if (existingCompany) {
            throw new common_1.ConflictException('Company with this CNPJ already exists.');
        }
        const company = await this.prisma.company.create({
            data: {
                name: dto.companyName,
                cnpj: dto.cnpj,
            },
        });
        this.logger.log(`Company created: ${company.id}`);
        try {
            const defaultPassword = 'Mudar@123';
            const { data: authData, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
                email: dto.managerEmail,
                password: defaultPassword,
                email_confirm: true,
                user_metadata: {
                    name: dto.managerName,
                    role: 'COMPANY_ADMIN',
                    is_first_login: true,
                    companyId: company.id
                },
            });
            if (authError) {
                throw new common_1.BadRequestException(`Supabase Auth Error: ${authError.message}`);
            }
            this.logger.log(`Manager user created in Supabase: ${authData.user.id}`);
            await this.prisma.profile.create({
                data: {
                    id: authData.user.id,
                    email: dto.managerEmail,
                    name: dto.managerName,
                    role: client_1.Role.COMPANY_ADMIN,
                    companyId: company.id,
                },
            });
            this.logger.log(`Manager profile created and linked to company.`);
            return {
                message: 'Client onboarded successfully',
                company: {
                    id: company.id,
                    name: company.name
                },
                manager: {
                    email: dto.managerEmail,
                    tempPassword: defaultPassword
                }
            };
        }
        catch (error) {
            this.logger.error(`Onboarding failed: ${error.message}`);
            await this.prisma.company.delete({ where: { id: company.id } });
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException)
                return Promise.reject(error);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map