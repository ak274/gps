import { AdmissionStatus, Gender } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdmissionApplicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiPropertyOptional()
  campusId!: string | null;

  @ApiProperty()
  academicYearId!: string;

  @ApiPropertyOptional()
  classRoomId!: string | null;

  @ApiPropertyOptional()
  studentId!: string | null;

  @ApiProperty({ enum: AdmissionStatus })
  status!: AdmissionStatus;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional()
  lastName!: string | null;

  @ApiProperty({ enum: Gender })
  gender!: Gender;

  @ApiProperty({ description: 'ISO date string' })
  dateOfBirth!: string;

  @ApiProperty()
  guardianFirstName!: string;

  @ApiPropertyOptional()
  guardianLastName!: string | null;

  @ApiPropertyOptional()
  guardianPhoneE164!: string | null;

  @ApiPropertyOptional()
  guardianEmail!: string | null;

  @ApiProperty()
  relationType!: string;

  @ApiPropertyOptional()
  notes!: string | null;

  @ApiPropertyOptional({ description: 'ISO datetime string' })
  submittedAt!: string | null;

  @ApiPropertyOptional({ description: 'ISO datetime string' })
  reviewedAt!: string | null;

  @ApiPropertyOptional({ description: 'ISO datetime string' })
  decidedAt!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}

