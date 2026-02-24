import { PromotionDecision } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';

export class PromotionLetterResponseDto {
  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  admissionNo!: string;

  @ApiProperty()
  studentName!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  fromAcademicYearId!: string;

  @ApiProperty()
  toAcademicYearId!: string;

  @ApiProperty()
  fromClassRoomId!: string;

  @ApiProperty({ nullable: true })
  toClassRoomId!: string | null;

  @ApiProperty({ enum: PromotionDecision })
  decision!: PromotionDecision;

  @ApiProperty()
  issuedAt!: string;
}

