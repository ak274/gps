import { ExitReason } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateExitRequestDto {
  @ApiProperty({ description: 'School ID (CUID)' })
  @IsString()
  schoolId!: string;

  @ApiProperty({ description: 'Student ID (CUID)' })
  @IsString()
  studentId!: string;

  @ApiProperty({ enum: ExitReason })
  @IsEnum(ExitReason)
  reason!: ExitReason;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  forwardingSchoolName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  forwardingSchoolAddress?: string;

  @ApiPropertyOptional({ description: 'Effective date for exit (YYYY-MM-DD). Defaults to today.' })
  @IsOptional()
  @IsDateString()
  effectiveOn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

