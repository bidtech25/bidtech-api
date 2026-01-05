import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        email: string;
        phone: string | null;
        name: string;
        role: import("@prisma/client").$Enums.Role | null;
        id: string;
        companyId: string | null;
        sector_id: string | null;
        position_id: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
}
