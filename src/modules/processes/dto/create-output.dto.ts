import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOutputDto {
  @ApiProperty({ description: 'Name of the output' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Destination of the output', required: false })
  @IsString()
  @IsOptional()
  destination?: string;
}
