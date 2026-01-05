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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const passport_jwt_1 = require("passport-jwt");
const user_role_enum_1 = require("../interfaces/user-role.enum");
const users_service_1 = require("../../users/users.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    config;
    usersService;
    logger = new common_1.Logger(JwtStrategy_1.name);
    constructor(config, usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('SUPABASE_JWT_SECRET') || 'FALLBACK_SECRET',
            algorithms: ['HS256'],
        });
        this.config = config;
        this.usersService = usersService;
    }
    async validate(payload) {
        if (!payload || !payload.sub) {
            throw new common_1.UnauthorizedException('Invalid token payload');
        }
        let role = payload.role;
        if (payload.role === 'authenticated') {
            role = user_role_enum_1.UserRole.USER;
        }
        let companyId;
        try {
            const userProfile = await this.usersService.findBySupabaseId(payload.sub);
            if (userProfile) {
                companyId = userProfile.companyId || undefined;
            }
            else {
                this.logger.warn(`User authenticated but not found in Supabase/Prisma Profile: ${payload.sub}`);
            }
        }
        catch (error) {
            this.logger.error(`Error hydrating user profile for ${payload.sub}: ${error.message}`);
        }
        return {
            id: payload.sub,
            email: payload.email,
            role: role || user_role_enum_1.UserRole.USER,
            companyId: companyId,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map