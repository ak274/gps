import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export enum FeeDiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class FeeItemDiscountInputDto {
  @ApiProperty({ enum: FeeDiscountType })
  @IsEnum(FeeDiscountType)
  type!: FeeDiscountType;

  @ApiProperty({ example: '10.00', description: 'Percentage (0-100) or fixed amount based on type' })
  @IsNumberString()
  value!: string;

  @ApiPropertyOptional({ example: 'Sibling discount' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  reason?: string;
}
