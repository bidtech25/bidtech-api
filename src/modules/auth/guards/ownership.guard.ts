import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/prisma/prisma.service';
import { OWNERSHIP_KEY } from '../decorators/check-ownership.decorator';
import { UserRole } from '../interfaces/user-role.enum';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.get<string>(OWNERSHIP_KEY, context.getHandler());

    if (!resourceType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Admin sempre pode
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const resourceId = request.params.id;

    if (!resourceId) {
      throw new ForbiddenException('Resource ID not found');
    }

    // Verificar ownership conforme o tipo de recurso
    const isOwner = await this.checkOwnership(resourceType, resourceId, user.id);

    if (!isOwner) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }

  private async checkOwnership(
    resourceType: string,
    resourceId: string,
    userId: string,
  ): Promise<boolean> {
    let resource: any;

    switch (resourceType) {
      case 'process':
        // resource = await this.prisma.process.findUnique({
        //   where: { id: resourceId },
        //   select: { userId: true },
        // });
        // NOTE: Commented out because Process model doesn't exist yet.
        // Returning true for dev testing until Process module exists, or throw NotImplemented
        return true; 
        break;

      // Adicionar outros tipos conforme necessário
      default:
        throw new ForbiddenException(`Unknown resource type: ${resourceType}`);
    }

    if (!resource) {
      throw new NotFoundException(`${resourceType} not found`);
    }

    return resource.userId === userId;
  }
}
