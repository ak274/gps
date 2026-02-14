import { PaymentMethod, PaymentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumberString, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { PaymentAllocationInputDto } from './payment-allocation-input.dto';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  studentId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 60)
  receiptNumber!: string;

  @ApiProperty()
  @IsDateString()
  paidAt!: string;

  @ApiProperty({ example: '1200.00' })
  @IsNumberString()
  amount!: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({ enum: PaymentStatus, default: PaymentStatus.COMPLETED })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ default: 'INR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currencyCode?: string;

  @ApiPropertyOptional({ type: [PaymentAllocationInputDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationInputDto)
  allocations?: PaymentAllocationInputDto[];
}
