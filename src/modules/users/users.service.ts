import { Injectable, Logger, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
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
}
