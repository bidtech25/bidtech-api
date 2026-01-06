import { Injectable, Logger, InternalServerErrorException, ConflictException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { SwitchCompanyDto } from './dto/switch-company.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
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

  async createEmployee(dto: CreateUserDto) {
    this.logger.log(`Creating employee: ${dto.email}`);
    const defaultPassword = 'Mudar@123';

    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
        email: dto.email,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          name: dto.name,
          is_first_login: true,
        },
      });

      if (authError) {
        this.logger.error(`Supabase Auth Error: ${authError.message}`);
        throw new BadRequestException(`Supabase Auth Error: ${authError.message}`);
      }

      this.logger.log(`User created in Supabase with ID: ${authData.user.id}`);

      // 2. Create user in local Database (Table: profiles)
      try {
        const role = this.mapRole(dto.role);
        
        const profile = await this.prisma.profile.create({
          data: {
            id: authData.user.id,
            email: dto.email,
            name: dto.name,
            role: role,
          },
        });
        this.logger.log(`Profile created in local DB: ${profile.id}`);
        return profile;
      } catch (prismaError) {
        this.logger.error(`Prisma Error: ${prismaError.message}`, prismaError.stack);
        
        // Rollback check
        await this.supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        this.logger.warn(`Rolled back Supabase user ${authData.user.id} due to Prisma error`);

        if (prismaError.code === 'P2002') {
           throw new ConflictException('User with this email already exists in the database.');
        }
        // DEBUG: Returning raw error to client
        throw new InternalServerErrorException(`Prisma Error: ${prismaError.message}`);
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Unexpected error: ${error.message}`, error.stack);
      // DEBUG: Returning raw error to client to identify the issue
      throw new InternalServerErrorException(`Debug Error: ${error.message} - Stack: ${error.stack}`);
    }
  }

  async createFromWebhook(data: { id: string; email: string; name: string; role?: string }) {
    this.logger.log(`Creating profile from webhook: ${data.email}`);
    
    const role = this.mapRole(data.role);

    return this.prisma.profile.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: role,
      },
    });
  }

  async findBySupabaseId(id: string) {
     return this.findById(id);
  }

  async findById(id: string) {
    return await this.prisma.profile.findUnique({
      where: { id },
    });
  }

  // Helper to map string role to Enum
  private mapRole(roleStr?: string): Role {
    if (!roleStr) return Role.USER;
    
    switch (roleStr.toUpperCase()) {
      case 'SUPER_ADMIN': return Role.SUPER_ADMIN;
      case 'COMPANY_ADMIN': return Role.COMPANY_ADMIN;
      default: return Role.USER;
    }
  }

  // ============================================
  // COMPANY CONTEXT MANAGEMENT
  // ============================================

  /**
   * Lista todas as empresas que o usuário tem acesso
   * Inclui: empresa do profile + empresas onde é colaborador
   */
  async getUserCompanies(userId: string) {
    this.logger.log(`Fetching companies for user: ${userId}`);
    
    // Busca o profile do usuário com sua empresa atual
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: { 
        company: {
          select: { id: true, name: true, cnpj: true, isActive: true }
        } 
      }
    });

    if (!profile) {
      throw new NotFoundException('Perfil de usuário não encontrado.');
    }

    // Busca empresas onde o usuário é colaborador
    const collaborations = await this.prisma.collaborators.findMany({
      where: { profile_id: userId },
      include: { 
        companies: {
          select: { id: true, name: true, cnpj: true, isActive: true }
        } 
      }
    });

    // Combina empresas únicas (evita duplicatas)
    const companiesMap = new Map<string, any>();
    
    // Adiciona empresa do profile (marcando como atual)
    if (profile.company) {
      companiesMap.set(profile.company.id, {
        ...profile.company,
        isCurrent: profile.companyId === profile.company.id
      });
    }

    // Adiciona empresas de colaborações
    collaborations.forEach(collab => {
      if (collab.companies && !companiesMap.has(collab.companies.id)) {
        companiesMap.set(collab.companies.id, {
          ...collab.companies,
          isCurrent: profile.companyId === collab.companies.id
        });
      }
    });

    const companies = Array.from(companiesMap.values());
    this.logger.log(`Found ${companies.length} companies for user ${userId}`);
    
    return {
      currentCompanyId: profile.companyId,
      companies
    };
  }

  /**
   * Troca a empresa do contexto atual do usuário
   */
  async switchCompany(userId: string, dto: SwitchCompanyDto) {
    const { companyId } = dto;
    this.logger.log(`User ${userId} switching to company ${companyId}`);

    // Verifica se a empresa existe
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true, isActive: true }
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    if (!company.isActive) {
      throw new BadRequestException('Esta empresa está desativada.');
    }

    // Verifica se o usuário tem acesso à empresa
    const hasAccess = await this.checkCompanyAccess(userId, companyId);
    if (!hasAccess) {
      throw new ForbiddenException('Você não tem acesso a esta empresa.');
    }

    // Atualiza o companyId no profile
    const updatedProfile = await this.prisma.profile.update({
      where: { id: userId },
      data: { companyId },
      select: { 
        id: true, 
        companyId: true, 
        name: true,
        email: true,
        role: true
      }
    });

    this.logger.log(`User ${userId} successfully switched to company ${companyId}`);
    
    return {
      message: 'Empresa alterada com sucesso.',
      user: updatedProfile,
      company: { id: company.id, name: company.name }
    };
  }

  /**
   * Verifica se o usuário tem acesso a uma empresa específica
   */
  private async checkCompanyAccess(userId: string, companyId: string): Promise<boolean> {
    // Verifica se é funcionário direto (company no profile)
    const profileWithCompany = await this.prisma.profile.findFirst({
      where: { id: userId, companyId }
    });
    if (profileWithCompany) return true;

    // Verifica se é colaborador na empresa
    const collaboration = await this.prisma.collaborators.findFirst({
      where: { profile_id: userId, company_id: companyId }
    });
    
    return !!collaboration;
  }

  /**
   * Retorna o profile completo do usuário com empresa atual
   */
  async getMe(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        company: {
          select: { id: true, name: true }
        },
        sectors: {
          select: { id: true, name: true }
        },
        positions: {
          select: { id: true, title: true }
        }
      }
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return profile;
  }
}
