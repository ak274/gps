import { ExamStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExamSubjectResponseDto } from './exam-subject-response.dto';

export class ExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  academicYearId!: string;

  @ApiPropertyOptional()
  termId!: string | null;

  @ApiProperty()
  classRoomId!: string;

  @ApiPropertyOptional()
  teacherId!: string | null;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  examType!: string;

  @ApiProperty({ description: 'ISO date string' })
  startsOn!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  endsOn!: string | null;

  @ApiProperty({ enum: ExamStatus })
  status!: ExamStatus;

  @ApiProperty({ type: [ExamSubjectResponseDto] })
  subjects!: ExamSubjectResponseDto[];

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}

