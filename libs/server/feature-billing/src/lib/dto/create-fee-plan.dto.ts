import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FeeBillingCycle } from '@gps/data-access-prisma';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';
import { FeeItemInputDto } from './fee-item-input.dto';

export class CreateFeePlanDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional({ default: 'INR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currencyCode?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: FeeBillingCycle, default: FeeBillingCycle.ANNUAL })
  @IsOptional()
  @IsEnum(FeeBillingCycle)
  billingCycle?: FeeBillingCycle;

  @ApiPropertyOptional({ description: 'Day of month when recurring invoices are due' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(28)
  dueDay?: number;

  @ApiProperty({ type: [FeeItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FeeItemInputDto)
  items!: FeeItemInputDto[];
}
