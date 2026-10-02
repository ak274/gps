import { FeeBillingCycle } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateInvoiceScheduleDto {
  @ApiProperty() @IsString() schoolId!: string;
  @ApiProperty() @IsString() academicYearId!: string;
  @ApiProperty() @IsString() feePlanId!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ enum: FeeBillingCycle }) @IsEnum(FeeBillingCycle) billingCycle!: FeeBillingCycle;
  @ApiProperty({ format: 'date' }) @IsDateString() startsOn!: string;
  @ApiPropertyOptional({ format: 'date' }) @IsOptional() @IsDateString() endsOn?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @IsInt() @Min(1) @Max(28) issueDay?: number;
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @IsInt() @Min(1) @Max(28) dueDay?: number;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() autoPublish?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() autoEmail?: boolean;
}
