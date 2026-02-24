import { PromotionAction, PromotionDecision } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';

class PromotionPreviewStudentDto {
  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  admissionNo!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty({ nullable: true })
  lastName!: string | null;

  @ApiProperty({ description: 'Computed eligibility for this decision/mapping' })
  isEligible!: boolean;

  @ApiProperty({ nullable: true })
  ineligibleReason!: string | null;

  @ApiProperty({ enum: PromotionDecision })
  decision!: PromotionDecision;

  @ApiProperty({ nullable: true })
  targetClassRoomId!: string | null;

  @ApiProperty({ nullable: true })
  remarks!: string | null;
}

class PromotionPreviewClassDto {
  @ApiProperty()
  fromClassRoomId!: string;

  @ApiProperty()
  fromGradeLevel!: string;

  @ApiProperty({ nullable: true })
  fromSection!: string | null;

  @ApiProperty({ enum: PromotionAction })
  action!: PromotionAction;

  @ApiProperty({ nullable: true })
  toClassRoomId!: string | null;

  @ApiProperty({ type: [PromotionPreviewStudentDto] })
  students!: PromotionPreviewStudentDto[];
}

export class PromotionBatchPreviewResponseDto {
  @ApiProperty()
  batchId!: string;

  @ApiProperty({ type: [PromotionPreviewClassDto] })
  classes!: PromotionPreviewClassDto[];
}
