import { ApiProperty } from '@nestjs/swagger';

export class PaymentAllocationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  invoiceId!: string;

  @ApiProperty({ example: '500.00' })
  amount!: string;
}
