import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentAssessmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  examId!: string;

  @ApiProperty()
  examSubjectId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiPropertyOptional({ example: '87.50' })
  marksObtained!: string | null;

  @ApiPropertyOptional()
  grade!: string | null;

  @ApiPropertyOptional()
  remarks!: string | null;

  @ApiPropertyOptional({ description: 'ISO datetime string' })
  publishedAt!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}

