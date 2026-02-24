import { ExitReason, ExitRequestStatus } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';

export class ExitRequestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty({ enum: ExitRequestStatus })
  status!: ExitRequestStatus;

  @ApiProperty({ enum: ExitReason })
  reason!: ExitReason;

  @ApiProperty({ nullable: true })
  forwardingSchoolName!: string | null;

  @ApiProperty({ nullable: true })
  forwardingSchoolAddress!: string | null;

  @ApiProperty({ nullable: true })
  notes!: string | null;

  @ApiProperty({ nullable: true })
  decisionNotes!: string | null;

  @ApiProperty()
  requestedById!: string;

  @ApiProperty({ nullable: true })
  decidedById!: string | null;

  @ApiProperty({ nullable: true })
  effectiveOn!: string | null;

  @ApiProperty({ nullable: true })
  requestedAt!: string | null;

  @ApiProperty({ nullable: true })
  decidedAt!: string | null;

  @ApiProperty({ nullable: true })
  completedAt!: string | null;

  @ApiProperty()
  createdAt!: string;
}

