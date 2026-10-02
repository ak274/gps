import { FeeAdjustmentType, FeeBillingCycle } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateFeeAdjustmentDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classRoomId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feePlanId?: string;

  @ApiProperty({ example: 'TRANSPORT' })
  @IsString()
  @Length(2, 30)
  code!: string;

  @ApiProperty({ example: 'Bus transport' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: '1500.00' })
  @IsNumberString()
  amount!: string;

  @ApiProperty({ enum: FeeAdjustmentType })
  @IsEnum(FeeAdjustmentType)
  type!: FeeAdjustmentType;

  @ApiPropertyOptional({ enum: FeeBillingCycle, default: FeeBillingCycle.ONE_TIME })
  @IsOptional()
  @IsEnum(FeeBillingCycle)
  billingCycle?: FeeBillingCycle;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
