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
        companyId: string | null;
        sector_id: string | null;
        position_id: string | null;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    createFromWebhook(data: {
        id: string;
        email: string;
        name: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        companyId: string | null;
        sector_id: string | null;
        position_id: string | null;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findBySupabaseId(id: string): Promise<{
        id: string;
        email: string;
        companyId: string | null;
        sector_id: string | null;
        position_id: string | null;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        companyId: string | null;
        sector_id: string | null;
        position_id: string | null;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null>;
    private mapRole;
}
