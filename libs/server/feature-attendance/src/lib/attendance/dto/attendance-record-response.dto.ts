import { AttendanceStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttendanceRecordResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  attendanceSessionId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty({ enum: AttendanceStatus })
  status!: AttendanceStatus;

  @ApiPropertyOptional()
  remarks!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  markedAt!: string;
}
