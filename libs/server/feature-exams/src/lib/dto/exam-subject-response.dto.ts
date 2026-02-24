import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExamSubjectResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  examId!: string;

  @ApiProperty()
  subjectId!: string;

  @ApiProperty({ example: '100.00' })
  maxMarks!: string;

  @ApiPropertyOptional({ example: '33.00' })
  passMarks!: string | null;

  @ApiPropertyOptional({ example: '1.00' })
  weightage!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}

