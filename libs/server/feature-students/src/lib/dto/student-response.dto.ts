import { EnrollmentStatus, Gender } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiPropertyOptional()
  campusId!: string | null;

  @ApiProperty()
  admissionNo!: string;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional()
  lastName!: string | null;

  @ApiProperty({ enum: Gender })
  gender!: Gender;

  @ApiProperty({ enum: EnrollmentStatus })
  currentStatus!: EnrollmentStatus;

  @ApiPropertyOptional({ description: 'ISO date string' })
  dateOfBirth!: string | null;

  @ApiPropertyOptional({ description: 'ISO date string' })
  joinedOn!: string | null;

  @ApiPropertyOptional()
  profilePhotoKey!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
