import { EnrollmentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  studentId!: string;

  @ApiProperty()
  @IsString()
  classRoomId!: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  enrolledOn!: string;

  @ApiPropertyOptional({ enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  leftOn?: string;
}
