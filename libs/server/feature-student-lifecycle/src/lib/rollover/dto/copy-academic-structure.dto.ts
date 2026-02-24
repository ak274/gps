import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CopyAcademicStructureDto {
  @ApiProperty({ description: 'School ID (CUID)' })
  @IsString()
  schoolId!: string;

  @ApiProperty({ description: 'From academic year ID (CUID)' })
  @IsString()
  fromAcademicYearId!: string;

  @ApiProperty({ description: 'To academic year ID (CUID)' })
  @IsString()
  toAcademicYearId!: string;

  @ApiPropertyOptional({ default: true, description: 'Copy classroom -> subject mappings (teacher assignment is cleared)' })
  @IsOptional()
  @IsBoolean()
  copyClassroomSubjects?: boolean = true;
}

