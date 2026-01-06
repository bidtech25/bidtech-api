import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { SwitchCompanyDto } from './dto/switch-company.dto';
export declare class UsersService {
    private prisma;
    private configService;
    private readonly logger;
    private supabaseAdmin;
    constructor(prisma: PrismaService, configService: ConfigService);
    createEmployee(dto: CreateUserDto): Promise<{
        companyId: string | null;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        sector_id: string | null;
        position_id: string | null;
    }>;
    createFromWebhook(data: {
        id: string;
        email: string;
        name: string;
        role?: string;
    }): Promise<{
        companyId: string | null;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        sector_id: string | null;
        position_id: string | null;
    }>;
    findBySupabaseId(id: string): Promise<{
        companyId: string | null;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        sector_id: string | null;
        position_id: string | null;
    } | null>;
    findById(id: string): Promise<{
        companyId: string | null;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        sector_id: string | null;
        position_id: string | null;
    } | null>;
    private mapRole;
    getUserCompanies(userId: string): Promise<{
        currentCompanyId: string | null;
        companies: any[];
    }>;
    switchCompany(userId: string, dto: SwitchCompanyDto): Promise<{
        message: string;
        user: {
            companyId: string | null;
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role | null;
        };
        company: {
            id: string;
            name: string;
        };
    }>;
    private checkCompanyAccess;
    getMe(userId: string): Promise<{
        company: {
            id: string;
            name: string;
        } | null;
        positions: {
            title: string;
            id: string;
        } | null;
        sectors: {
            id: string;
            name: string;
        } | null;
    } & {
        companyId: string | null;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        sector_id: string | null;
        position_id: string | null;
    }>;
}
