import { AdmissionStatus, Gender } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdmissionApplicationResponseDto {
  @ApiPropertyOptional()
  formId!: string | null;

  @ApiPropertyOptional()
  formVersion!: number | null;

  @ApiPropertyOptional()
  applicationNumber!: string | null;

  @ApiPropertyOptional({ type: Object })
  formData!: Record<string, unknown> | null;

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

  @ApiPropertyOptional()
  infoRequestedAt!: string | null;

  @ApiPropertyOptional()
  infoRequestMessage!: string | null;

  @ApiPropertyOptional()
  offerIssuedAt!: string | null;

  @ApiPropertyOptional()
  offerExpiresAt!: string | null;

  @ApiPropertyOptional()
  feesClearedAt!: string | null;

  @ApiPropertyOptional()
  finalVerifiedAt!: string | null;

  @ApiPropertyOptional()
  enrollmentConfirmedAt!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}

