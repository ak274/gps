import { AttendanceStatus } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class ListAttendanceRecordsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attendanceSessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiPropertyOptional({ format: 'date', description: 'Session attendance date' })
  @IsOptional()
  @IsDateString()
  attendanceOn?: string;
}
