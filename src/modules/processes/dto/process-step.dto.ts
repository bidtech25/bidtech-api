import { IsString, IsArray, IsUUID, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessStepDto {
  @ApiProperty({ 
    example: 'Aprovação de Compra',
    description: 'Nome da etapa do processo'
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ 
    example: 'Gerente analisa requisição e aprova ou rejeita com base no orçamento',
    description: 'Descrição detalhada da etapa'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: ['Requisição preenchida', 'Orçamentos anexados', 'Aprovação do diretor'],
    description: 'Entradas necessárias para executar esta etapa'
  })
  @IsArray()
  @IsString({ each: true })
  inputs: string[];

  @ApiProperty({ 
    example: ['Requisição aprovada', 'Email de confirmação enviado'],
    description: 'Saídas geradas por esta etapa'
  })
  @IsArray()
  @IsString({ each: true })
  outputs: string[];

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do colaborador responsável por executar esta etapa'
  })
  @IsUUID()
  responsibleId: string; // Links to collaborators.id

  @ApiProperty({
    example: 1,
    description: 'Ordem de execução da etapa',
    required: false
  })
  @IsOptional()
  order?: number;
}
