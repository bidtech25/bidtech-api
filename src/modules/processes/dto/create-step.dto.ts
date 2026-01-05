import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStepDto {
  @ApiProperty({ description: 'Description of the step' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Responsible role or person' })
  @IsString()
  @IsOptional()
  responsible?: string;

  @ApiProperty({ description: 'Order index of the step' })
  @IsNumber()
  orderIndex: number;
}
