import { ApiProperty } from '@nestjs/swagger';
import { FeeItemResponseDto } from './fee-item-response.dto';

export class FeePlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  academicYearId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: [FeeItemResponseDto] })
  items!: FeeItemResponseDto[];

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
