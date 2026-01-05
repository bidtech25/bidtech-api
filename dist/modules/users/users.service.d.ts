import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    private configService;
    private readonly logger;
    private supabaseAdmin;
    constructor(prisma: PrismaService, configService: ConfigService);
    createEmployee(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    }>;
    createFromWebhook(data: {
        id: string;
        email: string;
        name: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    }>;
    findBySupabaseId(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    } | null>;
    private mapRole;
}
