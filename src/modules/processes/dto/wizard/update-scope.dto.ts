import { IsArray, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScopeDto {
  @ApiPropertyOptional({ description: 'Onde o processo começa' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  scopeStart?: string;

  @ApiPropertyOptional({ description: 'Onde o processo termina' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  scopeEnd?: string;

  @ApiPropertyOptional({ 
    description: 'Itens dentro do escopo',
    type: [String],
    example: ['Recebimento de pedidos', 'Aprovação gerencial']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inScope?: string[];

  @ApiPropertyOptional({ 
    description: 'Itens fora do escopo',
    type: [String],
    example: ['Pagamentos', 'Logística']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  outOfScope?: string[];

  @ApiPropertyOptional({ 
    description: 'Áreas envolvidas',
    type: [String],
    example: ['Vendas', 'TI', 'RH']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  involvedAreas?: string[];

  @ApiPropertyOptional({ 
    description: 'Pessoas envolvidas (array após ALTER TABLE)',
    type: [String],
    example: ['João Silva', 'Maria Santos']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  involvedPeople?: string[];
}
