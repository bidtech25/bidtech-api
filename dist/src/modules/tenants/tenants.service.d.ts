import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsService {
    private prisma;
    private configService;
    private readonly logger;
    private supabaseAdmin;
    constructor(prisma: PrismaService, configService: ConfigService);
    onboardNewClient(dto: CreateTenantDto): Promise<{
        message: string;
        company: {
            id: string;
            name: string;
        };
        manager: {
            email: string;
            tempPassword: string;
        };
    }>;
}
