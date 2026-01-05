import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateProcessDraftDto {
  // Passo 2
  @IsOptional() @IsString() objective?: string;
  @IsOptional() @IsString() problemSolved?: string;
  @IsOptional() @IsString() expectedResult?: string;
  @IsOptional() @IsString() successMetric?: string;
  @IsOptional() @IsString() failureImpact?: string;

  // Passo 3 (Arrays do Postgres)
  @IsOptional() @IsArray() @IsString({ each: true }) inScope?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) outOfScope?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) involvedAreas?: string[];

  // Passo 6
  @IsOptional() @IsString() flowchartUrl?: string;
  @IsOptional() @IsString() bpmnCode?: string;
}
