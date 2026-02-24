import { AttendanceStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class MarkAttendanceRecordsDto {
  @ApiProperty({
    enum: AttendanceStatus,
    description:
      'Status to apply to the selected students. If studentIds is omitted, this status is applied to the full class.',
  })
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @ApiPropertyOptional({
    description:
      'If provided, applies `status` only to these students (unless remainingStatus is also provided).',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  studentIds?: string[];

  @ApiPropertyOptional({
    enum: AttendanceStatus,
    description:
      'If provided along with studentIds, this status will be applied to all other active students in the class session.',
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  remainingStatus?: AttendanceStatus;

  @ApiPropertyOptional({ description: 'Optional remarks applied to records created/updated by this request.' })
  @IsOptional()
  @IsString()
  remarks?: string;
}

