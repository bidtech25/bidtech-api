import { Controller, Post, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@ApiTags('Admin / Tenants')
@ApiBearerAuth()
@Controller('admin/tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Onboard a new Client (Company + Manager) - SUPER_ADMIN Only' })
  @ApiResponse({ status: 201, description: 'Client onboarded successfully.' })
  create(@Body() dto: CreateTenantDto, @CurrentUser() user: any) {
    // Simple Role Check
    // Note: user.role is likely 'USER' | 'ADMIN' | 'MANAGER' mapped from token.
    // Ensure we check against the new SUPER_ADMIN string if the JWT has it, 
    // or if we fetch profile. 
    // Ideally, current-user decorator fetches profile or we trust the JWT metadata.
    
    // TEMPORARY: Allow if role is SUPER_ADMIN or (for dev) if it's the specific admin email
    /*
    if (user.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Only SUPER_ADMIN can onboard new clients.');
    }
    */
    // For the "First Run" paradox (how to create the first super admin?), 
    // we often allow manual database seed or a specific env var bypass.
    // I will enforce the check but note that the user needs one SUPER_ADMIN in DB to use this.
    
    const role = user.role || user.app_metadata?.role || user.user_metadata?.role;
    
    if (role !== 'SUPER_ADMIN') {
        // Double check via DB if needed, but assuming JWT is source of truth after login
        // If JWT still has old role, this blocks.
         throw new ForbiddenException('Only SUPER_ADMIN can onboard new clients. Current role: ' + role);
    }
    
    return this.tenantsService.onboardNewClient(dto);
  }
}
