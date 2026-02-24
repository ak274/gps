import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListStudentAssessmentsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  examSubjectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentId?: string;
}

