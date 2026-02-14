import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class PaymentAllocationInputDto {
  @ApiProperty()
  @IsString()
  invoiceId!: string;

  @ApiProperty({ example: '500.00' })
  @IsNumberString()
  amount!: string;
}
