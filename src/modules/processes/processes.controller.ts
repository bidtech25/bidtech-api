import { Controller, Post, Body, Patch, Param, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { ProcessesService } from './processes.service';
import type { RequestUser } from '@/modules/auth/interfaces/jwt-payload.interface';

// DTOs
import { CreateProcessWizardDto } from './dto/create-process-wizard.dto';
import { UpdateScopeDto } from './dto/wizard/update-scope.dto';
import { UpdateDetailsDto } from './dto/wizard/update-details.dto';
import { UpdateObjectiveDto } from './dto/wizard/update-objective.dto';
import { UpdateFlowchartDto } from './dto/wizard/update-flowchart.dto';

@ApiTags('Process Wizard')
@ApiBearerAuth()
@Controller('processes')
@UseGuards(JwtAuthGuard)
export class ProcessesController {
  constructor(private readonly service: ProcessesService) {}

  // ============================================
  // LISTAGEM
  // ============================================

  @Get()
  @ApiOperation({ summary: 'Listar todos os processos da empresa atual' })
  @ApiResponse({ status: 200, description: 'Lista de processos retornada.' })
  findAll(@CurrentUser() user: RequestUser) {
    // Usa o companyId do contexto JWT
    return this.service.findAll(user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Processo Completo (Revisão)' })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findOne(id, user.id);
  }

  // ============================================
  // WIZARD DE CRIAÇÃO
  // ============================================

  @Post()
  @ApiOperation({ summary: 'Passo 1: Criar Rascunho do Processo' })
  @ApiResponse({ status: 201, description: 'Rascunho criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Empresa não selecionada.' })
  createDraft(@CurrentUser() user: RequestUser, @Body() dto: CreateProcessWizardDto) {
    // Usa o companyId do contexto JWT
    if (!user.companyId) {
      throw new BadRequestException('Selecione uma empresa antes de criar processos.');
    }
    return this.service.createDraft(user.id, user.companyId, dto);
  }

  @Patch(':id/objective')
  @ApiOperation({ summary: 'Passo 2: Atualizar Objetivo e Metas' })
  updateObjective(@Param('id') id: string, @Body() dto: UpdateObjectiveDto) { 
    return this.service.updateDraft(id, dto);
  }

  @Patch(':id/scope')
  @ApiOperation({ summary: 'Passo 3: Atualizar Escopo e Fronteiras' })
  updateScope(@Param('id') id: string, @Body() dto: UpdateScopeDto) {
    return this.service.updateDraft(id, dto);
  }

  @Patch(':id/details')
  @ApiOperation({ summary: 'Passo 4: Atualizar Detalhes (SIPOC)' })
  updateDetails(@Param('id') id: string, @Body() dto: UpdateDetailsDto) {
    return this.service.updateDraft(id, dto);
  }

  @Patch(':id/flowchart')
  @ApiOperation({ summary: 'Passo 6: Salvar URL do Fluxograma' })
  updateFlowchart(@Param('id') id: string, @Body() dto: UpdateFlowchartDto) {
    return this.service.updateDraft(id, dto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Passo 7: Publicar Processo (Finalizar)' })
  publish(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.publish(id, user.id);
  }
}
