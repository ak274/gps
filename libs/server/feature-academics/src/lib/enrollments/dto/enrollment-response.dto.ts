import { EnrollmentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  classRoomId!: string;

  @ApiProperty()
  academicYearId!: string;

  @ApiProperty({ enum: EnrollmentStatus })
  status!: EnrollmentStatus;

  @ApiProperty({ description: 'ISO date string' })
  enrolledOn!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  leftOn!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
