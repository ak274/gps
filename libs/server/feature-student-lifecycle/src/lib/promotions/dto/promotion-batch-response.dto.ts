import { PromotionBatchStatus } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';

export class PromotionBatchResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  fromAcademicYearId!: string;

  @ApiProperty()
  toAcademicYearId!: string;

  @ApiProperty({ enum: PromotionBatchStatus })
  status!: PromotionBatchStatus;

  @ApiProperty({ nullable: true })
  appliedAt!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

