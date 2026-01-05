import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Cliente X Ltda', description: 'Company Name' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: '12.345.678/0001-90', description: 'CNPJ' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ example: 'João Gestor', description: 'Manager Name' })
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty({ example: 'joao@clientex.com.br', description: 'Manager Email' })
  @IsEmail()
  @IsNotEmpty()
  managerEmail: string;
}
