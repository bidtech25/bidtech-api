import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CacheService } from '@/modules/cache/cache.service';
import { CreateProcessWizardDto } from './dto/create-process-wizard.dto';
import { ProcessStatus } from '@prisma/client';

@Injectable()
export class ProcessesService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  // 1. Criar Rascunho
  async createDraft(userId: string, companyId: string, dto: CreateProcessWizardDto) {
    const process = await this.prisma.process.create({
      data: {
        title: dto.name, // Mapping name to title
        companyId: companyId,
        createdById: userId,
        status: ProcessStatus.DRAFT,
        version: '1.0',
      },
    });
    await this.invalidateCache(userId);
    return process;
  }

  // 2. Atualizar Rascunho (Genérico)
  async updateDraft(id: string, dto: any) {
    // Validate collaborator IDs if steps are being updated
    if (dto.steps && Array.isArray(dto.steps)) {
      await this.validateCollaborators(dto.steps);
    }

    // Basic mapping of old fields to new schema if necessary
    const dataToUpdate = { ...dto };
    
    // Map DTO fields to Schema fields if needed
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

  // Helper: Validate that all collaborator IDs exist
  private async validateCollaborators(steps: any[]) {
    const collaboratorIds = steps
      .map(step => step.responsibleId)
      .filter(Boolean);

    if (collaboratorIds.length === 0) return;

    const existingCollaborators = await this.prisma.collaborators.findMany({
      where: { id: { in: collaboratorIds } },
      select: { id: true },
    });

    const existingIds = new Set(existingCollaborators.map(c => c.id));
    const invalidIds = collaboratorIds.filter(id => !existingIds.has(id));

    if (invalidIds.length > 0) {
      throw new NotFoundException(
        `Collaborators not found: ${invalidIds.join(', ')}`
      );
    }
  }

  // 3. Methods removed: addStep, removeStep, addInput, etc. 
  // Functionality should be handled by updating 'details' JSON or adding specific logic if we restore the tables.
  
  // 4. Publicar
  async publish(id: string, userId: string) {
    const published = await this.prisma.process.update({
      where: { id },
      data: {
        status: ProcessStatus.PUBLISHED,
        reviewedAt: new Date(),
        // Schema v2 has reviewedAt, but maybe not publishedAt.
        // Waiting, schema v2 has reviewedAt. 
        // Let's check status enum: PUBLISHED exists.
      },
    });
    // Schema v2 has reviewedAt, let's use it as publishedAt equivalent or just ignore if not defined
    await this.invalidateCache(userId);
    return published;
  }

  // 5. Buscar Completo
  async findOne(id: string, userId: string) {
    return this.prisma.process.findUnique({
      where: { id },
      include: {
        attachments: true, // New relation name
        creator: true,
        // sector, role, etc are gone or simplified
      }
    });
  }

  async findAll(userId: string) {
     /* 
       Note: In a multi-tenant system, we should filter by CompanyId.
       However, we don't have companyId easily here without passing it.
       Ideally, we find the user's company and then find processes.
     */
     const user = await this.prisma.profile.findUnique({ where: { id: userId } });
     if (!user?.companyId) return [];

     return this.prisma.process.findMany({
        where: { companyId: user.companyId },
        orderBy: { updatedAt: 'desc' }
     });
  }

  private async invalidateCache(userId: string) {
    if (this.cache.delByPattern) {
        await this.cache.delByPattern(`processes:${userId}:*`);
    }
  }
}
