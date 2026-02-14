import { AttendanceStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TeacherAttendanceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  teacherId!: string;

  @ApiProperty({ description: 'ISO date string' })
  attendanceOn!: string;

  @ApiProperty({ enum: AttendanceStatus })
  status!: AttendanceStatus;

  @ApiPropertyOptional()
  remarks!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  markedAt!: string;
}
