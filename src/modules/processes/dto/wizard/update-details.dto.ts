import { IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProcessStepDto } from '../process-step.dto';

class SipocDto {
  @ApiProperty({ example: ['Fornecedor A', 'Fornecedor B'] })
  @IsArray()
  @IsOptional()
  suppliers?: string[];

  @ApiProperty({ example: ['Matéria prima', 'Especificações técnicas'] })
  @IsArray()
  @IsOptional()
  inputs?: string[];

  @ApiProperty({ example: ['Produto acabado', 'Relatório de qualidade'] })
  @IsArray()
  @IsOptional()
  outputs?: string[];

  @ApiProperty({ example: ['Cliente final', 'Distribuidor'] })
  @IsArray()
  @IsOptional()
  customers?: string[];
}

export class UpdateDetailsDto {
  @ApiProperty({ 
    type: [ProcessStepDto],
    description: 'Array de etapas do processo com responsáveis'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessStepDto)
  steps?: ProcessStepDto[];

  @ApiProperty({ 
    type: SipocDto,
    description: 'SIPOC: Suppliers, Inputs, Process, Outputs, Customers'
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SipocDto)
  sipoc?: SipocDto;
}
