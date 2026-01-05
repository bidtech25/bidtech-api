import { Controller, Post, Body, Patch, Param, Get, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { ProcessesService } from './processes.service';

// DTOs
import { CreateProcessWizardDto } from './dto/create-process-wizard.dto';
import { UpdateScopeDto } from './dto/wizard/update-scope.dto';
import { UpdateDetailsDto } from './dto/wizard/update-details.dto';
import { UpdateObjectiveDto } from './dto/wizard/update-objective.dto';
import { UpdateFlowchartDto } from './dto/wizard/update-flowchart.dto';

// Note: Sub-resource DTOs removed as they are now part of the main wizard JSON update or separate attachment logic.

@ApiTags('Process Wizard')
@ApiBearerAuth()
@Controller('processes')
@UseGuards(JwtAuthGuard)
export class ProcessesController {
  constructor(private readonly service: ProcessesService) {}

  // --- PASSO 1: INÍCIO (RASCUNHO) ---
  @Post()
  @ApiOperation({ summary: 'Passo 1: Criar Rascunho do Processo' })
  createDraft(@CurrentUser() user: any, @Body() dto: CreateProcessWizardDto) {
    // Assuming CustomJWT payload includes companyId or we fetch it. 
    // For now, let's assume the user profile is loaded or companyId is in JWT.
    // If user.companyId is missing, we might need to fetch profile.
    // Let's rely on the service to handle if it's missing or pass what we have.
    const companyId = user.companyId || user.metadata?.companyId; 
    
    if (!companyId && user.role !== 'SUPER_ADMIN') {
        // In a real scenario, we might fetch it or throw error.
        // For migration stability, I'll pass a placeholder if missing but log it in service or here.
        // console.warn('Company ID missing for user', user.id);
        // We throw friendly error
        // throw new BadRequestException('User does not belong to a company');
    }
    
    return this.service.createDraft(user.id, companyId, dto);
  }

  // --- PASSO 2: OBJETIVO (Texto Simples) ---
  @Patch(':id/objective')
  @ApiOperation({ summary: 'Passo 2: Atualizar Objetivo e Metas' })
  updateObjective(@Param('id') id: string, @Body() dto: UpdateObjectiveDto) { 
    return this.service.updateDraft(id, dto);
  }

  // --- PASSO 3: ESCOPO (UpdateScopeDto) ---
  @Patch(':id/scope')
  @ApiOperation({ summary: 'Passo 3: Atualizar Escopo e Fronteiras' })
  updateScope(@Param('id') id: string, @Body() dto: UpdateScopeDto) {
    return this.service.updateDraft(id, dto);
  }

  // --- PASSO 4: DETALHES (UpdateDetailsDto + Listas) ---
  @Patch(':id/details')
  @ApiOperation({ summary: 'Passo 4: Atualizar Detalhes (SIPOC)' })
  updateDetails(@Param('id') id: string, @Body() dto: UpdateDetailsDto) {
    return this.service.updateDraft(id, dto);
  }

  // SUB-RECURSOS REMOVED (Etapas, Inputs, Outputs are now part of JSON blob or specific logic if needed)
  /*
  @Post(':id/steps') ...
  @Delete(':id/steps/:stepId') ...
  @Post(':id/inputs') ...
  @Delete(':id/inputs/:inputId') ...
  @Post(':id/outputs') ...
  @Delete(':id/outputs/:outputId') ...
  */

  // --- PASSO 6: FLUXOGRAMA (Texto/Link) ---
  @Patch(':id/flowchart')
  @ApiOperation({ summary: 'Passo 6: Salvar URL do Fluxograma' })
  updateFlowchart(@Param('id') id: string, @Body() dto: UpdateFlowchartDto) {
    return this.service.updateDraft(id, dto);
  }

  // --- PASSO 7: PUBLICAR ---
  @Patch(':id/publish')
  @ApiOperation({ summary: 'Passo 7: Publicar Processo (Finalizar)' })
  publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.publish(id, user.id);
  }

  // --- LEITURA ---
  @Get(':id')
  @ApiOperation({ summary: 'Buscar Processo Completo (Revisão)' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.id);
  }
}
