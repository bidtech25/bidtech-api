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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../../prisma/prisma.service");
const check_ownership_decorator_1 = require("../decorators/check-ownership.decorator");
const user_role_enum_1 = require("../interfaces/user-role.enum");
let OwnershipGuard = class OwnershipGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const resourceType = this.reflector.get(check_ownership_decorator_1.OWNERSHIP_KEY, context.getHandler());
        if (!resourceType) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
            return true;
        }
        const resourceId = request.params.id;
        if (!resourceId) {
            throw new common_1.ForbiddenException('Resource ID not found');
        }
        const isOwner = await this.checkOwnership(resourceType, resourceId, user.id);
        if (!isOwner) {
            throw new common_1.ForbiddenException('You do not own this resource');
        }
        return true;
    }
    async checkOwnership(resourceType, resourceId, userId) {
        let resource;
        switch (resourceType) {
            case 'process':
                return true;
                break;
            default:
                throw new common_1.ForbiddenException(`Unknown resource type: ${resourceType}`);
        }
        if (!resource) {
            throw new common_1.NotFoundException(`${resourceType} not found`);
        }
        return resource.userId === userId;
    }
};
exports.OwnershipGuard = OwnershipGuard;
exports.OwnershipGuard = OwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], OwnershipGuard);
//# sourceMappingURL=ownership.guard.js.map