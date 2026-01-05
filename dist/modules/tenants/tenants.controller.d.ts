import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(dto: CreateTenantDto, user: any): Promise<{
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
