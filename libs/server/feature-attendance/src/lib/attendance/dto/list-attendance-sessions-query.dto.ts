import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ListAttendanceSessionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classRoomId?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  attendanceOn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subjectId?: string;
}
