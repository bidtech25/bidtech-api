import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
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
}
