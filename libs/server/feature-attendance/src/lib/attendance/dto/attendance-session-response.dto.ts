import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttendanceSessionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  classRoomId!: string;

  @ApiPropertyOptional()
  subjectId!: string | null;

  @ApiPropertyOptional()
  periodNo!: number | null;

  @ApiProperty({ description: 'ISO date string' })
  attendanceOn!: string;

  @ApiPropertyOptional()
  markedByStaffId!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
