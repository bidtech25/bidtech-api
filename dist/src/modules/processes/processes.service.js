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
exports.ProcessesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const client_1 = require("@prisma/client");
let ProcessesService = class ProcessesService {
    prisma;
    cache;
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async createDraft(userId, companyId, dto) {
        const process = await this.prisma.process.create({
            data: {
                title: dto.name,
                companyId: companyId,
                createdById: userId,
                status: client_1.ProcessStatus.DRAFT,
                version: '1.0',
            },
        });
        await this.invalidateCache(userId);
        return process;
    }
    async updateDraft(id, dto) {
        if (dto.steps && Array.isArray(dto.steps)) {
            await this.validateCollaborators(dto.steps);
        }
        const dataToUpdate = { ...dto };
        if (dataToUpdate.name) {
            dataToUpdate.title = dataToUpdate.name;
            delete dataToUpdate.name;
        }
        const updated = await this.prisma.process.update({
            where: { id },
            data: {
                ...dataToUpdate,
                updatedAt: new Date()
            },
        });
        return updated;
    }
    async validateCollaborators(steps) {
        const collaboratorIds = steps
            .map(step => step.responsibleId)
            .filter(Boolean);
        if (collaboratorIds.length === 0)
            return;
        const existingCollaborators = await this.prisma.collaborators.findMany({
            where: { id: { in: collaboratorIds } },
            select: { id: true },
        });
        const existingIds = new Set(existingCollaborators.map(c => c.id));
        const invalidIds = collaboratorIds.filter(id => !existingIds.has(id));
        if (invalidIds.length > 0) {
            throw new common_1.NotFoundException(`Collaborators not found: ${invalidIds.join(', ')}`);
        }
    }
    async publish(id, userId) {
        const published = await this.prisma.process.update({
            where: { id },
            data: {
                status: client_1.ProcessStatus.PUBLISHED,
                reviewedAt: new Date(),
            },
        });
        await this.invalidateCache(userId);
        return published;
    }
    async findOne(id, userId) {
        return this.prisma.process.findUnique({
            where: { id },
            include: {
                attachments: true,
                creator: true,
            }
        });
    }
    async findAll(userId) {
        const user = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!user?.companyId)
            return [];
        return this.prisma.process.findMany({
            where: { companyId: user.companyId },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async invalidateCache(userId) {
        if (this.cache.delByPattern) {
            await this.cache.delByPattern(`processes:${userId}:*`);
        }
    }
};
exports.ProcessesService = ProcessesService;
exports.ProcessesService = ProcessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ProcessesService);
//# sourceMappingURL=processes.service.js.map