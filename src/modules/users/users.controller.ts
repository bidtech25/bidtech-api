import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SwitchCompanyDto } from './dto/switch-company.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { RequestUser } from '@/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  @Post()
  @ApiOperation({ summary: 'Create a new employee (Admin only)' })
  @ApiResponse({ status: 201, description: 'Profile created successfully.' })
  // @UseGuards(JwtAuthGuard) // TODO: Protect with admin role guard
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createEmployee(dto);
  }

  // ============================================
  // AUTHENTICATED USER ENDPOINTS
  // ============================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso.' })
  getMe(@CurrentUser() user: RequestUser) {
    return this.usersService.getMe(user.id);
  }

  @Get('me/companies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todas as empresas que o usuário tem acesso' })
  @ApiResponse({ status: 200, description: 'Lista de empresas retornada.' })
  getMyCompanies(@CurrentUser() user: RequestUser) {
    return this.usersService.getUserCompanies(user.id);
  }

  @Patch('switch-company')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Troca a empresa do contexto atual do usuário' })
  @ApiResponse({ status: 200, description: 'Empresa alterada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Usuário não tem acesso à empresa.' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada.' })
  switchCompany(@CurrentUser() user: RequestUser, @Body() dto: SwitchCompanyDto) {
    return this.usersService.switchCompany(user.id, dto);
  }
}
