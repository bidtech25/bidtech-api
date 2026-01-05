import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProcessDto {
  @ApiProperty({ example: 'Recrutamento e Seleção' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Processo padronizado de contratação de novos colaboradores', required: false })
  @IsString()
  @IsOptional()
  processDescription?: string;
}

export class UpdateProcessDto {
  @ApiProperty({ example: 'Recrutamento e Seleção 2.0', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Descrição atualizada', required: false })
  @IsString()
  @IsOptional()
  processDescription?: string;
}
