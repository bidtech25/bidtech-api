import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SwitchCompanyDto } from './dto/switch-company.dto';
import type { RequestUser } from '@/modules/auth/interfaces/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
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
    getMe(user: RequestUser): Promise<{
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
    getMyCompanies(user: RequestUser): Promise<{
        currentCompanyId: string | null;
        companies: any[];
    }>;
    switchCompany(user: RequestUser, dto: SwitchCompanyDto): Promise<{
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
}
