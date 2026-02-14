import { EnrollmentStatus, Gender } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentSummaryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  schoolId!: string;

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
}
