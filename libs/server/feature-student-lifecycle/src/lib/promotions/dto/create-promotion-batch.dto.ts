import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePromotionBatchDto {
  @ApiProperty({ description: 'School ID (CUID)' })
  @IsString()
  schoolId!: string;

  @ApiProperty({ description: 'From academic year ID (CUID)' })
  @IsString()
  fromAcademicYearId!: string;

  @ApiProperty({ description: 'To academic year ID (CUID)' })
  @IsString()
  toAcademicYearId!: string;

  @ApiProperty({ default: true, description: 'Auto-create initial mappings (based on gradeLevel + section suggestion)' })
  @IsOptional()
  @IsBoolean()
  autoCreateMappings?: boolean = true;
}

