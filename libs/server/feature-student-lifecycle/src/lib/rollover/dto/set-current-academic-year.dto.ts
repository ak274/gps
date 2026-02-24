import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetCurrentAcademicYearDto {
  @ApiProperty({ description: 'School ID (CUID)' })
  @IsString()
  schoolId!: string;

  @ApiProperty({ description: 'Academic year ID (CUID)' })
  @IsString()
  academicYearId!: string;
}

