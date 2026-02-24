import { HomeworkStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HomeworkResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  classRoomId!: string;

  @ApiPropertyOptional()
  subjectId!: string | null;

  @ApiPropertyOptional()
  teacherId!: string | null;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description!: string | null;

  @ApiProperty({ description: 'ISO date string' })
  assignedOn!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  dueOn!: string | null;

  @ApiProperty({ enum: HomeworkStatus })
  status!: HomeworkStatus;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}

