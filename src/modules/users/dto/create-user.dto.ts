import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export class CreateUserDto {
  @ApiProperty({ example: 'employee@bidtech.com.br', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'USER', description: 'User role', enum: UserRole, required: false })
  @IsString()
  @IsOptional()
  role?: string;
}
