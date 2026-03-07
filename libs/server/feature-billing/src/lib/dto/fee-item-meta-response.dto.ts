import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeeDiscountType } from './fee-item-discount-input.dto';

class FeeItemAttributeResponseDto {
  @ApiProperty()
  key!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty({ example: '500.00' })
  amount!: string;
}

class FeeItemDiscountResponseDto {
  @ApiProperty({ enum: FeeDiscountType })
  type!: FeeDiscountType;

  @ApiProperty({ example: '10.00' })
  value!: string;

  @ApiPropertyOptional()
  reason?: string;

  @ApiProperty({ example: '250.00' })
  appliedAmount!: string;
}

export class FeeItemMetaResponseDto {
  @ApiProperty({ enum: ['FLAT', 'ATTRIBUTE_SUM'] })
  pricingModel!: 'FLAT' | 'ATTRIBUTE_SUM';

  @ApiProperty({ example: '25000.00' })
  baseAmount!: string;

  @ApiProperty({ type: [FeeItemAttributeResponseDto], required: false })
  attributes?: FeeItemAttributeResponseDto[];

  @ApiPropertyOptional({ type: FeeItemDiscountResponseDto })
  discount?: FeeItemDiscountResponseDto;

  @ApiProperty({ example: '24750.00' })
  finalAmount!: string;
}
