import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwitchCompanyDto {
  @ApiProperty({ 
    example: 'bb012f6b-2c47-4fd2-8bb7-dad4668fa837', 
    description: 'ID da empresa para trocar o contexto' 
  })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}
