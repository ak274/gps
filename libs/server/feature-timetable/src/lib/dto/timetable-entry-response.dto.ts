import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimetableEntryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  classRoomId!: string;

  @ApiProperty()
  subjectId!: string;

  @ApiPropertyOptional()
  teacherId?: string | null;

  @ApiProperty()
  dayOfWeek!: number;

  @ApiProperty({ example: '08:30:00' })
  startTime!: string;

  @ApiProperty({ example: '09:15:00' })
  endTime!: string;

  @ApiPropertyOptional()
  location?: string | null;

  @ApiProperty()
  createdAt!: string;
}
