import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFlowchartDto {
  @ApiProperty({ description: 'URL of the generated flowchart', required: false })
  @IsOptional()
  @IsUrl()
  flowchartUrl?: string;

  @ApiProperty({ description: 'BPMN Code/XML of the flowchart', required: false })
  @IsOptional()
  @IsString()
  bpmnCode?: string;
}