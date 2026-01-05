import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateProcessWizardDto {
  @IsString()
  name: string;

  @IsUUID()
  sectorId: string;

  @IsUUID()
  roleId: string;

  @IsString()
  @IsOptional()
  processOwner?: string;
}
