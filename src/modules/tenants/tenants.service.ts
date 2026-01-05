import { Injectable, Logger, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);
  private supabaseAdmin: SupabaseClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.supabaseAdmin = createClient(
      this.configService.getOrThrow('SUPABASE_URL'),
      this.configService.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async onboardNewClient(dto: CreateTenantDto) {
    this.logger.log(`Starting onboarding for client: ${dto.companyName}`);
    
    // Check if Company CNPJ exists
    const existingCompany = await this.prisma.company.findUnique({ where: { cnpj: dto.cnpj } });
    if (existingCompany) {
      throw new ConflictException('Company with this CNPJ already exists.');
    }

    // Transaction-like flow (Manual rollback needed if steps fail, as Supabase is external)
    
    // 1. Create Company
    const company = await this.prisma.company.create({
      data: {
        name: dto.companyName,
        cnpj: dto.cnpj,
      },
    });
    this.logger.log(`Company created: ${company.id}`);

    try {
      // 2. Create User in Supabase
      const defaultPassword = 'Mudar@123';
      const { data: authData, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
        email: dto.managerEmail,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          name: dto.managerName,
          role: 'COMPANY_ADMIN',
          is_first_login: true,
          companyId: company.id // Store companyId in metadata for easy access
        },
      });

      if (authError) {
        throw new BadRequestException(`Supabase Auth Error: ${authError.message}`);
      }

      this.logger.log(`Manager user created in Supabase: ${authData.user.id}`);

      // 3. Create Local Profile (Explicitly, to ensure link)
      // We rely on this manual creation. If Webhook fires, it should handle "already exists" gratefully.
      // But to be safe, we create it here immediately.
      await this.prisma.profile.create({
        data: {
          id: authData.user.id,
          email: dto.managerEmail,
          name: dto.managerName,
          role: Role.COMPANY_ADMIN,
          companyId: company.id,
        },
      });
      
      this.logger.log(`Manager profile created and linked to company.`);

      return {
        message: 'Client onboarded successfully',
        company: {
            id: company.id,
            name: company.name
        },
        manager: {
            email: dto.managerEmail,
            tempPassword: defaultPassword
        }
      };

    } catch (error) {
      this.logger.error(`Onboarding failed: ${error.message}`);
      // Manual Rollback: Delete Company if Auth failed
      await this.prisma.company.delete({ where: { id: company.id } });
      // If profile creation failed but user created? (Rare, but possible). 
      // ideally we delete the user from supabase too if we can access the ID.
      // For now, simple rollback of Company.
      
      if (error instanceof BadRequestException || error instanceof ConflictException) return Promise.reject(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
