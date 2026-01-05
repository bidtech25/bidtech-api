import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateObjectiveDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  problemSolved?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  expectedResult?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  successMetric?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  failureImpact?: string;
}
