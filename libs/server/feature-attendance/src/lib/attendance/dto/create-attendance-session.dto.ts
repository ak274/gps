import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAttendanceSessionDto {
  @ApiProperty()
  @IsString()
  classRoomId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subjectId?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  periodNo?: number;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  attendanceOn!: string;

  @ApiPropertyOptional({ description: 'Staff profile ID of marker' })
  @IsOptional()
  @IsString()
  markedByStaffId?: string;
}
