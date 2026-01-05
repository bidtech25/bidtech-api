import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInputDto {
  @ApiProperty({ description: 'Name of the input' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Source of the input', required: false })
  @IsString()
  @IsOptional()
  source?: string;
}
