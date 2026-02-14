import { PaymentMethod, PaymentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentAllocationResponseDto } from './payment-allocation-response.dto';

export class PaymentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  receiptNumber!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  paidAt!: string;

  @ApiProperty({ example: '1200.00' })
  amount!: string;

  @ApiProperty({ enum: PaymentMethod })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiPropertyOptional()
  reference!: string | null;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty({ type: [PaymentAllocationResponseDto] })
  allocations!: PaymentAllocationResponseDto[];

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
