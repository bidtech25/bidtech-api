import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    }>;
}
